import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const authClient = createClient(supabaseUrl, supabaseAnonKey, { global: { headers: { Authorization: authHeader } } });
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl connector not configured.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: formattedUrl, formats: ['markdown'], onlyMainContent: true, waitFor: 3000 }),
    });

    const data = await response.json();
    if (!response.ok) {
      return new Response(
        JSON.stringify({ success: false, error: data.error || `Failed to scrape profile. Status: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const markdown = data.data?.markdown || data.markdown || '';
    if (!markdown) {
      return new Response(
        JSON.stringify({ success: false, error: 'Could not extract profile content.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      const profile = basicParseLinkedInMarkdown(markdown);
      return new Response(JSON.stringify({ success: true, profile }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You extract structured data from LinkedIn profile content. Return ONLY valid JSON:
{
  "name": "Full name", "headline": "Professional headline", "summary": "About section",
  "experience": [{ "title": "Job title", "company": "Company", "duration": "Period", "description": "Description" }],
  "education": [{ "school": "School", "degree": "Degree", "field": "Field", "years": "Years" }],
  "skills": ["Skill 1", "Skill 2"]
}`
          },
          { role: 'user', content: `Extract LinkedIn profile info from:\n\n${markdown.substring(0, 15000)}` }
        ],
        temperature: 0.1,
      }),
    });

    if (!aiResponse.ok) {
      const profile = basicParseLinkedInMarkdown(markdown);
      return new Response(JSON.stringify({ success: true, profile }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content || '';
    
    try {
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const profile = JSON.parse(jsonMatch[0]);
        return new Response(JSON.stringify({ success: true, profile }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
    }

    const profile = basicParseLinkedInMarkdown(markdown);
    return new Response(JSON.stringify({ success: true, profile }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Error scraping LinkedIn:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Failed to scrape LinkedIn profile' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function basicParseLinkedInMarkdown(markdown: string) {
  const lines = markdown.split('\n').filter(line => line.trim());
  const nameMatch = markdown.match(/^#\s+(.+?)(?:\s*[-|]|$)/m);
  const name = nameMatch ? nameMatch[1].trim() : lines[0]?.replace(/^#+\s*/, '') || 'Unknown';
  const headlineMatch = markdown.match(/(?:^|\n)(.+?(?:Engineer|Developer|Manager|Director|Analyst|Designer|Consultant|Specialist|Lead|Head|VP|CEO|CTO|CFO|COO).+?)(?:\n|$)/i);
  const headline = headlineMatch ? headlineMatch[1].trim() : '';
  const summaryMatch = markdown.match(/(?:About|Summary|Profile)\s*\n+([\s\S]+?)(?=\n#|\n##|Experience|Education|Skills|$)/i);
  const summary = summaryMatch ? summaryMatch[1].trim().substring(0, 500) : '';
  const skillsSection = markdown.match(/Skills[\s\S]*?(?=Education|Experience|$)/i);
  const skills: string[] = [];
  if (skillsSection) {
    const skillMatches = skillsSection[0].match(/(?:^|\n|\*|-)\s*([A-Za-z][A-Za-z0-9\s\+\#\.\/]+?)(?:\n|,|$)/g);
    if (skillMatches) {
      skillMatches.forEach(s => {
        const skill = s.replace(/^[\n\*\-\s]+/, '').trim();
        if (skill && skill.length < 50 && !skill.toLowerCase().includes('skill')) skills.push(skill);
      });
    }
  }
  return { name, headline, summary, experience: [], education: [], skills: skills.slice(0, 20) };
}
