// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!keySecret) {
      throw new Error("Razorpay credentials not configured in Supabase secrets");
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new Error("Missing Razorpay payment verification parameters");
    }

    // Verify signature using Web Crypto API
    const textEncoder = new TextEncoder();
    const data = textEncoder.encode(`${razorpay_order_id}|${razorpay_payment_id}`);
    const key = await crypto.subtle.importKey(
      "raw",
      textEncoder.encode(keySecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, data);
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    const generatedSignature = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (generatedSignature !== razorpay_signature) {
      throw new Error("Invalid payment signature");
    }

    // Since signature is valid, fetch the payment details from Razorpay to get the amount paid
    const keyId = Deno.env.get("RAZORPAY_KEY_ID");
    const authHeader = `Basic ${base64Encode(`${keyId}:${keySecret}`)}`;

    const response = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
      method: "GET",
      headers: {
        "Authorization": authHeader,
      }
    });

    const paymentData = await response.json();
    
    if (!response.ok) {
       throw new Error("Payment verified but failed to fetch payment details from Razorpay");
    }

    if (paymentData.status !== "captured") {
        throw new Error("Payment is not in captured status");
    }

    // 3. Update Database if Razorpay order is PAID
    if (orderId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: currentRecord } = await supabase
        .from("enrollments")
        .select("status, full_name, email, course_title")
        .eq("cf_payment_id", orderId)
        .maybeSingle();

      if (currentRecord && currentRecord.status === "PENDING") {
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
    }

    return new Response(JSON.stringify({ 
      status: "PAID",
      amount: paymentData.amount / 100 // convert back to INR from paise
    }), {
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
