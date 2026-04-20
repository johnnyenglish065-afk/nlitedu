import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #f8fafc;">
          <h2 style="color: #2563eb; text-align: center;">Welcome to NLITedu!</h2>
          <p style="font-size: 16px; color: #334155;">Hi <strong>${studentName}</strong>,</p>
          <p style="font-size: 16px; color: #334155;">Congratulations! Your enrollment for <strong>${courseTitle}</strong> has been successfully confirmed.</p>
          
          <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #cbd5e1;">
            <p style="margin: 0; color: #475569;"><strong>Transaction ID:</strong> ${orderId}</p>
            <p style="margin: 8px 0 0 0; color: #475569;"><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">PAID & VERIFIED</span></p>
          </div>

          <p style="font-size: 16px; color: #334155;">Our team will reach out to you shortly with your batch details and login credentials for the portal.</p>
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
