import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MODEL = "google/gemini-2.5-flash";

async function callAI(messages: any[], expectJson = true) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: MODEL, messages }),
  });

  if (res.status === 429) throw new Error("RATE_LIMIT");
  if (res.status === 402) throw new Error("CREDITS_EXHAUSTED");
  if (!res.ok) {
    const t = await res.text();
    console.error("AI error", res.status, t);
    throw new Error("AI request failed");
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? "";
  if (!expectJson) return content;
  const match = content.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON returned from AI");
  return JSON.parse(match[0]);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const action = body.action as string;
    let result: unknown;

    switch (action) {
      case "check-resume": {
        // body: { resumeText?: string, fileBase64?: string, mimeType?: string, jobDescription?: string }
        const userContent: any[] = [
          {
            type: "text",
            text:
              `Analyze the attached resume for ATS compatibility and quality.\n` +
              (body.jobDescription
                ? `Target job description:\n${body.jobDescription}\n\n`
                : "") +
              `Return ONLY JSON with this shape:\n{\n  "overallScore": number (0-100),\n  "atsCompatibility": number (0-100),\n  "sections": [{ "name": string, "score": number, "feedback": string, "suggestions": string[] }],\n  "keywords": { "found": string[], "missing": string[] },\n  "formatting": { "score": number, "issues": string[] }\n}`,
          },
        ];
        if (body.resumeText) {
          userContent.push({ type: "text", text: `Resume text:\n${body.resumeText}` });
        } else if (body.fileBase64 && body.mimeType) {
          userContent.push({
            type: "image_url",
            image_url: { url: `data:${body.mimeType};base64,${body.fileBase64}` },
          });
        }
        result = await callAI([
          { role: "system", content: "You are an expert ATS resume reviewer. Always reply with strict JSON only." },
          { role: "user", content: userContent },
        ]);
        break;
      }

      case "enhance-resume": {
        // body: { resumeText: string }
        if (!body.resumeText) throw new Error("resumeText required");
        result = await callAI([
          { role: "system", content: "You are an expert resume writer. Reply with strict JSON only." },
          {
            role: "user",
            content:
              `Rewrite the resume below for maximum impact: stronger action verbs, quantified achievements, ATS keyword density, clear formatting. Return JSON:\n{\n  "enhancedResume": string (full rewritten resume, preserve newlines),\n  "overallScore": number (0-100, post-enhancement),\n  "improvements": [{ "category": string, "before": number, "after": number, "improvement": number }],\n  "suggestions": string[] (4-6 items describing what was changed)\n}\n\nResume:\n${body.resumeText}`,
          },
        ]);
        break;
      }

      case "generate-summary": {
        // body: { jobTitle, experience, skills, achievements }
        result = await callAI([
          { role: "system", content: "You are an expert resume writer. Reply with strict JSON only." },
          {
            role: "user",
            content:
              `Write a compelling 3-4 sentence professional summary for a resume. Return JSON: { "summary": string }\n\nDetails:\n- Job title: ${body.jobTitle}\n- Experience: ${body.experience}\n- Skills: ${body.skills}\n- Achievements: ${body.achievements}`,
          },
        ]);
        break;
      }

      case "generate-bullets": {
        // body: { jobTitle, industry, level, workDescription }
        result = await callAI([
          { role: "system", content: "You are an expert resume writer. Reply with strict JSON only." },
          {
            role: "user",
            content:
              `Generate 5 powerful, ATS-friendly resume bullet points from the description below. Each bullet starts with a strong action verb, includes a quantified outcome where reasonable. Return JSON: { "bullets": string[] (5 items, no leading bullet symbols) }\n\nJob title: ${body.jobTitle}\nIndustry: ${body.industry || "general"}\nLevel: ${body.level || "unspecified"}\nDescription: ${body.workDescription}`,
          },
        ]);
        break;
      }

      case "career-plan": {
        // body: { currentRole, industry, yearsExperience, careerGoal }
        result = await callAI([
          { role: "system", content: "You are an expert career strategist. Reply with strict JSON only." },
          {
            role: "user",
            content:
              `Generate a realistic career progression plan. Return JSON with EXACTLY this shape:\n{\n  "currentRole": { "title": string, "level": string, "salaryRange": string, "yearsExperience": string, "skills": string[], "description": string, "isCurrentRole": true },\n  "paths": [\n    { "direction": string, "description": string, "timeline": string,\n      "roles": [{ "title": string, "level": string, "salaryRange": string, "yearsExperience": string, "skills": string[], "description": string }],\n      "requiredSkills": string[],\n      "recommendedCertifications": string[]\n    }\n  ],\n  "insights": string[]\n}\nProvide 3 distinct paths (e.g. technical leadership, management, specialist) each with 3 progressive roles. Use realistic salary ranges for the given industry and region (USD, global average). Insights should be 4-6 actionable items.\n\nInput:\n- Current role: ${body.currentRole}\n- Industry: ${body.industry}\n- Years experience: ${body.yearsExperience}\n- Career goal: ${body.careerGoal || "open"}`,
          },
        ]);
        break;
      }

      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = (e as Error).message;
    const status = msg === "RATE_LIMIT" ? 429 : msg === "CREDITS_EXHAUSTED" ? 402 : 500;
    return new Response(JSON.stringify({ error: msg }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});