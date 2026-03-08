import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory rate limiting (per function instance)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5; // max 5 searches per window
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  
  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  entry.count++;
  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized', jobs: [] }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const authClient = createClient(supabaseUrl, supabaseAnonKey, { global: { headers: { Authorization: authHeader } } });
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized', jobs: [] }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Rate limit check
    if (!checkRateLimit(user.id)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. You can perform up to 5 job searches per hour. Please try again later.', jobs: [] }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { skills, jobTitle, location, experience } = await req.json();
    console.log("Searching jobs for user:", user.id, { skills, jobTitle, location });

    const apifyApiKey = Deno.env.get('APIFY_API_KEY');
    if (!apifyApiKey) {
      throw new Error('APIFY_API_KEY not configured');
    }

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

    const runResponse = await fetch(
      `https://api.apify.com/v2/acts/apify~google-search-scraper/runs?token=${apifyApiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(runInput) }
    );

    if (!runResponse.ok) {
      const errorText = await runResponse.text();
      console.error('Apify run error:', errorText);
      throw new Error(`Apify error: ${runResponse.status}`);
    }

    const runData = await runResponse.json();
    const runId = runData.data.id;

    let attempts = 0;
    let runFinished = false;
    
    while (attempts < 30 && !runFinished) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const statusResponse = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${apifyApiKey}`);
      const statusData = await statusResponse.json();
      if (statusData.data.status === 'SUCCEEDED') {
        runFinished = true;
      } else if (statusData.data.status === 'FAILED' || statusData.data.status === 'ABORTED') {
        throw new Error(`Apify run ${statusData.data.status}`);
      }
      attempts++;
    }

    if (!runFinished) throw new Error('Apify run timed out');

    const datasetResponse = await fetch(`https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${apifyApiKey}`);
    const results = await datasetResponse.json();

    const jobs = results
      .flatMap((result: any) => result.organicResults || [])
      .filter((item: any) => {
        const url = item.url?.toLowerCase() || '';
        const title = item.title?.toLowerCase() || '';
        return url.includes('linkedin.com/jobs') || url.includes('indeed.com') || url.includes('glassdoor.com') ||
               url.includes('lever.co') || url.includes('greenhouse.io') || url.includes('workday.com') ||
               title.includes('job') || title.includes('career') || title.includes('hiring');
      })
      .slice(0, 20)
      .map((item: any, index: number) => {
        const title = item.title || 'Job Position';
        const description = item.description || '';
        const companyMatch = title.match(/(?:at|@|-)\s*([^|]+?)(?:\s*\||$)/i) || description.match(/(?:at|@)\s*([^,.\n]+)/i);
        const company = companyMatch?.[1]?.trim() || 'Company';
        const jobTitle = title.split(/[-|@]/)[0].replace(/job|hiring|career/gi, '').trim() || 'Position';

        return {
          id: `job-${index}`,
          title: jobTitle.substring(0, 60),
          company: company.substring(0, 40),
          location: location || 'Remote/Various',
          url: item.url,
          description: description.substring(0, 200),
          source: item.url?.includes('linkedin') ? 'LinkedIn' : item.url?.includes('indeed') ? 'Indeed' : item.url?.includes('glassdoor') ? 'Glassdoor' : 'Job Board',
          postedDate: 'Recently',
        };
      });

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
