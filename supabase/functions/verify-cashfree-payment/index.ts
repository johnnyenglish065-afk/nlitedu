import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const CASHFREE_MODES = {
  sandbox: "https://sandbox.cashfree.com/pg/orders",
  production: "https://api.cashfree.com/pg/orders",
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return new Response(JSON.stringify({ error: "Missing orderId" }), { status: 400, headers: corsHeaders });
    }

    const rawEnv = Deno.env.get("CASHFREE_MODE") || Deno.env.get("NEXT_PUBLIC_CASHFREE_MODE") || "production";
    const env = rawEnv.toLowerCase() === "sandbox" ? "sandbox" : "production";
    const appId = Deno.env.get("CASHFREE_APP_ID") || Deno.env.get("NEXT_PUBLIC_CASHFREE_APP_ID") || "10931891df32e727a57259502de9813901";
    const secretKey = Deno.env.get("CASHFREE_SECRET_KEY");

    if (!appId || !secretKey) {
      return new Response(JSON.stringify({ error: "Cashfree credentials missing. Please set CASHFREE_APP_ID and CASHFREE_SECRET_KEY in Supabase secrets." }), { status: 500, headers: corsHeaders });
    }

    // 1. Fetch order details from Cashfree
    const cfUrl = `${CASHFREE_MODES[env as keyof typeof CASHFREE_MODES]}/${orderId}`;
    const response = await fetch(cfUrl, {
      method: "GET",
      headers: {
        "x-api-version": "2023-08-01",
        "x-client-id": appId,
        "x-client-secret": secretKey,
      },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to verify payment with Cashfree" }), { status: 400, headers: corsHeaders });
    }

    const orderData = await response.json();

    // 2. Update Database if order is PAID
    if (orderData.order_status === "PAID") {
      const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Check current status
      const { data: currentRecord } = await supabase
        .from("enrollments")
        .select("status")
        .eq("cf_payment_id", orderId)
        .single();

      if (currentRecord?.status === "PENDING") {
         // Update to PAID
         const { data: updatedRecord, error: dbError } = await supabase
           .from("enrollments")
           .update({ status: "PAID" })
           .eq("cf_payment_id", orderId)
           .select()
           .single();
           
         if (dbError) {
           console.error("Failed to update enrollment status:", dbError);
         } else if (updatedRecord) {
           // Also trigger email using new email-service Edge Function
           try {
             await fetch(`${supabaseUrl}/functions/v1/email-service`, {
               method: "POST",
               headers: { 
                 "Content-Type": "application/json",
                 "Authorization": `Bearer ${supabaseKey}`
               },
               body: JSON.stringify({
                 studentName: updatedRecord.full_name,
                 studentEmail: updatedRecord.email,
                 courseTitle: updatedRecord.course_title,
                 orderId: orderId,
               }),
             });
           } catch (e) {
             console.error("Failed to send email from verify-payment:", e);
           }
         }
      }

      return new Response(JSON.stringify({ status: "PAID" }), { headers: corsHeaders });
    }

    return new Response(JSON.stringify({ status: orderData.order_status }), { headers: corsHeaders });
  } catch (error: any) {
    console.error("Verification error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});
