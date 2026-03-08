import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { share_token } = await req.json();

    if (!share_token) {
      return new Response(
        JSON.stringify({ error: 'share_token is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Increment view count and return resume data
    const { data, error } = await supabase
      .from('shared_resumes')
      .select('*')
      .eq('share_token', share_token)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return new Response(
        JSON.stringify({ error: 'Resume not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Increment view count
    await supabase
      .from('shared_resumes')
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq('id', data.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        resume: {
          resume_data: data.resume_data,
          template: data.template,
          title: data.title,
          view_count: data.view_count + 1
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
