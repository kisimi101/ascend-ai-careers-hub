import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const statusLabels: Record<string, string> = {
  'applied': 'Applied',
  'phone-screen': 'Phone Screen',
  'technical': 'Technical Interview',
  'onsite': 'Onsite Interview',
  'offer': 'Offer Received',
  'rejected': 'Rejected'
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all users with active job applications
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name');

    if (profileError) {
      console.error("Error fetching profiles:", profileError);
      throw profileError;
    }

    if (!profiles || profiles.length === 0) {
      return new Response(
        JSON.stringify({ message: "No users to send digest to" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const emailResults = [];

    for (const profile of profiles) {
      if (!profile.email) continue;

      // Get this user's applications
      const { data: applications, error: appError } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', profile.id);

      if (appError) {
        console.error(`Error fetching applications for ${profile.id}:`, appError);
        continue;
      }

      if (!applications || applications.length === 0) {
        continue; // Skip users with no applications
      }

      // Calculate stats
      const thisWeekApps = applications.filter(
        app => new Date(app.applied_date) >= oneWeekAgo
      );
      
      const statusCounts = applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const thisWeekStatusCounts = thisWeekApps.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Get upcoming interviews
      const upcomingInterviews = applications.filter(
        app => app.interview_date && 
               new Date(app.interview_date) >= now && 
               new Date(app.interview_date) <= nextWeek
      ).sort((a, b) => new Date(a.interview_date!).getTime() - new Date(b.interview_date!).getTime());

      // Get career plans/milestones
      const { data: careerPlans } = await supabase
        .from('career_plans')
        .select('*')
        .eq('user_id', profile.id)
        .limit(1)
        .single();

      let milestonesHtml = '';
      if (careerPlans?.plan_data) {
        const planData = careerPlans.plan_data as any;
        if (planData.milestones && Array.isArray(planData.milestones)) {
          const upcomingMilestones = planData.milestones.filter((m: any) => 
            m.deadline && new Date(m.deadline) >= now && new Date(m.deadline) <= nextWeek
          );
          if (upcomingMilestones.length > 0) {
            milestonesHtml = `
              <div style="margin-top: 20px;">
                <h3 style="color: #f97316; margin-bottom: 12px;">📌 Upcoming Milestones</h3>
                ${upcomingMilestones.map((m: any) => `
                  <div style="background: #fff7ed; border-radius: 6px; padding: 12px; margin-bottom: 8px;">
                    <p style="margin: 0; font-weight: 600;">${m.title}</p>
                    <p style="margin: 4px 0 0 0; font-size: 14px; color: #666;">Due: ${new Date(m.deadline).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                  </div>
                `).join('')}
              </div>
            `;
          }
        }
      }

      // Calculate response rate
      const totalApps = applications.length;
      const responses = applications.filter(app => app.status !== 'applied' && app.status !== 'rejected').length;
      const responseRate = totalApps > 0 ? Math.round((responses / totalApps) * 100) : 0;

      const interviewsHtml = upcomingInterviews.length > 0 ? `
        <div style="margin-top: 20px;">
          <h3 style="color: #8b5cf6; margin-bottom: 12px;">📅 Upcoming Interviews This Week</h3>
          ${upcomingInterviews.map(interview => {
            const date = new Date(interview.interview_date!);
            return `
              <div style="background: #f5f3ff; border-radius: 6px; padding: 12px; margin-bottom: 8px; border-left: 3px solid #8b5cf6;">
                <p style="margin: 0; font-weight: 600;">${interview.company} - ${interview.position}</p>
                <p style="margin: 4px 0 0 0; font-size: 14px; color: #666;">
                  ${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at 
                  ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            `;
          }).join('')}
        </div>
      ` : '';

      try {
        const emailResponse = await resend.emails.send({
          from: "CareerHub <onboarding@resend.dev>",
          to: [profile.email],
          subject: `📊 Your Weekly Job Search Summary - ${thisWeekApps.length} new applications`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; }
                .header { background: linear-gradient(135deg, #f97316, #ef4444); color: white; padding: 24px; text-align: center; }
                .content { padding: 24px; }
                .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin: 16px 0; }
                .stat-card { background: #f9fafb; border-radius: 8px; padding: 16px; text-align: center; }
                .stat-value { font-size: 28px; font-weight: bold; color: #111; }
                .stat-label { font-size: 12px; color: #666; margin-top: 4px; }
                .footer { background: #f5f5f5; padding: 16px; text-align: center; font-size: 12px; color: #666; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">📊 Weekly Job Search Summary</h1>
                  <p style="margin: 8px 0 0 0; opacity: 0.9;">${new Date(oneWeekAgo).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div class="content">
                  <p>Hi ${profile.full_name || 'there'},</p>
                  <p>Here's your weekly job search progress report:</p>
                  
                  <div class="stats-grid">
                    <div class="stat-card">
                      <div class="stat-value">${thisWeekApps.length}</div>
                      <div class="stat-label">New Applications</div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-value">${totalApps}</div>
                      <div class="stat-label">Total Applications</div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-value">${responseRate}%</div>
                      <div class="stat-label">Response Rate</div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-value">${statusCounts['offer'] || 0}</div>
                      <div class="stat-label">Offers Received</div>
                    </div>
                  </div>

                  <div style="margin-top: 20px;">
                    <h3 style="color: #333; margin-bottom: 12px;">📈 Application Breakdown</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                      ${Object.entries(statusLabels).map(([status, label]) => `
                        <tr>
                          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${label}</td>
                          <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">${statusCounts[status] || 0}</td>
                          <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right; color: #666; font-size: 12px;">
                            ${thisWeekStatusCounts[status] ? `+${thisWeekStatusCounts[status]} this week` : ''}
                          </td>
                        </tr>
                      `).join('')}
                    </table>
                  </div>

                  ${interviewsHtml}
                  ${milestonesHtml}

                  <div style="margin-top: 24px; padding: 16px; background: #f0fdf4; border-radius: 8px;">
                    <p style="margin: 0; font-weight: 600; color: #166534;">💡 Tip of the Week</p>
                    <p style="margin: 8px 0 0 0; color: #333;">
                      ${thisWeekApps.length < 5 
                        ? "Try to apply to at least 5 jobs per week to maximize your chances!"
                        : thisWeekApps.length < 10
                        ? "Great momentum! Consider reaching out to recruiters on LinkedIn to supplement your applications."
                        : "Excellent work! You're applying consistently. Make sure to follow up on applications from 1-2 weeks ago."
                      }
                    </p>
                  </div>
                  
                  <p style="margin-top: 24px;">Keep up the great work!</p>
                  <p style="color: #666;">The CareerHub Team</p>
                </div>
                <div class="footer">
                  <p>You received this email because you have weekly digest enabled on CareerHub.</p>
                </div>
              </div>
            </body>
            </html>
          `,
        });

        emailResults.push({ email: profile.email, success: true, response: emailResponse });
        console.log(`Weekly digest sent to ${profile.email}`);
      } catch (emailError) {
        console.error(`Failed to send digest to ${profile.email}:`, emailError);
        emailResults.push({ email: profile.email, success: false, error: emailError });
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `Sent ${emailResults.filter(r => r.success).length} weekly digests`,
        results: emailResults 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-weekly-digest function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
