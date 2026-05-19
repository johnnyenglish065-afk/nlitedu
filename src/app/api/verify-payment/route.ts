import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const CASHFREE_MODES = {
  sandbox: "https://sandbox.cashfree.com/pg/orders",
  production: "https://api.cashfree.com/pg/orders",
};

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

    // 1. DATABASE FIRST: Check if webhook already marked it as PAID
    const { data: currentRecord } = await supabase
      .from("enrollments")
      .select("status, full_name, email, course_title")
      .eq("cf_payment_id", orderId)
      .maybeSingle();

    if (currentRecord?.status === "PAID") {
      // Already paid - trigger email (in case webhook didn't send it) and return success
      triggerEmail(currentRecord.full_name, currentRecord.email, currentRecord.course_title, orderId);
      return NextResponse.json({ status: "PAID" });
    }

    // 2. If not yet PAID in DB, verify with Cashfree API
    const env = process.env.NEXT_PUBLIC_CASHFREE_MODE || "sandbox";
    const appId = process.env.NEXT_PUBLIC_CASHFREE_APP_ID || process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;

    if (!appId || !secretKey) {
      return NextResponse.json({ error: "Cashfree credentials missing" }, { status: 500 });
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
      return NextResponse.json({ error: "Failed to verify payment with Cashfree" }, { status: 400 });
    }

    const orderData = await response.json();

    // 3. Update Database if Cashfree says PAID
    if (orderData.order_status === "PAID") {
      if (currentRecord && currentRecord.status === "PENDING") {
        const { data: updatedRecord, error: dbError } = await supabase
          .from("enrollments")
          .update({ status: "PAID" })
          .eq("cf_payment_id", orderId)
          .select()
          .single();

        if (dbError) {
          console.error("Failed to update enrollment status:", dbError);
        } else if (updatedRecord) {
          // Trigger confirmation email
          triggerEmail(updatedRecord.full_name, updatedRecord.email, updatedRecord.course_title, orderId);
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

// Fire-and-forget email trigger via our own /api/email route
function triggerEmail(studentName: string, studentEmail: string, courseTitle: string, orderId: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nlitedu.com";
  fetch(`${siteUrl}/api/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentName, studentEmail, courseTitle, orderId }),
  }).catch((e) => console.error("Failed to trigger email:", e));
}
