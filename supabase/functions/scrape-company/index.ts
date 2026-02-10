const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { companyName, url } = await req.json();

    if (!companyName && !url) {
      return new Response(
        JSON.stringify({ success: false, error: 'Company name or URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl not configured. Please connect Firecrawl in project settings.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 1: Search for the company using Firecrawl search
    let searchResults: any[] = [];
    let companyUrl = url;

    if (!companyUrl) {
      console.log('Searching for company:', companyName);
      const searchResponse = await fetch('https://api.firecrawl.dev/v1/search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `${companyName} company official website about careers`,
          limit: 5,
          scrapeOptions: { formats: ['markdown'] },
        }),
      });

      const searchData = await searchResponse.json();
      if (searchResponse.ok && searchData.data) {
        searchResults = searchData.data;
        // Try to find official website
        const officialSite = searchResults.find((r: any) =>
          r.url && !r.url.includes('linkedin.com') && !r.url.includes('glassdoor') && !r.url.includes('wikipedia')
        );
        companyUrl = officialSite?.url || searchResults[0]?.url;
      }
    }

    // Step 2: Scrape the company website if found
    let scrapedContent = '';
    if (companyUrl) {
      console.log('Scraping company URL:', companyUrl);
      const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: companyUrl,
          formats: ['markdown'],
          onlyMainContent: true,
          waitFor: 3000,
        }),
      });

      const scrapeData = await scrapeResponse.json();
      if (scrapeResponse.ok) {
        scrapedContent = scrapeData.data?.markdown || scrapeData.markdown || '';
      }
    }

    // Step 3: Also search for LinkedIn page
    let linkedinUrl = '';
    const linkedinSearch = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `${companyName} site:linkedin.com/company`,
        limit: 3,
      }),
    });

    const linkedinData = await linkedinSearch.json();
    if (linkedinSearch.ok && linkedinData.data) {
      const linkedinResult = linkedinData.data.find((r: any) => r.url?.includes('linkedin.com/company'));
      linkedinUrl = linkedinResult?.url || '';
    }

    // Step 4: Use AI to extract structured company data
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const combinedContent = [
      scrapedContent,
      ...searchResults.map((r: any) => `Source: ${r.url}\n${r.markdown || r.description || ''}`),
    ].join('\n\n').substring(0, 20000);

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
            content: `You extract structured company information. Return ONLY valid JSON with no extra text:
{
  "name": "Company Name",
  "description": "Brief description (2-3 sentences)",
  "website": "https://...",
  "linkedin": "${linkedinUrl || ''}",
  "twitter": "https://twitter.com/... or empty",
  "facebook": "https://facebook.com/... or empty",
  "instagram": "https://instagram.com/... or empty",
  "headquarters": "City, State/Country",
  "employeeCount": "e.g. 10,000+",
  "industry": "Primary industry",
  "founded": "Year",
  "rating": 0,
  "reviewCount": 0,
  "openPositions": 0,
  "recentNews": ["News item 1", "News item 2"],
  "benefits": ["Benefit 1", "Benefit 2"],
  "culture": ["Value 1", "Value 2"]
}
Use empty strings/arrays for unknown fields. LinkedIn URL: "${linkedinUrl}". Company URL: "${companyUrl || ''}".`
          },
          {
            role: 'user',
            content: `Extract company info for "${companyName}" from:\n\n${combinedContent}`
          }
        ],
        temperature: 0.1,
      }),
    });

    if (!aiResponse.ok) {
      console.error('AI extraction failed');
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to extract company information' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content || '';

    try {
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const company = JSON.parse(jsonMatch[0]);
        // Ensure linkedin is set
        if (!company.linkedin && linkedinUrl) {
          company.linkedin = linkedinUrl;
        }
        if (!company.website && companyUrl) {
          company.website = companyUrl;
        }
        return new Response(
          JSON.stringify({ success: true, company }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Could not extract company data' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
