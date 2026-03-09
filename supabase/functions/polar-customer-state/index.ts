import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const POLAR_ACCESS_TOKEN = Deno.env.get("POLAR_ACCESS_TOKEN");
    if (!POLAR_ACCESS_TOKEN) {
      throw new Error("POLAR_ACCESS_TOKEN is not configured");
    }

    // Verify user auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Look up customer by external_customer_id (our user id)
    const customerResponse = await fetch(
      `https://api.polar.sh/v1/customers/?external_customer_id=${user.id}`,
      {
        headers: { Authorization: `Bearer ${POLAR_ACCESS_TOKEN}` },
      }
    );

    const customerData = await customerResponse.json();

    if (!customerResponse.ok) {
      console.error("Polar customers API error:", customerData);
      return new Response(
        JSON.stringify({ isPro: false, subscriptions: [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const customers = customerData.items || [];
    if (customers.length === 0) {
      return new Response(
        JSON.stringify({ isPro: false, subscriptions: [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const customerId = customers[0].id;

    // Get active subscriptions
    const subsResponse = await fetch(
      `https://api.polar.sh/v1/subscriptions/?customer_id=${customerId}&active=true`,
      {
        headers: { Authorization: `Bearer ${POLAR_ACCESS_TOKEN}` },
      }
    );

    const subsData = await subsResponse.json();
    const subscriptions = subsData.items || [];
    const isPro = subscriptions.length > 0;

    return new Response(
      JSON.stringify({ isPro, subscriptions }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message, isPro: false }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
