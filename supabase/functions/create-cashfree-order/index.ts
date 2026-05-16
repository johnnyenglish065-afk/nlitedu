import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CASHFREE_MODES = {
  sandbox: "https://sandbox.cashfree.com/pg/orders",
  production: "https://api.cashfree.com/pg/orders",
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { amount, customer_id, customer_email, customer_phone, order_id } = await req.json();

    const rawEnv = Deno.env.get("CASHFREE_MODE") || Deno.env.get("NEXT_PUBLIC_CASHFREE_MODE") || "production";
    const env = rawEnv.toLowerCase() === "sandbox" ? "sandbox" : "production";
    const appId = Deno.env.get("CASHFREE_APP_ID") || Deno.env.get("NEXT_PUBLIC_CASHFREE_APP_ID") || "10931891df32e727a57259502de9813901";
    const secretKey = Deno.env.get("CASHFREE_SECRET_KEY");

    if (!appId || !secretKey) {
      console.error("Missing Cashfree credentials. Env:", env);
      throw new Error("Cashfree credentials not configured. Please ensure CASHFREE_APP_ID and CASHFREE_SECRET_KEY are set in Supabase secrets.");
    }

    const origin = req.headers.get("origin") || "https://www.nlitedu.com";

    const response = await fetch(CASHFREE_MODES[env], {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": appId,
        "x-client-secret": secretKey,
      },
      body: JSON.stringify({
        order_amount: amount,
        order_currency: "INR",
        order_id: order_id || `order_${Date.now()}`,
        customer_details: {
          customer_id: customer_id,
          customer_email: customer_email,
          customer_phone: customer_phone,
        },
        order_meta: {
          return_url: `${origin}/enroll?payment_status={payment_status}&order_id={order_id}`,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create order");
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
