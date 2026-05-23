import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Supabase configuration missing on server" },
        { status: 500 }
      );
    }

    // Warn in the console if we fall back to the public anon key, as RLS will block selection.
    if (supabaseKey === process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn(
        "WARNING: verify-student API is running with the public Anon key. " +
        "RLS policies will likely block profile/enrollment lookups. " +
        "Please define SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY in your environment."
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
    const cleanEmail = email.trim().toLowerCase();

    // 1. Check in profiles table
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("email")
      .ilike("email", cleanEmail)
      .limit(1);

    if (profileError) {
      console.error("Database Error (Profiles):", profileError);
      return NextResponse.json(
        { error: `Database error checking profile: ${profileError.message}` },
        { status: 500 }
      );
    }

    // 2. Check in enrollments table
    const { data: enrollment, error: enrollmentError } = await supabaseAdmin
      .from("enrollments")
      .select("email")
      .ilike("email", cleanEmail)
      .limit(1);

    if (enrollmentError) {
      console.error("Database Error (Enrollments):", enrollmentError);
      return NextResponse.json(
        { error: `Database error checking enrollments: ${enrollmentError.message}` },
        { status: 500 }
      );
    }

    const exists =
      (profile && profile.length > 0) || (enrollment && enrollment.length > 0);

    return NextResponse.json({ registered: exists });
  } catch (error: any) {
    console.error("Error in verify-student API route:", error);
    return NextResponse.json(
      { error: "Failed to verify student status", details: error.message },
      { status: 500 }
    );
  }
}
