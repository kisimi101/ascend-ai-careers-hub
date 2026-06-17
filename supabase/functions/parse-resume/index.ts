import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import mammoth from "npm:mammoth@1.7.2";

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

    // Detect format from MIME or extension and extract text where possible.
    const ext = (fileName || "").toLowerCase().split(".").pop() || "";
    const isPdf  = fileType === "application/pdf" || ext === "pdf";
    const isDocx = fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || ext === "docx";
    const isDoc  = fileType === "application/msword" || ext === "doc";
    const isTxt  = fileType === "text/plain" || ext === "txt";
    const isRtf  = fileType === "application/rtf" || fileType === "text/rtf" || ext === "rtf";

    if (!isPdf && !isDocx && !isDoc && !isTxt && !isRtf) {
      return new Response(JSON.stringify({
        success: false,
        error: `Unsupported file type. Please upload PDF, DOCX, DOC, TXT, or RTF.`,
      }), { status: 415, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (isDoc) {
      // Legacy .doc binary parsing isn't viable in Deno — guide users to save as .docx
      return new Response(JSON.stringify({
        success: false,
        error: "Legacy .doc files aren't supported. Please re-save as .docx, PDF, or TXT and try again.",
      }), { status: 415, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const bytes = Uint8Array.from(atob(fileContent), (c) => c.charCodeAt(0));
    let textContent = "";

    if (isTxt) {
      textContent = new TextDecoder().decode(bytes);
    } else if (isRtf) {
      // Strip RTF control words and groups, leave plain text
      const raw = new TextDecoder().decode(bytes);
      textContent = raw
        .replace(/\\par[d]?/g, "\n")
        .replace(/\\'[0-9a-fA-F]{2}/g, "")
        .replace(/\\[a-zA-Z]+-?\d* ?/g, "")
        .replace(/[{}]/g, "")
        .replace(/\\\*/g, "")
        .trim();
    } else if (isDocx) {
      try {
        const { value } = await mammoth.extractRawText({ buffer: bytes });
        textContent = value || "";
      } catch (err) {
        console.error("docx parse error", err);
      }
    }

    const prompt = `You are a resume parser. Extract structured information from the following resume content.

${textContent ? `Resume text:\n${textContent}` : `This is a ${fileType} document. Extract resume information from the attached file.`}

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

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
            content: (isPdf && !textContent)
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
