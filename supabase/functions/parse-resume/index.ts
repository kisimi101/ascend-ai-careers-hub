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
    const { fileContent, fileName, fileType } = await req.json();

    if (!fileContent) {
      return new Response(
        JSON.stringify({ error: "No file content provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Decode base64 to get raw text (works for TXT; for PDF/DOCX we send base64 to AI)
    let textContent = "";
    
    if (fileType === "text/plain") {
      const bytes = Uint8Array.from(atob(fileContent), (c) => c.charCodeAt(0));
      textContent = new TextDecoder().decode(bytes);
    } else {
      // For PDF and DOCX, we'll send the base64 content to Gemini which can process documents
      textContent = `[This is a base64-encoded ${fileType} file named "${fileName}". Please extract the resume information from it.]`;
    }

    const prompt = `You are a resume parser. Extract structured information from the following resume content.

${fileType === "text/plain" ? `Resume text:\n${textContent}` : `This is a ${fileType} document. The content is base64 encoded. Extract what you can from the filename and any text patterns.`}

Return a JSON object with this exact structure (use empty strings for missing fields, empty arrays for missing lists):
{
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "summary": "string - professional summary or objective",
  "experience": [
    {
      "company": "string",
      "position": "string",
      "duration": "string",
      "description": "string"
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "year": "string"
    }
  ],
  "skills": ["string"]
}

Return ONLY valid JSON, no markdown or explanation.`;

    const aiResponse = await fetch("https://api.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: fileType !== "text/plain"
              ? [
                  { type: "text", text: prompt },
                  {
                    type: "image_url",
                    image_url: {
                      url: `data:${fileType};base64,${fileContent}`,
                    },
                  },
                ]
              : prompt,
          },
        ],
        temperature: 0.1,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      throw new Error(`AI API call failed [${aiResponse.status}]: ${errText}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    // Parse JSON from AI response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse AI response as JSON");
    }

    const resumeData = JSON.parse(jsonMatch[0]);

    return new Response(
      JSON.stringify({ success: true, resumeData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Resume parse error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
