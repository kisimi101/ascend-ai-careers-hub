import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Get all active job alerts
    const { data: alerts, error: alertsError } = await supabase
      .from('job_alerts')
      .select('*')
      .eq('is_active', true);

    if (alertsError) throw alertsError;
    if (!alerts || alerts.length === 0) {
      return new Response(JSON.stringify({ message: 'No active alerts' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let notificationsCreated = 0;

    for (const alert of alerts) {
      // Check if we already sent a notification recently (within frequency)
      const frequencyHours = alert.email_frequency === 'daily' ? 24 : alert.email_frequency === 'weekly' ? 168 : 24;
      
      if (alert.last_sent_at) {
        const lastSent = new Date(alert.last_sent_at);
        const hoursSince = (Date.now() - lastSent.getTime()) / (1000 * 60 * 60);
        if (hoursSince < frequencyHours) continue;
      }

      // Create in-app notification for matching jobs
      const locationText = alert.location ? ` in ${alert.location}` : '';
      const { error: notifError } = await supabase.from('notifications').insert({
        user_id: alert.user_id,
        type: 'job_alert',
        title: `New jobs matching "${alert.job_title}"`,
        message: `We found new ${alert.job_title} positions${locationText}. Click to search and apply now!`,
        link: `/job-search?q=${encodeURIComponent(alert.job_title)}&loc=${encodeURIComponent(alert.location || '')}`,
      });

      if (!notifError) {
        notificationsCreated++;
        // Update last_sent_at
        await supabase
          .from('job_alerts')
          .update({ last_sent_at: new Date().toISOString() })
          .eq('id', alert.id);
      }
    }

    // Also check for upcoming interview deadlines
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const { data: upcomingInterviews } = await supabase
      .from('job_applications')
      .select('*')
      .not('interview_date', 'is', null)
      .gte('interview_date', new Date().toISOString())
      .lte('interview_date', tomorrow.toISOString());

    if (upcomingInterviews) {
      for (const app of upcomingInterviews) {
        // Check if we already notified about this interview
        const { data: existing } = await supabase
          .from('notifications')
          .select('id')
          .eq('user_id', app.user_id)
          .eq('type', 'deadline')
          .ilike('message', `%${app.company}%${app.position}%`)
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .limit(1);

        if (!existing || existing.length === 0) {
          await supabase.from('notifications').insert({
            user_id: app.user_id,
            type: 'deadline',
            title: 'Interview Coming Up!',
            message: `Your interview at ${app.company} for ${app.position} is within 24 hours. Good luck!`,
            link: '/job-tracker',
          });
          notificationsCreated++;
        }
      }
    }

    // Check for status changes (applications updated in last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recentUpdates } = await supabase
      .from('job_applications')
      .select('*')
      .gte('updated_at', oneHourAgo)
      .neq('status', 'applied');

    if (recentUpdates) {
      for (const app of recentUpdates) {
        const { data: existing } = await supabase
          .from('notifications')
          .select('id')
          .eq('user_id', app.user_id)
          .eq('type', 'status_change')
          .ilike('message', `%${app.company}%${app.status}%`)
          .gte('created_at', oneHourAgo)
          .limit(1);

        if (!existing || existing.length === 0) {
          const statusLabels: Record<string, string> = {
            interview: '🎉 Interview scheduled',
            offer: '🏆 Offer received',
            rejected: 'Application update',
            withdrawn: 'Application withdrawn',
          };
          
          await supabase.from('notifications').insert({
            user_id: app.user_id,
            type: 'status_change',
            title: statusLabels[app.status] || 'Application Update',
            message: `Your application at ${app.company} for ${app.position} status changed to "${app.status}".`,
            link: '/job-tracker',
          });
          notificationsCreated++;
        }
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      notificationsCreated,
      alertsProcessed: alerts.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error checking job alerts:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
