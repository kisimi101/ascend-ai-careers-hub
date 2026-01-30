import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find interviews scheduled for the next 24 hours
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in25Hours = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    console.log(`Checking for interviews between ${tomorrow.toISOString()} and ${in25Hours.toISOString()}`);

    const { data: applications, error: fetchError } = await supabase
      .from('job_applications')
      .select(`
        id,
        company,
        position,
        interview_date,
        user_id
      `)
      .not('interview_date', 'is', null)
      .gte('interview_date', tomorrow.toISOString())
      .lt('interview_date', in25Hours.toISOString());

    if (fetchError) {
      console.error("Error fetching applications:", fetchError);
      throw fetchError;
    }

    console.log(`Found ${applications?.length || 0} interviews to remind about`);

    if (!applications || applications.length === 0) {
      return new Response(
        JSON.stringify({ message: "No interviews to remind about" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get user profiles for email addresses
    const userIds = [...new Set(applications.map(app => app.user_id))];
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .in('id', userIds);

    if (profileError) {
      console.error("Error fetching profiles:", profileError);
      throw profileError;
    }

    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

    // Send reminder emails
    const emailResults = [];
    for (const app of applications) {
      const profile = profileMap.get(app.user_id);
      if (!profile?.email) {
        console.log(`No email found for user ${app.user_id}`);
        continue;
      }

      const interviewDate = new Date(app.interview_date);
      const formattedDate = interviewDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const formattedTime = interviewDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      try {
        const emailResponse = await resend.emails.send({
          from: "CareerHub <onboarding@resend.dev>",
          to: [profile.email],
          subject: `📅 Interview Reminder: ${app.company} - ${app.position} (Tomorrow!)`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; }
                .header { background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; padding: 24px; text-align: center; }
                .content { padding: 24px; }
                .interview-card { background: #f9fafb; border-radius: 8px; padding: 20px; margin: 16px 0; border-left: 4px solid #8b5cf6; }
                .tips { background: #fef3c7; border-radius: 8px; padding: 16px; margin: 16px 0; }
                .footer { background: #f5f5f5; padding: 16px; text-align: center; font-size: 12px; color: #666; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">📅 Interview Tomorrow!</h1>
                  <p style="margin: 8px 0 0 0; opacity: 0.9;">Don't forget your upcoming interview!</p>
                </div>
                <div class="content">
                  <p>Hi ${profile.full_name || 'there'},</p>
                  <p>This is a friendly reminder about your interview <strong>tomorrow</strong>:</p>
                  
                  <div class="interview-card">
                    <p style="margin: 0 0 8px 0;"><strong>🏢 Company:</strong> ${app.company}</p>
                    <p style="margin: 0 0 8px 0;"><strong>💼 Position:</strong> ${app.position}</p>
                    <p style="margin: 0 0 8px 0;"><strong>📅 Date:</strong> ${formattedDate}</p>
                    <p style="margin: 0;"><strong>🕐 Time:</strong> ${formattedTime}</p>
                  </div>
                  
                  <div class="tips">
                    <p style="margin: 0 0 8px 0;"><strong>💡 Quick Interview Tips:</strong></p>
                    <ul style="margin: 0; padding-left: 20px;">
                      <li>Research the company and role beforehand</li>
                      <li>Prepare examples using the STAR method</li>
                      <li>Have questions ready to ask the interviewer</li>
                      <li>Test your tech setup if it's a video interview</li>
                      <li>Get a good night's sleep!</li>
                    </ul>
                  </div>
                  
                  <p style="margin-top: 24px;">You've got this! Good luck! 🍀</p>
                  <p style="color: #666;">The CareerHub Team</p>
                </div>
                <div class="footer">
                  <p>You received this email because you have interview reminders enabled on CareerHub.</p>
                </div>
              </div>
            </body>
            </html>
          `,
        });

        emailResults.push({ email: profile.email, success: true, response: emailResponse });
        console.log(`Reminder sent to ${profile.email} for ${app.company}`);
      } catch (emailError) {
        console.error(`Failed to send email to ${profile.email}:`, emailError);
        emailResults.push({ email: profile.email, success: false, error: emailError });
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `Sent ${emailResults.filter(r => r.success).length} reminders`,
        results: emailResults 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-interview-reminders function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
