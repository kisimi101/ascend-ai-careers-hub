import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    const { checkoutId } = await req.json();
    if (!checkoutId) {
      throw new Error("checkoutId is required");
    }

    const response = await fetch(
      `https://api.polar.sh/v1/checkouts/${checkoutId}`,
      {
        headers: { Authorization: `Bearer ${POLAR_ACCESS_TOKEN}` },
      }
    );

    const checkout = await response.json();

    if (!response.ok) {
      throw new Error(`Polar API error: ${response.status}`);
    }

    return new Response(
      JSON.stringify({
        status: checkout.status,
        productId: checkout.product_id,
        customerId: checkout.customer_id,
      }),
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
