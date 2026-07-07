import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { action, studentName, courseName, collegeName, grade, duration, id, pdfUrl, issueDate } = await req.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    if (action === "create") {
      if (!studentName || !courseName) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }

      const { data, error } = await supabaseAdmin
        .from("certificates")
        .insert({
          student_name: studentName,
          course_name: courseName,
          college_name: collegeName || "NLIT Authorized Center",
          grade: grade || "A",
          duration: duration || "4 Weeks",
          pdf_url: null,
          issue_date: issueDate || new Date().toISOString().split("T")[0],
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating certificate:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, data });
    } else if (action === "update") {
      if (!id || !pdfUrl) {
        return NextResponse.json({ error: "Missing ID or PDF URL" }, { status: 400 });
      }

      const { data, error } = await supabaseAdmin
        .from("certificates")
        .update({ pdf_url: pdfUrl })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating certificate PDF URL:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, data });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Error in claim API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
