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
    const { skills, jobTitle, location, experience } = await req.json();
    console.log("Searching jobs based on resume:", { skills, jobTitle, location });

    const apifyApiKey = Deno.env.get('APIFY_API_KEY');
    
    if (!apifyApiKey) {
      throw new Error('APIFY_API_KEY not configured');
    }

    // Build search query from resume data
    const skillsQuery = skills?.slice(0, 3).join(' OR ') || '';
    const searchQuery = `${jobTitle || 'software developer'} ${skillsQuery} jobs ${location || ''}`.trim();

    const runInput = {
      queries: searchQuery,
      maxPagesPerQuery: 2,
      resultsPerPage: 20,
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

    // Wait for the run to finish
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
    console.log("Got raw results:", results.length);

    // Parse job results
    const jobs = results
      .flatMap((result: any) => result.organicResults || [])
      .filter((item: any) => {
        const url = item.url?.toLowerCase() || '';
        const title = item.title?.toLowerCase() || '';
        // Filter for job posting sites
        return url.includes('linkedin.com/jobs') || 
               url.includes('indeed.com') || 
               url.includes('glassdoor.com') ||
               url.includes('lever.co') ||
               url.includes('greenhouse.io') ||
               url.includes('workday.com') ||
               title.includes('job') ||
               title.includes('career') ||
               title.includes('hiring');
      })
      .slice(0, 20)
      .map((item: any, index: number) => {
        const title = item.title || 'Job Position';
        const description = item.description || '';
        
        // Try to extract company name
        const companyMatch = title.match(/(?:at|@|-)\s*([^|]+?)(?:\s*\||$)/i) ||
                           description.match(/(?:at|@)\s*([^,.\n]+)/i);
        const company = companyMatch?.[1]?.trim() || 'Company';
        
        // Clean up job title
        const jobTitle = title
          .split(/[-|@]/)[0]
          .replace(/job|hiring|career/gi, '')
          .trim() || 'Position';

        return {
          id: `job-${index}`,
          title: jobTitle.substring(0, 60),
          company: company.substring(0, 40),
          location: location || 'Remote/Various',
          url: item.url,
          description: description.substring(0, 200),
          source: item.url?.includes('linkedin') ? 'LinkedIn' : 
                 item.url?.includes('indeed') ? 'Indeed' :
                 item.url?.includes('glassdoor') ? 'Glassdoor' : 'Job Board',
          postedDate: 'Recently',
        };
      });

    console.log("Parsed jobs:", jobs.length);

    return new Response(JSON.stringify({ jobs }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error searching jobs:', error);
    return new Response(
      JSON.stringify({ error: error.message, jobs: [] }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
