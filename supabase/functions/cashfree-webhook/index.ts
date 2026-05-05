import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-signature, x-webhook-timestamp",
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
      console.error("Missing webhook headers");
      return new Response(JSON.stringify({ error: "Missing signature headers" }), { status: 400 });
    }

    const secretKey = Deno.env.get("CASHFREE_SECRET_KEY");
    if (!secretKey) {
      throw new Error("CASHFREE_SECRET_KEY not set in Supabase Secrets");
    }

    // 1. Verify Cashfree Signature (HMAC-SHA256)
    const encoder = new TextEncoder();
    const signatureData = timestamp + rawBody;
    const keyData = encoder.encode(secretKey);
    
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const signBuffer = await crypto.subtle.sign(
      "HMAC",
      cryptoKey,
      encoder.encode(signatureData)
    );
    
    const hashArray = Array.from(new Uint8Array(signBuffer));
    const hashString = String.fromCharCode(...hashArray);
    const expectedSignature = btoa(hashString);

    if (signature !== expectedSignature) {
      console.error("Invalid Webhook Signature. Potential fraud attempt.");
      return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 401 });
    }

    // 2. Parse Validated Data
    const payload = JSON.parse(rawBody);
    const orderId = payload.data?.order?.order_id;
    const payment = payload.data?.payment;
    const paymentStatus = payment?.payment_status;

    if (orderId && paymentStatus === "SUCCESS") {
      console.log(`Processing verified payment for order: ${orderId}`);
      
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      // 3. Update DB with "Each and Every Detail"
      const { data: updatedEnrollment, error } = await supabase
        .from("enrollments")
        .update({ 
          status: "PAID",
          cf_payment_id: payment.cf_payment_id,
          payment_method: payment.payment_group,
          payment_amount: payment.payment_amount,
          payment_currency: payment.payment_currency || "INR",
          payment_time: payment.payment_time,
        })
        .eq("cf_payment_id", orderId)
        .eq("status", "PENDING")
        .select()
        .single();

      if (error) {
        console.error("Database update error:", error);
        return new Response("Internal Server Error", { status: 500 });
      }
      
      console.log(`Enrollment successfully completed for ${orderId}`);

      // 4. Trigger Email Notification via Supabase Edge Function
      if (updatedEnrollment) {
        try {
          console.log(`Triggering confirmation email for ${updatedEnrollment.email}`);
          // Using Edge Function invocation instead of Next.js API
          const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
          const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
          
          const emailRes = await fetch(`${supabaseUrl}/functions/v1/email-service`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${supabaseKey}`
            },
            body: JSON.stringify({
              studentName: updatedEnrollment.full_name,
              studentEmail: updatedEnrollment.email,
              courseTitle: updatedEnrollment.course_title,
              orderId: orderId,
            }),
          });
          if (!emailRes.ok) {
            console.error("Failed to trigger email API:", await emailRes.text());
          } else {
            console.log("Email triggered successfully");
          }
        } catch (emailErr) {
          console.error("Error triggering email:", emailErr);
        }
      }
    }

    return new Response(JSON.stringify({ status: "success" }), {
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
