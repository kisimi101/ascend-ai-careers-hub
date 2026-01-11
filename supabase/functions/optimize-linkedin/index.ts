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
    const { linkedInProfile, resumeContent } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an expert LinkedIn profile optimizer and career coach. Analyze the provided LinkedIn profile content and compare it with the resume to provide actionable optimization suggestions.

Your response must be a valid JSON object with this exact structure:
{
  "overallScore": <number 0-100>,
  "sections": [
    {
      "name": "<section name>",
      "score": <number 0-100>,
      "status": "<good|needs-work|missing>",
      "suggestions": ["<suggestion 1>", "<suggestion 2>"]
    }
  ],
  "keywordMatch": {
    "matched": ["<keyword1>", "<keyword2>"],
    "missing": ["<keyword3>", "<keyword4>"]
  },
  "generalTips": ["<tip 1>", "<tip 2>", "<tip 3>"]
}

Analyze these sections: Headline, About/Summary, Experience, Skills, and Recommendations.
Focus on:
- Keyword alignment between LinkedIn and resume
- Professional branding consistency
- SEO optimization for recruiters
- Compelling storytelling
- Quantifiable achievements`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `LinkedIn Profile:\n${linkedInProfile}\n\nResume:\n${resumeContent}` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    // Parse the JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const result = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in optimize-linkedin function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
