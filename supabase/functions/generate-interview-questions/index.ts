import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { company, role = 'Software Engineer' } = await req.json();
    const companyLower = company.toLowerCase().trim();
    const roleLower = role.toLowerCase().trim();

    // Check cache first
    const { data: cached } = await supabase
      .from('interview_questions')
      .select('*')
      .ilike('company', companyLower)
      .ilike('role', roleLower)
      .limit(15);

    if (cached && cached.length >= 5) {
      const questions = cached.map((q: any) => ({
        id: q.id,
        company: q.company,
        role: q.role,
        question: q.question,
        category: q.category,
        difficulty: q.difficulty,
        sampleAnswer: q.sample_answer,
        tips: q.tips || [],
        upvotes: q.upvotes || 0,
        source: 'cached',
      }));
      return new Response(JSON.stringify({ questions, fromCache: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Generate with AI
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: 'You are an expert interview coach with deep knowledge of company-specific interview processes worldwide.' },
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

    // Cache to database (best effort, don't block response)
    try {
      const rows = result.questions.map((q: any) => ({
        company: companyLower,
        role: roleLower,
        question: q.question,
        category: q.category,
        difficulty: q.difficulty,
        sample_answer: q.sampleAnswer || null,
        tips: q.tips || [],
        upvotes: 0,
        source: 'ai',
      }));
      await supabase.from('interview_questions').upsert(rows, { onConflict: 'company,role,question', ignoreDuplicates: true });
    } catch (cacheErr) {
      console.error('Cache write error (non-fatal):', cacheErr);
    }

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
