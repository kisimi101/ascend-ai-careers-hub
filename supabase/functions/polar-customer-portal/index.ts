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

    // Look up Polar customer by external_customer_id
    const customerResponse = await fetch(
      `https://api.polar.sh/v1/customers/?external_customer_id=${user.id}`,
      { headers: { Authorization: `Bearer ${POLAR_ACCESS_TOKEN}` } }
    );

    const customerData = await customerResponse.json();
    const customers = customerData.items || [];

    if (customers.length === 0) {
      throw new Error("No subscription found. Please subscribe to a plan first.");
    }

    const customerId = customers[0].id;

    // Create customer portal session
    const portalResponse = await fetch("https://api.polar.sh/v1/customer-sessions/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${POLAR_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customer_id: customerId }),
    });

    const portalData = await portalResponse.json();

    if (!portalResponse.ok) {
      console.error("Polar portal API error:", portalData);
      throw new Error(`Failed to create portal session: ${portalResponse.status}`);
    }

    return new Response(
      JSON.stringify({ url: portalData.customer_portal_url }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
