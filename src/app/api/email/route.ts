import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentName, studentEmail, courseTitle, orderId } = body;

    if (!studentName || !studentEmail || !courseTitle || !orderId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://othxceezbpfiauaevibt.supabase.co";
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/email-service`;

    console.log(`Forwarding email request to Supabase Edge Function: ${edgeFunctionUrl}`);

    const response = await fetch(edgeFunctionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        studentName,
        studentEmail,
        courseTitle,
        orderId,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Supabase Edge Function failed:", result);
      return NextResponse.json(
        { error: "Failed to send email via Edge Function", details: result.error },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, messageId: result.messageId });
  } catch (error: any) {
    console.error("Error in email proxy route:", error);
    return NextResponse.json(
      { error: "Failed to send email", details: error.message },
      { status: 500 }
    );
  }
}

