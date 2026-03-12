import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const { currentRole, targetRole, yearsExperience, industry } = await req.json();

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: 'You are an expert career advisor who creates detailed career progression timelines.' },
          { role: 'user', content: `Create a career progression timeline from "${currentRole}" to "${targetRole}" in the ${industry} industry. The person has ${yearsExperience} years of experience. Include 4-6 milestones with salary ranges, required skills, certifications, and descriptions. Also provide 5 actionable career insights.` }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'generate_timeline',
            description: 'Generate career progression timeline',
            parameters: {
              type: 'object',
              properties: {
                milestones: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      year: { type: 'number' },
                      title: { type: 'string' },
                      level: { type: 'string' },
                      salaryRange: { type: 'string' },
                      skills: { type: 'array', items: { type: 'string' } },
                      certifications: { type: 'array', items: { type: 'string' } },
                      description: { type: 'string' },
                      isCurrent: { type: 'boolean' },
                      isAchieved: { type: 'boolean' }
                    },
                    required: ['id', 'year', 'title', 'level', 'salaryRange', 'skills', 'description']
                  }
                },
                totalYears: { type: 'number' },
                peakSalary: { type: 'string' },
                insights: { type: 'array', items: { type: 'string' } }
              },
              required: ['milestones', 'totalYears', 'peakSalary', 'insights']
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'generate_timeline' } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: 'Rate limited' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      if (response.status === 402) return new Response(JSON.stringify({ error: 'Credits required' }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      throw new Error('AI gateway error');
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    const result = toolCall ? JSON.parse(toolCall.function.arguments) : null;

    if (!result) throw new Error('No result from AI');

    // Ensure first milestone is marked current
    if (result.milestones.length > 0) {
      result.milestones[0].isCurrent = true;
      result.milestones[0].isAchieved = true;
      result.milestones.forEach((m: any) => {
        m.certifications = m.certifications || [];
      });
    }

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
