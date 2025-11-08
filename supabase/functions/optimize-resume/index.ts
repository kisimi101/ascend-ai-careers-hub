import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeData } = await req.json();
    console.log('Optimizing resume for:', resumeData.personalInfo.fullName);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Prepare resume context for AI
    const resumeContext = `
Personal Info: ${resumeData.personalInfo.fullName}, ${resumeData.personalInfo.email}
Summary: ${resumeData.personalInfo.summary}

Experience:
${resumeData.experience.map((exp: any) => 
  `- ${exp.position} at ${exp.company} (${exp.duration})\n  ${exp.description}`
).join('\n')}

Education:
${resumeData.education.map((edu: any) => 
  `- ${edu.degree} from ${edu.institution} (${edu.year})`
).join('\n')}

Skills: ${resumeData.skills.join(', ')}
    `.trim();

    // Call AI to optimize resume
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume writer and career coach. Your task is to enhance resume content to be more impactful, ATS-friendly, and professionally written. Provide specific improvements while maintaining accuracy.'
          },
          {
            role: 'user',
            content: `Please analyze and optimize this resume. Provide improved versions of the summary and experience descriptions that are more impactful and ATS-friendly. Return the response in JSON format with this structure:
{
  "optimizedSummary": "improved summary",
  "optimizedExperience": [
    {"company": "...", "position": "...", "duration": "...", "description": "improved description"}
  ],
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}

Resume to optimize:
${resumeContext}`
          }
        ]
      })
    });

    if (!response.ok) {
      console.error('AI API error:', response.status, await response.text());
      throw new Error('Failed to optimize resume with AI');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI response:', aiResponse);

    // Parse AI response (try to extract JSON)
    let optimizations;
    try {
      // Try to find JSON in the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        optimizations = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      // Return original resume if parsing fails
      optimizations = {
        optimizedSummary: resumeData.personalInfo.summary,
        optimizedExperience: resumeData.experience,
        suggestions: ['Unable to generate AI suggestions. Please try again.']
      };
    }

    // Build optimized resume
    const optimizedResume = {
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        summary: optimizations.optimizedSummary || resumeData.personalInfo.summary
      },
      experience: optimizations.optimizedExperience || resumeData.experience
    };

    return new Response(
      JSON.stringify({
        optimizedResume,
        suggestions: optimizations.suggestions || []
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in optimize-resume function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        optimizedResume: null
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
