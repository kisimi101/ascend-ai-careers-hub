import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildEmail, type EmailType } from "../_shared/onboarding-emails.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const VALID: EmailType[] = [
  "welcome","complete_profile","upload_resume","optimize_resume",
  "job_matches","smart_apply_intro","interview_prep","premium_intro",
  "reengage","application_followup",
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { userId, type, extra } = await req.json();
    if (!userId || !type || !VALID.includes(type)) {
      return new Response(JSON.stringify({ error: "userId and valid type required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Dedup: skip if already sent (unless application_followup which can repeat per company)
    if (type !== "application_followup") {
      const { data: existing } = await admin
        .from("email_log").select("id").eq("user_id", userId).eq("email_type", type).maybeSingle();
      if (existing) {
        return new Response(JSON.stringify({ skipped: "already_sent" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const { data: profile } = await admin
      .from("profiles").select("full_name, email").eq("id", userId).maybeSingle();
    if (!profile?.email) {
      return new Response(JSON.stringify({ error: "no email on profile" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { subject, html } = buildEmail(type, {
      name: profile.full_name || undefined,
      email: profile.email,
      extra,
    });

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY missing");
    const from = Deno.env.get("RESEND_FROM") || "CareerNow <onboarding@resend.dev>";

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [profile.email], subject, html }),
    });
    const body = await r.json();
    if (!r.ok) {
      console.error("resend error", r.status, body);
      return new Response(JSON.stringify({ error: body?.message || "send failed", detail: body }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await admin.from("email_log").upsert({
      user_id: userId, email_type: type, status: "sent", meta: extra ?? null,
    }, { onConflict: "user_id,email_type" });

    return new Response(JSON.stringify({ ok: true, id: body?.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("send-onboarding-email error", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});