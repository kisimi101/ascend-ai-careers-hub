import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface JobAlert {
  id: string;
  user_id: string;
  job_title: string;
  location: string | null;
  industry: string | null;
  salary_min: number | null;
  salary_max: number | null;
  is_active: boolean;
  email_frequency: string;
}

interface UserProfile {
  email: string;
  full_name: string | null;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting job alerts processing...");

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get frequency from request or default to 'daily'
    const { frequency = 'daily' } = await req.json().catch(() => ({}));
    
    console.log(`Processing ${frequency} job alerts...`);

    // Fetch active job alerts for the specified frequency
    const { data: alerts, error: alertsError } = await supabase
      .from('job_alerts')
      .select('*')
      .eq('is_active', true)
      .eq('email_frequency', frequency);

    if (alertsError) {
      console.error('Error fetching alerts:', alertsError);
      throw alertsError;
    }

    if (!alerts || alerts.length === 0) {
      console.log('No active alerts found for this frequency');
      return new Response(
        JSON.stringify({ message: 'No active alerts to process' }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Found ${alerts.length} active alerts`);

    // Group alerts by user
    const alertsByUser: Record<string, JobAlert[]> = {};
    for (const alert of alerts) {
      if (!alertsByUser[alert.user_id]) {
        alertsByUser[alert.user_id] = [];
      }
      alertsByUser[alert.user_id].push(alert);
    }

    const emailsSent: string[] = [];
    const errors: string[] = [];

    // Process each user's alerts
    for (const [userId, userAlerts] of Object.entries(alertsByUser)) {
      try {
        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email, full_name')
          .eq('id', userId)
          .single();

        if (profileError || !profile?.email) {
          console.error(`Could not find profile for user ${userId}:`, profileError);
          continue;
        }

        // Generate job listings HTML
        const jobListingsHtml = userAlerts.map(alert => `
          <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
            <h3 style="margin: 0 0 8px 0; color: #333;">${alert.job_title}</h3>
            ${alert.location ? `<p style="margin: 4px 0; color: #666;">📍 ${alert.location}</p>` : ''}
            ${alert.industry ? `<p style="margin: 4px 0; color: #666;">🏢 ${alert.industry}</p>` : ''}
            ${alert.salary_min || alert.salary_max ? `
              <p style="margin: 4px 0; color: #666;">💰 
                ${alert.salary_min ? `$${alert.salary_min.toLocaleString()}` : ''}
                ${alert.salary_min && alert.salary_max ? ' - ' : ''}
                ${alert.salary_max ? `$${alert.salary_max.toLocaleString()}` : ''}
              </p>
            ` : ''}
          </div>
        `).join('');

        // Send email
        const emailResponse = await resend.emails.send({
          from: "CareerHub <onboarding@resend.dev>",
          to: [profile.email],
          subject: `🔔 Your ${frequency} job alert digest - CareerHub`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                  <h1 style="margin: 0;">CareerHub</h1>
                  <p style="margin: 10px 0 0 0; opacity: 0.9;">Your ${frequency} job alert digest</p>
                </div>
                
                <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px;">
                  <p style="color: #333;">Hi ${profile.full_name || 'there'}! 👋</p>
                  <p style="color: #666;">Here are your active job alerts. We're tracking these positions for you:</p>
                  
                  ${jobListingsHtml}
                  
                  <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e0e0e0;">
                    <p style="color: #666; font-size: 14px;">
                      💡 <strong>Tip:</strong> Update your alerts anytime in your CareerHub profile to refine your job search.
                    </p>
                  </div>
                  
                  <div style="text-align: center; margin-top: 24px;">
                    <a href="${Deno.env.get('SITE_URL') || 'https://careerhub.dev'}/profile" 
                       style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                      Manage Alerts
                    </a>
                  </div>
                </div>
                
                <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                  <p>© ${new Date().getFullYear()} CareerHub. All rights reserved.</p>
                  <p>You're receiving this because you set up job alerts on CareerHub.</p>
                </div>
              </div>
            </body>
            </html>
          `,
        });

        console.log(`Email sent to ${profile.email}:`, emailResponse);
        emailsSent.push(profile.email);

        // Update last_sent_at for these alerts
        for (const alert of userAlerts) {
          await supabase
            .from('job_alerts')
            .update({ last_sent_at: new Date().toISOString() })
            .eq('id', alert.id);
        }
      } catch (userError) {
        console.error(`Error processing user ${userId}:`, userError);
        errors.push(`User ${userId}: ${userError.message}`);
      }
    }

    console.log(`Job alerts processing complete. Emails sent: ${emailsSent.length}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailsSent: emailsSent.length,
        emails: emailsSent,
        errors: errors.length > 0 ? errors : undefined
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-job-alerts function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
