// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-razorpay-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get("x-razorpay-signature");
    const rawBody = await req.text();

    if (!signature) {
      console.error("Missing Razorpay signature");
      return new Response(JSON.stringify({ error: "Missing signature" }), { status: 400 });
    }

    const webhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
    if (!webhookSecret) {
      throw new Error("RAZORPAY_WEBHOOK_SECRET not set in Supabase Secrets");
    }

    // 1. Verify Razorpay Signature (HMAC-SHA256)
    const encoder = new TextEncoder();
    const data = encoder.encode(rawBody);
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(webhookSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const signBuffer = await crypto.subtle.sign("HMAC", key, data);
    const signatureArray = Array.from(new Uint8Array(signBuffer));
    const expectedSignature = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (signature !== expectedSignature) {
      console.error("Invalid Webhook Signature. Potential fraud attempt.");
      return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 401 });
    }

    // 2. Parse Validated Data
    const payload = JSON.parse(rawBody);

    // We only process 'order.paid' or 'payment.captured'
    if (payload.event === "order.paid" || payload.event === "payment.captured") {
      
      const paymentEntity = payload.payload?.payment?.entity;
      const orderEntity = payload.payload?.order?.entity;
      
      // Receipt contains our NLIT_RZP_... ID
      let receiptId = orderEntity?.receipt;
      
      // If order entity isn't included in the payload (rare, but possible), fetch it
      if (!receiptId && paymentEntity?.order_id) {
         const keyId = Deno.env.get("RAZORPAY_KEY_ID");
         const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
         const authHeader = `Basic ${btoa(`${keyId}:${keySecret}`)}`;
         
         const orderRes = await fetch(`https://api.razorpay.com/v1/orders/${paymentEntity.order_id}`, {
             headers: { "Authorization": authHeader }
         });
         const orderData = await orderRes.json();
         if (orderData && orderData.receipt) {
             receiptId = orderData.receipt;
         }
      }

      if (receiptId && paymentEntity?.status === "captured") {
        console.log(`Processing verified payment for order receipt: ${receiptId}`);
        
        const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
        const supabase = createClient(supabaseUrl, supabaseKey);

        // 3. Update DB with payment details
        const { data: updatedEnrollment, error } = await supabase
          .from("enrollments")
          .update({ 
            status: "PAID",
            payment_method: paymentEntity.method || "razorpay",
            payment_amount: paymentEntity.amount / 100, // Convert from paise
            payment_currency: paymentEntity.currency || "INR",
            payment_time: new Date(paymentEntity.created_at * 1000).toISOString(),
          })
          .eq("cf_payment_id", receiptId)
          .eq("status", "PENDING")
          .select()
          .single();

        if (error && error.code !== 'PGRST116') {
          // PGRST116 means no rows returned (maybe already PAID)
          console.error("Database update error:", error);
          return new Response("Internal Server Error", { status: 500 });
        }
        
        if (updatedEnrollment) {
          console.log(`Enrollment successfully completed via Webhook for ${receiptId}`);

          // 4. Trigger Email Notification via Supabase Edge Function
          try {
            console.log(`Triggering confirmation email for ${updatedEnrollment.email}`);
            
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
                orderId: receiptId,
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
        } else {
          console.log(`Order ${receiptId} already marked as PAID or not found.`);
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
