import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const CASHFREE_MODES = {
  sandbox: "https://sandbox.cashfree.com/pg/orders",
  production: "https://api.cashfree.com/pg/orders",
};

// Helper: wait ms
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 1. DATABASE FIRST: Check if webhook already marked it as PAID (with retries)
    for (let dbAttempt = 0; dbAttempt < 3; dbAttempt++) {
      if (dbAttempt > 0) await wait(2000);

      const { data: currentRecord } = await supabase
        .from("enrollments")
        .select("status, full_name, email, course_title")
        .eq("cf_payment_id", orderId)
        .maybeSingle();

      if (currentRecord?.status === "PAID") {
        // Already paid - trigger email (in case webhook didn't send it) and return success
        await triggerEmail(currentRecord.full_name, currentRecord.email, currentRecord.course_title, orderId);
        return NextResponse.json({ status: "PAID" });
      }
    }

    // 2. If not yet PAID in DB, try to verify with Cashfree API (if credentials available)
    const env = process.env.NEXT_PUBLIC_CASHFREE_MODE || "sandbox";
    const appId = process.env.NEXT_PUBLIC_CASHFREE_APP_ID || process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;

    if (!appId || !secretKey) {
      // Credentials not available on this server — return current DB status gracefully
      // The webhook should handle the DB update; frontend will retry
      console.warn("Cashfree credentials not configured on Vercel. Falling back to DB-only check.");
      const { data: fallbackRecord } = await supabase
        .from("enrollments")
        .select("status")
        .eq("cf_payment_id", orderId)
        .maybeSingle();
      return NextResponse.json({ status: fallbackRecord?.status || "PENDING" });
    }

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
      // Cashfree API failed — return DB status instead of hard error
      const { data: dbFallback } = await supabase
        .from("enrollments")
        .select("status")
        .eq("cf_payment_id", orderId)
        .maybeSingle();
      return NextResponse.json({ status: dbFallback?.status || "PENDING" });
    }

    const orderData = await response.json();

    // 3. Update Database if Cashfree says PAID
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

      const { data: preCheck } = await supabase
        .from("enrollments")
        .select("status, full_name, email, course_title")
        .eq("cf_payment_id", orderId)
        .maybeSingle();

      if (preCheck && preCheck.status === "PENDING") {
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
          .select("full_name, email, course_title")
          .single();

        if (dbError) {
          console.error("Failed to update enrollment status:", dbError);
        } else if (updatedRecord) {
          // Trigger confirmation email
          await triggerEmail(updatedRecord.full_name, updatedRecord.email, updatedRecord.course_title, orderId);
        }
      }

      return NextResponse.json({ status: "PAID" });
    }

    return NextResponse.json({ status: orderData.order_status });
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Email trigger via our own /api/email route (awaited to ensure completion in serverless environments)
async function triggerEmail(studentName: string, studentEmail: string, courseTitle: string, orderId: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nlitedu.com";
  try {
    const res = await fetch(`${siteUrl}/api/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentName, studentEmail, courseTitle, orderId }),
    });
    if (!res.ok) {
      console.error(`Email endpoint returned status ${res.status}`);
    }
  } catch (e) {
    console.error("Failed to trigger email:", e);
  }
}
