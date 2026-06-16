import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MODEL = "google/gemini-2.5-pro"; // accepts video input

const EXTRACTION_PROMPT = `You are an expert resume writer. Watch and listen to this candidate's introduction video.
Transcribe what they say, then extract a structured resume.

Return ONLY strict JSON with this exact shape:
{
  "personalInfo": { "fullName": string, "email": string, "phone": string, "location": string, "summary": string (3-4 sentences) },
  "experience": [ { "company": string, "position": string, "duration": string, "description": string (3-5 bullet-style lines separated by \\n, each starting with a strong action verb and quantified outcome where possible) } ],
  "education": [ { "institution": string, "degree": string, "year": string } ],
  "skills": string[]  // 8-15 relevant skills inferred from the video
}

If a field is not mentioned, use an empty string (or empty array). Always produce a polished summary even if the candidate only gave a brief intro.`;

async function processJob(jobId: string, storagePath: string, admin: ReturnType<typeof createClient>) {
  const setStatus = (status: string, patch: Record<string, unknown> = {}) =>
    admin.from("video_jobs").update({ status, ...patch }).eq("id", jobId);

  try {
    await setStatus("downloading", { progress: 10 });
    const { data: blob, error: dlErr } = await admin.storage.from("uploads").download(storagePath);
    if (dlErr || !blob) throw new Error(`Download failed: ${dlErr?.message || "unknown"}`);

    await setStatus("transcribing", { progress: 35 });
    const buf = new Uint8Array(await blob.arrayBuffer());
    // base64 encode in chunks (videos can be large)
    let binary = "";
    const chunk = 0x8000;
    for (let i = 0; i < buf.length; i += chunk) {
      binary += String.fromCharCode.apply(null, Array.from(buf.subarray(i, i + chunk)));
    }
    const base64 = btoa(binary);
    const mime = blob.type || "video/mp4";

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    await setStatus("extracting", { progress: 60 });
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: "You always return strict JSON only — no prose, no markdown fences." },
          {
            role: "user",
            content: [
              { type: "text", text: EXTRACTION_PROMPT },
              { type: "image_url", image_url: { url: `data:${mime};base64,${base64}` } },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      throw new Error(`AI gateway ${res.status}: ${t.slice(0, 300)}`);
    }
    const data = await res.json();
    const content: string = data.choices?.[0]?.message?.content ?? "";
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Model did not return JSON");
    const resume = JSON.parse(match[0]);

    await admin.from("video_jobs").update({
      status: "completed",
      progress: 100,
      result: resume,
    }).eq("id", jobId);

    // Clean up the uploaded video to save storage
    await admin.storage.from("uploads").remove([storagePath]);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("video-to-resume failed", msg);
    await admin.from("video_jobs").update({
      status: "failed",
      error: msg.slice(0, 500),
    }).eq("id", jobId);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { storagePath, guestId } = body as { storagePath?: string; guestId?: string };
    if (!storagePath || typeof storagePath !== "string") {
      return new Response(JSON.stringify({ error: "storagePath required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Resolve user (optional)
    let userId: string | null = null;
    if (authHeader) {
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: { user } } = await userClient.auth.getUser();
      userId = user?.id ?? null;
    }

    const admin = createClient(supabaseUrl, serviceKey);

    const { data: job, error: jobErr } = await admin
      .from("video_jobs")
      .insert({
        user_id: userId,
        guest_id: userId ? null : (guestId ?? crypto.randomUUID()),
        storage_path: storagePath,
        status: "queued",
        progress: 5,
      })
      .select("id")
      .single();
    if (jobErr || !job) throw new Error(jobErr?.message || "Failed to create job");

    // Process in background so the request returns immediately
    // @ts-ignore - EdgeRuntime is available in Deno deploy
    EdgeRuntime.waitUntil(processJob(job.id, storagePath, admin));

    return new Response(JSON.stringify({ jobId: job.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});