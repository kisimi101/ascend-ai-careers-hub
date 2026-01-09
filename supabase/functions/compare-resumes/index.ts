import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resume1, resume2, jobDescription } = await req.json();
    console.log("Comparing resumes...");

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const prompt = `You are an expert resume analyst. Compare these two resumes and provide a detailed analysis.

Resume 1:
${resume1}

Resume 2:
${resume2}

${jobDescription ? `Job Description to match against:\n${jobDescription}` : ''}

Provide your analysis in this exact JSON format:
{
  "resume1Score": <number 0-100>,
  "resume2Score": <number 0-100>,
  "resume1Strengths": ["strength1", "strength2", "strength3"],
  "resume2Strengths": ["strength1", "strength2", "strength3"],
  "resume1Weaknesses": ["weakness1", "weakness2", "weakness3"],
  "resume2Weaknesses": ["weakness1", "weakness2", "weakness3"],
  "recommendation": "A detailed recommendation explaining which resume is better and why"
}

Only respond with valid JSON, no additional text.`;

    const response = await fetch('https://api.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiData = await response.json();
    const content = aiData.choices[0]?.message?.content || '';
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }
    
    const result = JSON.parse(jsonMatch[0]);
    console.log("Comparison complete");

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error comparing resumes:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
