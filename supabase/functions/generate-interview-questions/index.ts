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

    const { company, role = 'Software Engineer' } = await req.json();

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: 'You are an expert interview coach with deep knowledge of company-specific interview processes.' },
          { role: 'user', content: `Generate 10 interview questions for a ${role} position at ${company}. Include a mix of behavioral, technical, system-design, case-study, and culture-fit questions. For each question provide tips and a sample answer.` }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'generate_questions',
            description: 'Generate interview questions',
            parameters: {
              type: 'object',
              properties: {
                questions: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      company: { type: 'string' },
                      role: { type: 'string' },
                      question: { type: 'string' },
                      category: { type: 'string', enum: ['behavioral', 'technical', 'system-design', 'case-study', 'culture-fit'] },
                      difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
                      sampleAnswer: { type: 'string' },
                      tips: { type: 'array', items: { type: 'string' } },
                      upvotes: { type: 'number' },
                      source: { type: 'string' }
                    },
                    required: ['id', 'question', 'category', 'difficulty', 'tips']
                  }
                }
              },
              required: ['questions']
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'generate_questions' } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: 'Rate limited' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      if (response.status === 402) return new Response(JSON.stringify({ error: 'Credits required' }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      throw new Error('AI gateway error');
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    const result = toolCall ? JSON.parse(toolCall.function.arguments) : { questions: [] };

    // Ensure defaults
    result.questions = result.questions.map((q: any, i: number) => ({
      ...q,
      id: q.id || `q-${i}`,
      company: q.company || company,
      role: q.role || role,
      upvotes: q.upvotes || Math.floor(10 + Math.random() * 200),
      source: 'ai',
    }));

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
