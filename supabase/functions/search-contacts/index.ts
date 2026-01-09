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
    const { query, roleFilter } = await req.json();
    console.log("Searching contacts:", query, roleFilter);

    const apifyApiKey = Deno.env.get('APIFY_API_KEY');
    
    if (!apifyApiKey) {
      throw new Error('APIFY_API_KEY not configured');
    }

    // Use Apify's Google Search Scraper to find LinkedIn profiles
    const searchQuery = roleFilter 
      ? `${query} ${roleFilter} site:linkedin.com/in`
      : `${query} recruiter OR "hiring manager" OR "talent acquisition" site:linkedin.com/in`;

    const runInput = {
      queries: searchQuery,
      maxPagesPerQuery: 1,
      resultsPerPage: 10,
      mobileResults: false,
      languageCode: "",
      maxConcurrency: 1,
    };

    // Start the Apify actor run
    const runResponse = await fetch(
      `https://api.apify.com/v2/acts/apify~google-search-scraper/runs?token=${apifyApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(runInput),
      }
    );

    if (!runResponse.ok) {
      const errorText = await runResponse.text();
      console.error('Apify run error:', errorText);
      throw new Error(`Apify error: ${runResponse.status}`);
    }

    const runData = await runResponse.json();
    const runId = runData.data.id;
    console.log("Apify run started:", runId);

    // Wait for the run to finish (with timeout)
    let attempts = 0;
    let runFinished = false;
    
    while (attempts < 30 && !runFinished) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const statusResponse = await fetch(
        `https://api.apify.com/v2/actor-runs/${runId}?token=${apifyApiKey}`
      );
      const statusData = await statusResponse.json();
      
      if (statusData.data.status === 'SUCCEEDED') {
        runFinished = true;
      } else if (statusData.data.status === 'FAILED' || statusData.data.status === 'ABORTED') {
        throw new Error(`Apify run ${statusData.data.status}`);
      }
      
      attempts++;
    }

    if (!runFinished) {
      throw new Error('Apify run timed out');
    }

    // Get the results
    const datasetResponse = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${apifyApiKey}`
    );
    const results = await datasetResponse.json();
    console.log("Got results:", results.length);

    // Parse LinkedIn results into contacts
    const contacts = results
      .flatMap((result: any) => result.organicResults || [])
      .filter((item: any) => item.url?.includes('linkedin.com/in'))
      .slice(0, 10)
      .map((item: any, index: number) => {
        // Extract name and title from LinkedIn snippet
        const title = item.title || '';
        const description = item.description || '';
        
        // Parse name (usually before the dash or pipe)
        const namePart = title.split(/[-|–]/)[0]?.trim() || 'Unknown';
        
        // Try to extract job title
        const titleMatch = title.match(/[-|–]\s*(.+?)(?:\s*[-|–]|$)/);
        const jobTitle = titleMatch?.[1]?.trim() || description.split('.')[0]?.trim() || 'Professional';
        
        // Extract company if mentioned
        const companyMatch = description.match(/(?:at|@)\s*([^,.\n]+)/i);
        const company = companyMatch?.[1]?.trim() || 'Company';

        return {
          id: `contact-${index}`,
          name: namePart.replace(/\s*-\s*LinkedIn.*$/i, '').trim(),
          title: jobTitle.substring(0, 50),
          company: company,
          location: 'Location not specified',
          linkedin: item.url?.replace('https://', ''),
        };
      });

    console.log("Parsed contacts:", contacts.length);

    return new Response(JSON.stringify({ contacts }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error searching contacts:', error);
    return new Response(
      JSON.stringify({ error: error.message, contacts: [] }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
