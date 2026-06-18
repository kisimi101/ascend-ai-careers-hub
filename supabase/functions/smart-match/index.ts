import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GUEST_APPLY_LIMIT = 1;

async function makeFingerprint(req: Request): Promise<string> {
  const ip = (req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown")
    .split(",")[0]
    .trim();
  const ua = req.headers.get("user-agent") || "ua";
  const lang = req.headers.get("accept-language") || "";
  const chUa = req.headers.get("sec-ch-ua") || "";
  const platform = req.headers.get("sec-ch-ua-platform") || "";
  const raw = `${ip}|${ua}|${lang}|${chUa}|${platform}`;
  const buf = new TextEncoder().encode(raw);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  const hex = Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${ip}:${hex.slice(0, 24)}`;
}

function admin() {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
}

async function getGuestApplyTotal(fingerprint: string): Promise<number> {
  const { data } = await admin()
    .from("guest_usage")
    .select("count")
    .eq("fingerprint", fingerprint)
    .eq("action", "smart-apply");
  return (data || []).reduce((s: number, r: any) => s + (r.count || 0), 0);
}

async function incrementGuestApply(fingerprint: string) {
  const today = new Date().toISOString().split("T")[0];
  const { data: existing } = await admin()
    .from("guest_usage")
    .select("id, count")
    .eq("fingerprint", fingerprint)
    .eq("action", "smart-apply")
    .eq("usage_date", today)
    .maybeSingle();
  if (existing?.id) {
    await admin().from("guest_usage").update({ count: (existing.count || 0) + 1, updated_at: new Date().toISOString() }).eq("id", existing.id);
  } else {
    await admin().from("guest_usage").insert({ fingerprint, action: "smart-apply", usage_date: today, count: 1 });
  }
}

async function isAuthed(req: Request): Promise<boolean> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return false;
  try {
    const client = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data } = await client.auth.getUser();
    return !!data?.user;
  } catch {
    return false;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { resumeData, action } = body;

    // Usage check endpoint — clients use this to render remaining counts.
    if (body.checkUsageOnly) {
      const authed = await isAuthed(req);
      if (authed) {
        return new Response(JSON.stringify({ tier: "user", used: 0, limit: null, remaining: null, isGuest: false }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const fp = await makeFingerprint(req);
      const used = await getGuestApplyTotal(fp);
      return new Response(JSON.stringify({
        tier: "guest",
        used,
        limit: GUEST_APPLY_LIMIT,
        remaining: Math.max(0, GUEST_APPLY_LIMIT - used),
        isGuest: true,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Server-side enforcement for guests on the apply pipeline.
    // The pipeline always begins with action="optimize"; gate it there so
    // generate-cover-letters in the same flow is implicitly allowed once started.
    let guestFingerprint: string | null = null;
    if (action === "optimize") {
      const authed = await isAuthed(req);
      if (!authed) {
        guestFingerprint = await makeFingerprint(req);
        const used = await getGuestApplyTotal(guestFingerprint);
        if (used >= GUEST_APPLY_LIMIT) {
          return new Response(
            JSON.stringify({
              error: `Free Smart Apply limit reached (${GUEST_APPLY_LIMIT}/${GUEST_APPLY_LIMIT}). Sign up free to keep applying.`,
              requiresSignup: true,
              tier: "guest",
              used,
              limit: GUEST_APPLY_LIMIT,
              remaining: 0,
            }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (action === "optimize") {
      // Step 1: Optimize the resume
      const resumeContext = `
Name: ${resumeData.personalInfo?.fullName || "N/A"}
Summary: ${resumeData.personalInfo?.summary || "N/A"}
Experience: ${(resumeData.experience || []).map((e: any) => `${e.position} at ${e.company} (${e.duration}) - ${e.description}`).join("\n")}
Education: ${(resumeData.education || []).map((e: any) => `${e.degree} from ${e.institution} (${e.year})`).join("\n")}
Skills: ${(resumeData.skills || []).join(", ")}
      `.trim();

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: "You are an expert resume optimizer and career coach. Return only valid JSON.",
            },
            {
              role: "user",
              content: `Analyze and optimize this resume. Return JSON with this structure:
{
  "optimizedSummary": "improved professional summary",
  "optimizedExperience": [{"company":"...","position":"...","duration":"...","description":"improved description with action verbs and metrics"}],
  "suggestedJobTitles": ["3-5 job titles this person should search for"],
  "keySkills": ["top skills to highlight"],
  "atsScore": number between 0-100,
  "improvements": ["list of specific improvements made"]
}

Resume:
${resumeContext}`,
            },
          ],
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("AI optimize error:", response.status, errText);
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
            status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Could not parse AI optimization response");

      const result = JSON.parse(jsonMatch[0]);
      if (guestFingerprint) {
        try { await incrementGuestApply(guestFingerprint); } catch (e) { console.error("guest_usage increment failed", e); }
      }
      return new Response(JSON.stringify({ success: true, ...result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "generate-cover-letters") {
      // Body was already consumed at the top of the handler.
      // Read jobs from the already-parsed body (resumeData.jobs or body.jobs).
      const jobsList = (resumeData && resumeData.jobs) || body.jobs || [];
      
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: "You are an expert cover letter writer. Return only valid JSON.",
            },
            {
              role: "user",
              content: `Generate short, tailored cover letter intros (2-3 sentences each) for each job listing below. The candidate's profile:
Name: ${resumeData.personalInfo?.fullName}
Summary: ${resumeData.personalInfo?.summary}
Skills: ${(resumeData.skills || []).join(", ")}

Jobs:
${jobsList.map((j: any, i: number) => `${i + 1}. ${j.title} at ${j.company} - ${j.description || "N/A"}`).join("\n")}

Return JSON: { "coverLetters": [{ "jobIndex": 0, "letter": "Dear Hiring Manager,..." }] }`,
            },
          ],
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("AI cover letter error:", response.status, errText);
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Could not parse cover letter response");

      const result = JSON.parse(jsonMatch[0]);
      return new Response(JSON.stringify({ success: true, ...result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "readiness" || action === "single-cover-letter") {
      const jobTitle = body.jobTitle || body.job?.title || "";
      const jobCompany = body.jobCompany || body.job?.company || "";
      const jobDescription = body.jobDescription || body.job?.description || "";
      const resumeContext = `
Name: ${resumeData?.personalInfo?.fullName || "N/A"}
Summary: ${resumeData?.personalInfo?.summary || "N/A"}
Experience: ${(resumeData?.experience || []).map((e: any) => `${e.position} at ${e.company} (${e.duration}) - ${e.description}`).join("\n")}
Education: ${(resumeData?.education || []).map((e: any) => `${e.degree} from ${e.institution} (${e.year})`).join("\n")}
Skills: ${(resumeData?.skills || []).join(", ")}
      `.trim();

      const prompt = action === "readiness"
        ? `Score how well this candidate matches the job. Return ONLY JSON:
{ "score": 0-100, "verdict": "Strong fit"|"Good fit"|"Partial fit"|"Weak fit",
  "matchedSkills": ["..."], "missingSkills": ["..."], "tips": ["short tip", "..."] }

Job: ${jobTitle} at ${jobCompany}
Description: ${jobDescription}

Resume:
${resumeContext}`
        : `Write a tailored 3-paragraph cover letter (≤220 words) for this job. Return ONLY JSON: { "letter": "Dear Hiring Manager,..." }

Job: ${jobTitle} at ${jobCompany}
Description: ${jobDescription}

Resume:
${resumeContext}`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "You are an expert career coach. Return only valid JSON." },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
        }),
      });
      if (!response.ok) {
        const t = await response.text();
        console.error("AI error", response.status, t);
        if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit, try again." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (response.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        throw new Error(`AI API error: ${response.status}`);
      }
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";
      const m = content.match(/\{[\s\S]*\}/);
      if (!m) throw new Error("Could not parse AI response");
      const result = JSON.parse(m[0]);
      return new Response(JSON.stringify({ success: true, ...result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Smart match error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
