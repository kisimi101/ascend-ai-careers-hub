import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Public, unauthenticated preview endpoint. Generates a short tailored resume
// preview from a target role + job description. Rate-limited per IP via simple
// in-memory window (best-effort; resets when the function cold-starts).
const ipHits = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || now - entry.ts > WINDOW_MS) {
    ipHits.set(ip, { count: 1, ts: now });
    return true;
  }
  if (entry.count >= MAX_PER_WINDOW) return false;
  entry.count++;
  return true;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!rateLimit(ip)) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again in a minute." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const role = String(body.role || "").trim().slice(0, 200);
    const jobDescription = String(body.jobDescription || "").trim().slice(0, 6000);
    const background = String(body.background || "").trim().slice(0, 2000);

    if (!role || !jobDescription) {
      return new Response(JSON.stringify({ error: "role and jobDescription are required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `Generate a tailored resume PREVIEW for this candidate.
Target role: ${role}
Candidate background (may be sparse): ${background || "Not provided — infer a realistic mid-level profile relevant to the role."}

Job description:
${jobDescription}

Return STRICT JSON only:
{
  "summary": "3-sentence professional summary tailored to the JD",
  "topSkills": ["8-12 skills mirroring the JD"],
  "bullets": ["5 achievement bullets with metrics, action verbs, ATS keywords"],
  "atsScore": <number 60-95>,
  "matchedKeywords": ["6-10 keywords found"],
  "missingKeywords": ["4-8 keywords the candidate should add"]
}`;

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a senior resume writer. Return only valid JSON." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!r.ok) {
      const txt = await r.text();
      console.error("AI error", r.status, txt);
      if (r.status === 429) return new Response(JSON.stringify({ error: "AI rate-limited, retry shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (r.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI ${r.status}`);
    }

    const data = await r.json();
    const content = data.choices?.[0]?.message?.content || "";
    const m = content.match(/\{[\s\S]*\}/);
    if (!m) throw new Error("No JSON in AI response");
    const parsed = JSON.parse(m[0]);

    return new Response(JSON.stringify({ success: true, ...parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("tailored-resume-preview error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});