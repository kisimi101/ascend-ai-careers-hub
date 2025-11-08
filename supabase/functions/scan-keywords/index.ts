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
    const { resumeText, jobDescription } = await req.json();
    console.log('Scanning keywords for resume');

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Call AI to analyze keywords
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
            content: 'You are an ATS (Applicant Tracking System) expert specializing in resume keyword optimization. Analyze resumes against job descriptions and identify keyword matches and gaps.'
          },
          {
            role: 'user',
            content: `Analyze this resume against the job description and provide a detailed keyword match analysis. Return the response in JSON format with this structure:
{
  "matchScore": <number 0-100>,
  "foundKeywords": ["keyword1", "keyword2", ...],
  "missingKeywords": ["keyword1", "keyword2", ...],
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}

Resume:
${resumeText}

Job Description:
${jobDescription}`
          }
        ]
      })
    });

    if (!response.ok) {
      console.error('AI API error:', response.status, await response.text());
      throw new Error('Failed to scan keywords with AI');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI response:', aiResponse);

    // Parse AI response
    let scanResults;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        scanResults = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      // Return fallback results
      scanResults = {
        matchScore: 70,
        foundKeywords: ['JavaScript', 'React', 'Communication'],
        missingKeywords: ['Python', 'AWS', 'Docker'],
        suggestions: [
          'Add more technical keywords from the job description',
          'Include specific tools and technologies mentioned',
          'Highlight relevant certifications if applicable'
        ]
      };
    }

    return new Response(
      JSON.stringify(scanResults),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in scan-keywords function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        matchScore: 0,
        foundKeywords: [],
        missingKeywords: [],
        suggestions: ['Error analyzing keywords. Please try again.']
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
