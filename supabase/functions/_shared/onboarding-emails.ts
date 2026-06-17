// Onboarding & lifecycle email templates. Single source of truth.
// Each template returns { subject, preview, html }.

const BRAND = "CareerNow";
const BASE_URL = "https://www.careernow.xyz";
const ACCENT = "#E85D1A";

const wrap = (preview: string, body: string) => `<!doctype html>
<html><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width" />
<title>${BRAND}</title>
</head>
<body style="margin:0;background:#f7f4ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#1b1b1b;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${preview}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f4ef;padding:32px 0">
  <tr><td align="center">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.05)">
      <tr><td>
        <div style="font-size:20px;font-weight:700;color:${ACCENT};margin-bottom:24px">${BRAND}</div>
        ${body}
        <hr style="border:none;border-top:1px solid #eee;margin:32px 0" />
        <div style="font-size:12px;color:#888">
          You're receiving this because you signed up for ${BRAND}. 
          <a href="${BASE_URL}/settings" style="color:#888">Manage emails</a>
        </div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

const cta = (href: string, label: string) => `
<p style="text-align:center;margin:28px 0">
  <a href="${href}" style="background:${ACCENT};color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;display:inline-block">${label}</a>
</p>`;

export type EmailType =
  | "welcome"
  | "complete_profile"
  | "upload_resume"
  | "optimize_resume"
  | "job_matches"
  | "smart_apply_intro"
  | "interview_prep"
  | "premium_intro"
  | "reengage"
  | "application_followup";

interface TemplateCtx {
  name?: string;
  email: string;
  extra?: Record<string, unknown>;
}

export function buildEmail(type: EmailType, ctx: TemplateCtx): { subject: string; preview: string; html: string } {
  const first = (ctx.name || "there").split(" ")[0];

  switch (type) {
    case "welcome": return {
      subject: `Welcome to ${BRAND}, ${first} 👋`,
      preview: "Land your next role 3× faster with AI-powered tools.",
      html: wrap("Land your next role 3× faster.", `
        <h1 style="font-size:22px;margin:0 0 12px">Welcome, ${first}!</h1>
        <p>You just unlocked the full CareerNow toolkit — resume builder, ATS scanner, smart apply, interview prep, and more. All free, no credit card.</p>
        <p><strong>Start here:</strong></p>
        <ol><li>Build or upload your resume</li><li>Get an instant ATS score</li><li>Apply to 10+ jobs in one click</li></ol>
        ${cta(`${BASE_URL}/resume-builder`, "Build my resume")}
        <p style="font-size:13px;color:#666">Reply to this email any time — a human reads every reply.</p>`)
    };

    case "complete_profile": return {
      subject: "Finish your CareerNow profile (60 seconds)",
      preview: "A complete profile = better job matches and faster auto-apply.",
      html: wrap("60 seconds to better matches.", `
        <h1 style="font-size:22px;margin:0 0 12px">Hey ${first}, one quick step</h1>
        <p>Add your location, target role, and salary range so we can surface jobs that actually fit.</p>
        ${cta(`${BASE_URL}/profile`, "Complete profile")}`)
    };

    case "upload_resume": return {
      subject: "Upload your resume to get a free ATS score",
      preview: "Top resumes score 80+. Find out where yours stands.",
      html: wrap("80+ is the goal — see your score.", `
        <h1 style="font-size:22px;margin:0 0 12px">Your free ATS score is one upload away</h1>
        <p>75% of resumes get rejected by ATS software before a recruiter ever reads them. Let's make sure yours isn't one of them.</p>
        ${cta(`${BASE_URL}/resume-checker`, "Run free ATS check")}`)
    };

    case "optimize_resume": return {
      subject: "Your resume scored under 80 — here's how to fix it",
      preview: "Three quick AI rewrites can push you over the line.",
      html: wrap("Three AI rewrites away from 80+.", `
        <h1 style="font-size:22px;margin:0 0 12px">Let's get you to 80+</h1>
        <p>Your last resume scan flagged a few easy wins. The AI optimizer can rewrite weak bullets and add missing keywords in seconds.</p>
        ${cta(`${BASE_URL}/resume-enhancer`, "Optimize my resume")}`)
    };

    case "job_matches": {
      const count = (ctx.extra?.matchCount as number) ?? 10;
      return {
        subject: `${count} new roles matched your resume this week`,
        preview: "Hand-picked openings from 14 job boards.",
        html: wrap(`${count} fresh matches.`, `
          <h1 style="font-size:22px;margin:0 0 12px">${count} fresh matches for you</h1>
          <p>We scanned LinkedIn, Indeed, Glassdoor, and 11 more boards for roles that fit your skills.</p>
          ${cta(`${BASE_URL}/job-search`, "See my matches")}`)
      };
    }

    case "smart_apply_intro": return {
      subject: "Apply to 10 jobs in 5 minutes with Smart Apply",
      preview: "AI fills the forms, writes the cover letters, tracks the apps.",
      html: wrap("10 jobs, 5 minutes.", `
        <h1 style="font-size:22px;margin:0 0 12px">Try Smart Apply</h1>
        <p>One click → AI tailors your resume, writes a cover letter for each role, and tracks every submission for you.</p>
        ${cta(`${BASE_URL}/smart-apply`, "Try Smart Apply")}`)
    };

    case "interview_prep": {
      const company = (ctx.extra?.company as string) || "your upcoming interview";
      return {
        subject: `Crush your ${company} interview`,
        preview: "Practice questions, sample answers, and 1-click prep.",
        html: wrap("You've got this.", `
          <h1 style="font-size:22px;margin:0 0 12px">Interview at ${company} coming up?</h1>
          <p>Our AI generates company-specific questions and sample answers based on your resume. Practice for 10 minutes — interview with confidence.</p>
          ${cta(`${BASE_URL}/interview-practice`, "Practice now")}`)
      };
    }

    case "premium_intro": return {
      subject: "Unlock unlimited resumes & priority job alerts",
      preview: "Pro is $12/mo. Cancel anytime. 7-day free trial.",
      html: wrap("Pro: unlimited resumes, unlimited applies.", `
        <h1 style="font-size:22px;margin:0 0 12px">Ready for more?</h1>
        <p>Free covers most users. But if you're applying to 10+ jobs a day, Pro removes every limit:</p>
        <ul>
          <li>Unlimited resumes, downloads & smart-apply runs</li>
          <li>Priority job alerts (every 6h vs daily)</li>
          <li>All premium templates + AI cover letter library</li>
        </ul>
        ${cta(`${BASE_URL}/#pricing`, "Start 7-day free trial")}`)
    };

    case "reengage": return {
      subject: "We saved your spot — and 30 new jobs",
      preview: "Pick up where you left off in one click.",
      html: wrap("30 new jobs for you.", `
        <h1 style="font-size:22px;margin:0 0 12px">Hey ${first}, your job search is waiting</h1>
        <p>You haven't checked in for two weeks. We've kept your resume, applications, and saved searches safe — and added 30 fresh matches.</p>
        ${cta(`${BASE_URL}/dashboard`, "Return to dashboard")}`)
    };

    case "application_followup": {
      const company = (ctx.extra?.company as string) || "the company";
      return {
        subject: `Time to follow up with ${company}`,
        preview: "A short follow-up triples your response rate.",
        html: wrap("Don't go silent — follow up.", `
          <h1 style="font-size:22px;margin:0 0 12px">It's been 7 days since you applied to ${company}</h1>
          <p>Recruiters respond <strong>3× more often</strong> to candidates who send a polite check-in. We'll draft one for you.</p>
          ${cta(`${BASE_URL}/auto-follow-up`, "Send follow-up")}`)
      };
    }
  }
}