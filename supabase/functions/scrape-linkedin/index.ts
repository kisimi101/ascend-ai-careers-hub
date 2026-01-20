const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LinkedInProfile {
  name: string;
  headline: string;
  summary: string;
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education: {
    school: string;
    degree: string;
    field: string;
    years: string;
  }[];
  skills: string[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl connector not configured. Please connect Firecrawl in project settings.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format URL
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    console.log('Scraping LinkedIn URL:', formattedUrl);

    // Use Firecrawl to scrape the LinkedIn profile
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: formattedUrl,
        formats: ['markdown'],
        onlyMainContent: true,
        waitFor: 3000, // Wait for dynamic content
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Firecrawl API error:', data);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: data.error || `Failed to scrape profile. Status: ${response.status}` 
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const markdown = data.data?.markdown || data.markdown || '';
    
    if (!markdown) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Could not extract profile content. The profile might be private or the URL is incorrect.' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use AI to extract structured data from the markdown
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      // Fall back to basic parsing if AI is not available
      const profile = basicParseLinkedInMarkdown(markdown);
      return new Response(
        JSON.stringify({ success: true, profile }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use AI to extract structured profile data
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
            content: `You are an expert at extracting structured data from LinkedIn profile content. 
Extract the following information and return ONLY a valid JSON object with no additional text:
{
  "name": "Full name of the person",
  "headline": "Professional headline/title",
  "summary": "Profile summary/about section",
  "experience": [
    {
      "title": "Job title",
      "company": "Company name",
      "duration": "Time period (e.g., Jan 2020 - Present)",
      "description": "Job description"
    }
  ],
  "education": [
    {
      "school": "School name",
      "degree": "Degree type (e.g., Bachelor's, Master's)",
      "field": "Field of study",
      "years": "Years attended"
    }
  ],
  "skills": ["Skill 1", "Skill 2", ...]
}

If any field is not found, use an empty string or empty array as appropriate.`
          },
          {
            role: 'user',
            content: `Extract the LinkedIn profile information from this content:\n\n${markdown.substring(0, 15000)}`
          }
        ],
        temperature: 0.1,
      }),
    });

    if (!aiResponse.ok) {
      console.error('AI extraction failed, falling back to basic parsing');
      const profile = basicParseLinkedInMarkdown(markdown);
      return new Response(
        JSON.stringify({ success: true, profile }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content || '';
    
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const profile: LinkedInProfile = JSON.parse(jsonMatch[0]);
        return new Response(
          JSON.stringify({ success: true, profile }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
    }

    // Fall back to basic parsing
    const profile = basicParseLinkedInMarkdown(markdown);
    return new Response(
      JSON.stringify({ success: true, profile }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error scraping LinkedIn:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to scrape LinkedIn profile';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function basicParseLinkedInMarkdown(markdown: string): LinkedInProfile {
  const lines = markdown.split('\n').filter(line => line.trim());
  
  // Try to extract name from first heading
  const nameMatch = markdown.match(/^#\s+(.+?)(?:\s*[-|]|$)/m);
  const name = nameMatch ? nameMatch[1].trim() : lines[0]?.replace(/^#+\s*/, '') || 'Unknown';
  
  // Try to find headline (usually after name)
  const headlineMatch = markdown.match(/(?:^|\n)(.+?(?:Engineer|Developer|Manager|Director|Analyst|Designer|Consultant|Specialist|Lead|Head|VP|CEO|CTO|CFO|COO).+?)(?:\n|$)/i);
  const headline = headlineMatch ? headlineMatch[1].trim() : '';
  
  // Try to find summary/about section
  const summaryMatch = markdown.match(/(?:About|Summary|Profile)\s*\n+([\s\S]+?)(?=\n#|\n##|Experience|Education|Skills|$)/i);
  const summary = summaryMatch ? summaryMatch[1].trim().substring(0, 500) : '';
  
  // Extract skills (look for common skill patterns)
  const skillsSection = markdown.match(/Skills[\s\S]*?(?=Education|Experience|$)/i);
  const skills: string[] = [];
  if (skillsSection) {
    const skillMatches = skillsSection[0].match(/(?:^|\n|\*|-)\s*([A-Za-z][A-Za-z0-9\s\+\#\.\/]+?)(?:\n|,|$)/g);
    if (skillMatches) {
      skillMatches.forEach(s => {
        const skill = s.replace(/^[\n\*\-\s]+/, '').trim();
        if (skill && skill.length < 50 && !skill.toLowerCase().includes('skill')) {
          skills.push(skill);
        }
      });
    }
  }
  
  return {
    name,
    headline,
    summary,
    experience: [],
    education: [],
    skills: skills.slice(0, 20),
  };
}
