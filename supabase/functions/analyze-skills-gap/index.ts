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
    const { resumeSkills, jobDescription, targetRole } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an expert career coach and skills analyst. Analyze the gap between the candidate's current skills and the job requirements, then provide a detailed learning path.

Your response must be a valid JSON object with this exact structure:
{
  "matchScore": <number 0-100>,
  "matchedSkills": ["<skill1>", "<skill2>"],
  "gapAnalysis": [
    {
      "skill": "<skill name>",
      "importance": "<critical|important|nice-to-have>",
      "currentLevel": <number 0-100>,
      "requiredLevel": <number 0-100>,
      "resources": [
        {
          "title": "<resource title>",
          "platform": "<Coursera|Udemy|YouTube|LinkedIn Learning|etc>",
          "url": "<actual URL to the resource>",
          "type": "<course|tutorial|certification|book>",
          "duration": "<estimated time>"
        }
      ]
    }
  ],
  "learningPath": [
    {
      "phase": "<Phase name>",
      "duration": "<timeframe>",
      "skills": ["<skill1>", "<skill2>"],
      "description": "<what to focus on>"
    }
  ],
  "careerTips": ["<tip 1>", "<tip 2>", "<tip 3>"]
}

Focus on:
- Identifying all required skills from the job description
- Matching them against the candidate's current skills
- Prioritizing skills by importance for the role
- Providing real, actionable learning resources
- Creating a realistic learning timeline`;

    const userMessage = `Target Role: ${targetRole || 'Not specified'}

Candidate's Current Skills:
${resumeSkills}

Job Description:
${jobDescription}`;

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
          { role: 'user', content: userMessage }
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
    console.error('Error in analyze-skills-gap function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
