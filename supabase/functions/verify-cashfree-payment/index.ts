// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const CASHFREE_MODES = {
  sandbox: "https://sandbox.cashfree.com/pg/orders",
  production: "https://api.cashfree.com/pg/orders",
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
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

    // 1. Check Database First (in case webhook already processed it)
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: currentRecord, error: fetchError } = await supabase
      .from("enrollments")
      .select("status, full_name, email, course_title")
      .eq("cf_payment_id", orderId)
      .maybeSingle();

    // We will fetch from Cashfree anyway to return the actual amount paid
    // which is needed for receipt generation on the frontend.
    const env = Deno.env.get("CASHFREE_MODE") || Deno.env.get("NEXT_PUBLIC_CASHFREE_MODE") || "production";
    const appId = Deno.env.get("CASHFREE_APP_ID") || Deno.env.get("NEXT_PUBLIC_CASHFREE_APP_ID");
    const secretKey = Deno.env.get("CASHFREE_SECRET_KEY");

    if (!appId || !secretKey) {
      return new Response(JSON.stringify({ error: "Cashfree credentials missing" }), { status: 500, headers: corsHeaders });
    }

    // 2. Fetch order details from Cashfree if not yet PAID in DB
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
      if (currentRecord?.status === "PAID") {
        return new Response(JSON.stringify({ status: "PAID" }), { headers: corsHeaders });
      }
      return new Response(JSON.stringify({ error: "Failed to verify payment with Cashfree" }), { status: 400, headers: corsHeaders });
    }

    const orderData = await response.json();

    // 3. Update Database if Cashfree order is PAID
    if (orderData.order_status === "PAID") {
      let paymentMethod = "cashfree";
      let paymentAmount = orderData.order_amount;
      let paymentCurrency = orderData.order_currency || "INR";
      let paymentTime = new Date().toISOString();

      // Fetch payments to get details
      try {
        const paymentsUrl = `${cfUrl}/payments`;
        const paymentsResponse = await fetch(paymentsUrl, {
          method: "GET",
          headers: {
            "x-api-version": "2023-08-01",
            "x-client-id": appId,
            "x-client-secret": secretKey,
          },
        });
        if (paymentsResponse.ok) {
          const paymentsData = await paymentsResponse.json();
          if (Array.isArray(paymentsData)) {
            const successPayment = paymentsData.find((p: any) => p.payment_status === "SUCCESS");
            if (successPayment) {
              paymentMethod = successPayment.payment_group || "cashfree";
              paymentAmount = successPayment.payment_amount;
              paymentCurrency = successPayment.payment_currency || "INR";
              paymentTime = successPayment.payment_time || new Date().toISOString();
            }
          }
        }
      } catch (e) {
        console.warn("Failed to fetch payment details from Cashfree:", e);
      }

      if (currentRecord && currentRecord.status === "PENDING") {
         // Update to PAID with all details
         const { data: updatedRecord, error: dbError } = await supabase
           .from("enrollments")
           .update({ 
             status: "PAID",
             payment_amount: paymentAmount,
             payment_currency: paymentCurrency,
             payment_method: paymentMethod,
             payment_time: paymentTime,
           })
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

      return new Response(JSON.stringify({ status: "PAID", amount: orderData.order_amount }), { headers: corsHeaders });
    }

    return new Response(JSON.stringify({ status: orderData.order_status, amount: orderData.order_amount }), { headers: corsHeaders });
  } catch (error: any) {
    console.error("Verification error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});
