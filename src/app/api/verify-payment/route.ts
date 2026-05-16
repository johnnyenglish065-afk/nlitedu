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

    const env = process.env.CASHFREE_MODE || process.env.NEXT_PUBLIC_CASHFREE_MODE || "production";
    const appId = process.env.NEXT_PUBLIC_CASHFREE_APP_ID || process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;

    if (!appId || !secretKey) {
      return NextResponse.json({ error: "Cashfree credentials missing" }, { status: 500 });
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
      return NextResponse.json({ error: "Failed to verify payment with Cashfree" }, { status: 400 });
    }

    const orderData = await response.json();

    // 2. Update Database if order is PAID
    if (orderData.order_status === "PAID") {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

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
           .update({ 
             status: "PAID",
             // Don't overwrite cf_payment_id to an integer so we can still track it by orderId
             // Webhook might do it but here we just update status
           })
           .eq("cf_payment_id", orderId)
           .select()
           .single();
           
         if (dbError) {
           console.error("Failed to update enrollment status:", dbError);
         } else if (updatedRecord) {
           // Also trigger email if we updated it here
           try {
             await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://nlitedu.com'}/api/email`, {
               method: "POST",
               headers: { "Content-Type": "application/json" },
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

      return NextResponse.json({ status: "PAID" });
    }

    return NextResponse.json({ status: orderData.order_status });
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
