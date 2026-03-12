import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TIER_LIMITS: Record<string, number> = {
  free: 5,
  pro: 50,
  enterprise: 999999, // unlimited
};

async function getUserTier(supabaseAdmin: any, userId: string): Promise<string> {
  try {
    const polarAccessToken = Deno.env.get('POLAR_ACCESS_TOKEN');
    if (!polarAccessToken) return 'free';

    // Check if user has active subscription via Polar
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Get user email
    const { data: profile } = await adminClient.from('profiles').select('email').eq('id', userId).single();
    if (!profile?.email) return 'free';

    // Check Polar for subscription
    const response = await fetch(`https://api.polar.sh/v1/subscriptions/search?email=${encodeURIComponent(profile.email)}&active=true`, {
      headers: { 'Authorization': `Bearer ${polarAccessToken}` },
    });

    if (!response.ok) return 'free';
    const data = await response.json();
    const subs = data.items || data.result?.items || [];

    if (subs.length === 0) return 'free';

    // Check tier based on price
    for (const sub of subs) {
      const amount = sub.price?.price_amount || sub.amount || 0;
      if (amount >= 3900) return 'enterprise';
      if (amount >= 1200) return 'pro';
    }
    return 'pro';
  } catch (e) {
    console.error('Error checking tier:', e);
    return 'free';
  }
}

async function getDailySearchCount(userId: string): Promise<{ count: number; id: string | null }> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const adminClient = createClient(supabaseUrl, supabaseServiceKey);

  const today = new Date().toISOString().split('T')[0];
  const { data } = await adminClient
    .from('search_usage')
    .select('id, search_count')
    .eq('user_id', userId)
    .eq('search_date', today)
    .single();

  return { count: data?.search_count || 0, id: data?.id || null };
}

async function incrementSearchCount(userId: string, existingId: string | null, currentCount: number) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const adminClient = createClient(supabaseUrl, supabaseServiceKey);

  const today = new Date().toISOString().split('T')[0];

  if (existingId) {
    await adminClient
      .from('search_usage')
      .update({ search_count: currentCount + 1, updated_at: new Date().toISOString() })
      .eq('id', existingId);
  } else {
    await adminClient
      .from('search_usage')
      .insert({ user_id: userId, search_date: today, search_count: 1 });
  }
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

    // Check if this is a usage query only
    const body = await req.json();
    if (body.checkUsageOnly) {
      const { count } = await getDailySearchCount(user.id);
      const tier = await getUserTier(null, user.id);
      const limit = TIER_LIMITS[tier] || 5;
      return new Response(JSON.stringify({ used: count, limit, tier }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { skills, jobTitle, location, experience } = body;

    // Server-side rate limit check based on subscription tier
    const tier = await getUserTier(null, user.id);
    const limit = TIER_LIMITS[tier] || 5;
    const { count: dailyCount, id: usageId } = await getDailySearchCount(user.id);

    if (dailyCount >= limit) {
      const tierName = tier.charAt(0).toUpperCase() + tier.slice(1);
      return new Response(
        JSON.stringify({ 
          error: `Daily search limit reached (${limit}/${limit}). ${tier === 'free' ? 'Upgrade to Pro for 50 searches/day.' : tier === 'pro' ? 'Upgrade to Enterprise for unlimited searches.' : ''}`,
          jobs: [],
          used: dailyCount,
          limit,
          tier,
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Increment search count
    await incrementSearchCount(user.id, usageId, dailyCount);

    console.log("Searching jobs for user:", user.id, { skills, jobTitle, location, tier, dailyCount: dailyCount + 1 });

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

    return new Response(JSON.stringify({ jobs, used: dailyCount + 1, limit, tier }), {
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
