// End-to-end self-test: build a tiny resume, ask AI to optimize it,
// then ask AI to write a cover-letter intro for a sample job.
// Returns { steps: [...], ok: boolean } with per-step status + error.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SAMPLE_RESUME = {
  personalInfo: { fullName: "Test User", email: "test@example.com", summary: "Senior software engineer with 6 years of experience in TypeScript and React." },
  experience: [{ company: "Acme", position: "Senior Engineer", duration: "2021-2024", description: "Built scalable web apps; led a team of 4." }],
  education: [{ institution: "MIT", degree: "BS CS", year: "2018" }],
  skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "AWS"],
};

const SAMPLE_JOB = { title: "Senior Frontend Engineer", company: "TechCo", description: "Looking for a React/TS expert to scale our platform." };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const steps: { name: string; ok: boolean; ms: number; error?: string; data?: unknown }[] = [];
  const supaUrl = Deno.env.get("SUPABASE_URL")!;
  const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
  const authHeader = req.headers.get("Authorization") || `Bearer ${anon}`;

  const callFn = async (name: string, body: unknown) => {
    const t = Date.now();
    try {
      const r = await fetch(`${supaUrl}/functions/v1/${name}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: authHeader, apikey: anon },
        body: JSON.stringify(body),
      });
      const text = await r.text();
      let parsed: any = text;
      try { parsed = JSON.parse(text); } catch {}
      const ok = r.ok && (parsed?.success !== false);
      steps.push({ name, ok, ms: Date.now() - t, error: ok ? undefined : (parsed?.error || `HTTP ${r.status}`), data: ok ? parsed : undefined });
      return ok ? parsed : null;
    } catch (e) {
      steps.push({ name, ok: false, ms: Date.now() - t, error: e instanceof Error ? e.message : String(e) });
      return null;
    }
  };

  // Step 1: optimize a sample resume (also exercises Smart Apply guest gate)
  const opt = await callFn("smart-match", { action: "optimize", resumeData: SAMPLE_RESUME });
  // Step 2: search jobs using top skill
  if (opt) await callFn("search-jobs", { query: "React Engineer", location: "Remote", limit: 3 });
  // Step 3: generate cover letter intros
  if (opt) await callFn("smart-match", { action: "generate-cover-letters", resumeData: { ...SAMPLE_RESUME, jobs: [SAMPLE_JOB] } });

  const ok = steps.every((s) => s.ok);
  return new Response(JSON.stringify({ ok, steps }), {
    status: ok ? 200 : 207,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});