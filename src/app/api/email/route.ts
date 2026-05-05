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

    // Fetch full enrollment details from Supabase to include in the email
    let enrollmentDetails = "";
    let paymentDetails = "";
    
    if (supabase) {
      const { data: enrollment, error } = await supabase
        .from("enrollments")
        .select("*")
        .eq("cf_payment_id", orderId)
        .single();
        
      if (enrollment) {
        enrollmentDetails = `
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
            <h3 style="color: #334155; margin-top: 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px;">Student Details</h3>
            <p style="margin: 5px 0; color: #475569;"><strong>Name:</strong> ${enrollment.full_name || studentName}</p>
            <p style="margin: 5px 0; color: #475569;"><strong>Email:</strong> ${enrollment.email || studentEmail}</p>
            <p style="margin: 5px 0; color: #475569;"><strong>WhatsApp:</strong> ${enrollment.whatsapp || 'N/A'}</p>
            <p style="margin: 5px 0; color: #475569;"><strong>DOB:</strong> ${enrollment.dob || 'N/A'}</p>
            <p style="margin: 5px 0; color: #475569;"><strong>Gender:</strong> ${enrollment.gender || 'N/A'}</p>
            <p style="margin: 5px 0; color: #475569;"><strong>College:</strong> ${enrollment.college_name || 'N/A'}</p>
            <p style="margin: 5px 0; color: #475569;"><strong>Branch:</strong> ${enrollment.branch || 'N/A'}</p>
            <p style="margin: 5px 0; color: #475569;"><strong>Semester:</strong> ${enrollment.semester || 'N/A'}</p>
            <p style="margin: 5px 0; color: #475569;"><strong>Reg No (BRN):</strong> ${enrollment.brn || 'N/A'}</p>
          </div>
        `;
        
        const amount = enrollment.payment_amount ? `₹${enrollment.payment_amount}` : "Paid";
        const method = enrollment.payment_method || "Online Payment";
        const time = enrollment.payment_time || new Date().toLocaleString();
        
        paymentDetails = `
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
            <h3 style="color: #334155; margin-top: 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px;">Payment Details</h3>
            <p style="margin: 5px 0; color: #475569;"><strong>Transaction ID:</strong> ${orderId}</p>
            <p style="margin: 5px 0; color: #475569;"><strong>Amount:</strong> ${amount}</p>
            <p style="margin: 5px 0; color: #475569;"><strong>Payment Method:</strong> ${method}</p>
            <p style="margin: 5px 0; color: #475569;"><strong>Payment Time:</strong> ${time}</p>
            <p style="margin: 8px 0 0 0; color: #475569;"><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">PAID & VERIFIED</span></p>
          </div>
        `;
      }
    }

    // Fallback if DB fetch fails
    if (!paymentDetails) {
      paymentDetails = `
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
          <h3 style="color: #334155; margin-top: 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px;">Payment Details</h3>
          <p style="margin: 5px 0; color: #475569;"><strong>Transaction ID:</strong> ${orderId}</p>
          <p style="margin: 8px 0 0 0; color: #475569;"><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">PAID & VERIFIED</span></p>
        </div>
      `;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "465", 10),
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

    // Student Confirmation Email
    const studentMailOptions = {
      from: `NLITedu Admissions <${process.env.SMTP_USER}>`,
      to: studentEmail,
      subject: `Enrollment Confirmation: ${courseTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #ffffff;">
          <h2 style="color: #2563eb; text-align: center;">Welcome to NLITedu!</h2>
          <p style="font-size: 16px; color: #334155;">Hi <strong>${studentName}</strong>,</p>
          <p style="font-size: 16px; color: #334155;">Congratulations! Your enrollment for <strong>${courseTitle}</strong> has been successfully confirmed.</p>
          
          ${enrollmentDetails}
          ${paymentDetails}

          <p style="font-size: 16px; color: #334155; margin-top: 20px;">Our team will reach out to you shortly with your batch details and login credentials for the portal.</p>
          <p style="font-size: 16px; color: #334155;">If you have any immediate questions, feel free to reply to this email or contact us via WhatsApp.</p>
          
          <p style="font-size: 14px; color: #64748b; text-align: center; margin-top: 30px;">
            Best Regards,<br/>
            <strong>NLITedu Admissions Team</strong><br/>
            <a href="https://nlitedu.com" style="color: #2563eb;">nlitedu.com</a>
          </p>
        </div>
      `,
    };

    // Admin Notification Email
    const adminMailOptions = {
      from: `NLITedu System <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `🎉 New Enrollment Alert: ${studentName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; background-color: #ffffff;">
          <h2 style="color: #10b981;">New Successful Enrollment!</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #e2e8f0; background-color: #f8fafc; font-weight: bold; width: 120px;">Student Name</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0;">${studentName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #e2e8f0; background-color: #f8fafc; font-weight: bold;">Email</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0;">${studentEmail}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #e2e8f0; background-color: #f8fafc; font-weight: bold;">Course</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0;">${courseTitle}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #e2e8f0; background-color: #f8fafc; font-weight: bold;">Transaction ID</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0;">${orderId}</td>
            </tr>
          </table>
          <p style="color: #64748b; font-size: 14px; margin-top: 20px;">Please check the Supabase dashboard for full details including uploaded documents.</p>
        </div>
      `,
    };

    // Send both emails asynchronously in parallel
    await Promise.all([
      transporter.sendMail(studentMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);

    return NextResponse.json({ success: true, message: "Emails sent successfully" });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email", details: error.message },
      { status: 500 }
    );
  }
}

