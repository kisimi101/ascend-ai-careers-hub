import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: 'status_change' | 'interview_reminder';
  user_email: string;
  user_name?: string;
  application_data?: {
    company: string;
    position: string;
    old_status?: string;
    new_status: string;
  };
  interview_data?: {
    company: string;
    position: string;
    interview_date: string;
  };
}

const statusLabels: Record<string, string> = {
  'applied': 'Applied',
  'phone-screen': 'Phone Screen',
  'technical': 'Technical Interview',
  'onsite': 'Onsite Interview',
  'offer': 'Offer Received! 🎉',
  'rejected': 'Rejected'
};

const getStatusChangeEmail = (data: NotificationRequest) => {
  const { application_data, user_name } = data;
  if (!application_data) return { subject: '', html: '' };

  const isOffer = application_data.new_status === 'offer';
  const subject = isOffer 
    ? `🎉 Congratulations! You received an offer from ${application_data.company}`
    : `Application Update: ${application_data.company} - ${statusLabels[application_data.new_status]}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #f97316, #ef4444); color: white; padding: 24px; text-align: center; }
        .content { padding: 24px; }
        .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: 600; margin: 12px 0; }
        .status-offer { background: #dcfce7; color: #166534; }
        .status-interview { background: #fae8ff; color: #86198f; }
        .status-applied { background: #dbeafe; color: #1e40af; }
        .status-rejected { background: #fee2e2; color: #991b1b; }
        .footer { background: #f5f5f5; padding: 16px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">CareerHub</h1>
          <p style="margin: 8px 0 0 0; opacity: 0.9;">Job Application Update</p>
        </div>
        <div class="content">
          <p>Hi ${user_name || 'there'},</p>
          ${isOffer ? `
            <p style="font-size: 18px;">🎉 <strong>Congratulations!</strong> Great news on your job search!</p>
          ` : `
            <p>Your job application status has been updated:</p>
          `}
          
          <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Company:</strong> ${application_data.company}</p>
            <p style="margin: 0 0 8px 0;"><strong>Position:</strong> ${application_data.position}</p>
            <p style="margin: 0;">
              <strong>New Status:</strong> 
              <span class="status-badge ${application_data.new_status === 'offer' ? 'status-offer' : 
                application_data.new_status.includes('interview') || application_data.new_status.includes('screen') ? 'status-interview' : 
                application_data.new_status === 'rejected' ? 'status-rejected' : 'status-applied'}">
                ${statusLabels[application_data.new_status]}
              </span>
            </p>
          </div>
          
          ${isOffer ? `
            <p>This is a fantastic achievement! Make sure to review the offer details carefully and prepare for negotiations if needed.</p>
          ` : application_data.new_status.includes('interview') || application_data.new_status.includes('screen') ? `
            <p>You're moving forward in the process! Make sure to prepare well for your upcoming interview.</p>
          ` : application_data.new_status === 'rejected' ? `
            <p>Don't be discouraged! Every rejection brings you closer to the right opportunity. Keep applying!</p>
          ` : `
            <p>Keep track of your progress in your CareerHub dashboard.</p>
          `}
          
          <p style="margin-top: 24px;">Good luck with your job search!</p>
          <p style="color: #666;">The CareerHub Team</p>
        </div>
        <div class="footer">
          <p>You received this email because you have job application tracking enabled on CareerHub.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
};

const getInterviewReminderEmail = (data: NotificationRequest) => {
  const { interview_data, user_name } = data;
  if (!interview_data) return { subject: '', html: '' };

  const interviewDate = new Date(interview_data.interview_date);
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

  const subject = `📅 Interview Reminder: ${interview_data.company} - ${interview_data.position}`;

  const html = `
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
          <h1 style="margin: 0;">📅 Interview Reminder</h1>
          <p style="margin: 8px 0 0 0; opacity: 0.9;">Don't forget your upcoming interview!</p>
        </div>
        <div class="content">
          <p>Hi ${user_name || 'there'},</p>
          <p>This is a friendly reminder about your upcoming interview:</p>
          
          <div class="interview-card">
            <p style="margin: 0 0 8px 0;"><strong>🏢 Company:</strong> ${interview_data.company}</p>
            <p style="margin: 0 0 8px 0;"><strong>💼 Position:</strong> ${interview_data.position}</p>
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
  `;

  return { subject, html };
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: NotificationRequest = await req.json();

    let emailContent: { subject: string; html: string };

    if (data.type === 'status_change') {
      emailContent = getStatusChangeEmail(data);
    } else if (data.type === 'interview_reminder') {
      emailContent = getInterviewReminderEmail(data);
    } else {
      throw new Error('Invalid notification type');
    }

    const emailResponse = await resend.emails.send({
      from: "CareerHub <onboarding@resend.dev>",
      to: [data.user_email],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-notification-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
