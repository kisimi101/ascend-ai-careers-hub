import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GUEST_DAILY_DOWNLOADS = 1;

async function getFingerprint(req: Request): Promise<string> {
  const ip = (req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown")
    .split(",")[0]
    .trim();
  const ua = req.headers.get("user-agent") || "ua";
  const lang = req.headers.get("accept-language") || "";
  const chUa = req.headers.get("sec-ch-ua") || "";
  const platform = req.headers.get("sec-ch-ua-platform") || "";
  const raw = `${ip}|${ua}|${lang}|${chUa}|${platform}`;
  const buf = new TextEncoder().encode(raw);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  const hex = Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${ip}:${hex.slice(0, 24)}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, supabaseServiceKey);

    // Auth detection — authenticated users have no download cap here.
    const authHeader = req.headers.get("Authorization");
    let isGuest = true;
    if (authHeader) {
      try {
        const authClient = createClient(supabaseUrl, supabaseAnonKey, {
          global: { headers: { Authorization: authHeader } },
        });
        const { data } = await authClient.auth.getUser();
        if (data?.user) isGuest = false;
      } catch {}
    }

    const body = await req.json().catch(() => ({}));
    const consume = body?.consume === true;

    if (!isGuest) {
      return new Response(
        JSON.stringify({ allowed: true, isGuest: false, used: 0, limit: 999999, remaining: 999999 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const fingerprint = await getFingerprint(req);
    const today = new Date().toISOString().split("T")[0];
    const { data: row } = await admin
      .from("guest_usage")
      .select("id, count")
      .eq("fingerprint", fingerprint)
      .eq("action", "download")
      .eq("usage_date", today)
      .maybeSingle();

    const used = row?.count || 0;
    const remaining = Math.max(0, GUEST_DAILY_DOWNLOADS - used);

    if (!consume) {
      return new Response(
        JSON.stringify({
          allowed: used < GUEST_DAILY_DOWNLOADS,
          isGuest: true,
          tier: "guest",
          used,
          limit: GUEST_DAILY_DOWNLOADS,
          remaining,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (used >= GUEST_DAILY_DOWNLOADS) {
      return new Response(
        JSON.stringify({
          allowed: false,
          isGuest: true,
          tier: "guest",
          used,
          limit: GUEST_DAILY_DOWNLOADS,
          remaining: 0,
          error: `Free download limit reached (${GUEST_DAILY_DOWNLOADS}/${GUEST_DAILY_DOWNLOADS}). Sign up free to download more resumes.`,
          requiresSignup: true,
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (row?.id) {
      await admin
        .from("guest_usage")
        .update({ count: used + 1, updated_at: new Date().toISOString() })
        .eq("id", row.id);
    } else {
      await admin
        .from("guest_usage")
        .insert({ fingerprint, action: "download", usage_date: today, count: 1 });
    }

    return new Response(
      JSON.stringify({
        allowed: true,
        isGuest: true,
        tier: "guest",
        used: used + 1,
        limit: GUEST_DAILY_DOWNLOADS,
        remaining: Math.max(0, GUEST_DAILY_DOWNLOADS - (used + 1)),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("track-download error", e);
    return new Response(JSON.stringify({ error: (e as Error).message, allowed: false }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});