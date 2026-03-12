import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeData, action } = await req.json();

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
      return new Response(JSON.stringify({ success: true, ...result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "generate-cover-letters") {
      const { jobs } = await req.json();
      // This action receives resumeData + jobs array from initial request body
      const jobsList = resumeData.jobs || [];
      
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
