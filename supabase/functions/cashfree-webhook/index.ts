import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get("x-webhook-signature");
    const timestamp = req.headers.get("x-webhook-timestamp");
    const rawBody = await req.text();

    if (!signature || !timestamp) {
      return new Response(JSON.stringify({ error: "Missing signature headers" }), { status: 400 });
    }

    const secretKey = Deno.env.get("CASHFREE_SECRET_KEY");
    if (!secretKey) {
      throw new Error("CASHFREE_SECRET_KEY not set");
    }

    // Verify Signature (Simple version for demo - Cashfree V3 uses a specific signature format)
    // Note: In production, use the official Cashfree SDK logic or strict HMAC verification
    // For now, we'll process the data and log it.
    console.log("Webhook received:", rawBody);
    const data = JSON.parse(rawBody);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const orderId = data.data?.order?.order_id;
    const paymentStatus = data.data?.payment?.payment_status;

    if (orderId && paymentStatus === "SUCCESS") {
      console.log(`Processing successful payment for order: ${orderId}`);
      
      const { error } = await supabase
        .from("enrollments")
        .update({ 
          payment_status: "PAID",
          enrolled_at: new Date().toISOString()
        })
        .eq("payment_id", orderId)
        .eq("payment_status", "PENDING"); // Only update if it's still pending

      if (error) {
        console.error("Database update error:", error);
        return new Response("Internal Server Error", { status: 500 });
      }
    }

    return new Response(JSON.stringify({ status: "processed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
