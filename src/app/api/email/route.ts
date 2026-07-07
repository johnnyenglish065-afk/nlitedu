import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, studentName, studentEmail, courseTitle, orderId, certificateNumber, pdfUrl } = body;

    if (!studentName || !studentEmail || !courseTitle) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Configure GoDaddy SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtpout.secureserver.net",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER || "info@nlitedu.com",
        pass: process.env.SMTP_PASS || "Nlitedu@Admin2026",
      },
    });

    if (type === "certificate") {
      if (!certificateNumber || !pdfUrl) {
        return NextResponse.json(
          { error: "Missing certificate number or PDF URL" },
          { status: 400 }
        );
      }

      console.log(`Sending certificate email to ${studentEmail} for ${courseTitle}`);

      // Download PDF certificate from Cloudinary to attach it
      let attachments: any[] = [];
      try {
        const pdfResponse = await fetch(pdfUrl);
        if (pdfResponse.ok) {
          const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());
          attachments.push({
            filename: `NLIT_Certificate_${studentName.replace(/\s+/g, "_")}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          });
          console.log("Certificate PDF downloaded and attached successfully.");
        } else {
          console.error(`Failed to download certificate from Cloudinary: ${pdfResponse.statusText}`);
        }
      } catch (err) {
        console.error("Error downloading certificate for attachment:", err);
      }

      // Animated Certificate Congratulations HTML template
      const htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&display=swap');
            body {
              margin: 0;
              padding: 0;
              background-color: #f3f4f6;
              font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            }
            .email-container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
              border: 1px solid #e5e7eb;
            }
            .header-banner {
              background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
              padding: 50px 20px;
              text-align: center;
              color: #ffffff;
              position: relative;
            }
            .logo {
              font-size: 24px;
              font-weight: 800;
              letter-spacing: 2px;
              color: #3b82f6;
              background: #ffffff;
              display: inline-block;
              padding: 6px 16px;
              border-radius: 50px;
              margin-bottom: 20px;
              box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            }
            .title {
              font-size: 28px;
              font-weight: 800;
              margin: 0;
              text-transform: uppercase;
              letter-spacing: 1px;
              line-height: 1.2;
              color: #ffffff;
              text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .subtitle {
              font-size: 14px;
              font-weight: 600;
              color: #93c5fd;
              margin-top: 10px;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .badge-container {
              margin-top: -30px;
              text-align: center;
            }
            .badge {
              font-size: 50px;
              background-color: #ffffff;
              display: inline-block;
              width: 90px;
              height: 90px;
              line-height: 90px;
              border-radius: 50%;
              box-shadow: 0 10px 20px rgba(59, 130, 246, 0.2);
            }
            .content {
              padding: 40px 30px;
              text-align: center;
              color: #374151;
            }
            .greeting {
              font-size: 20px;
              font-weight: 600;
              margin-bottom: 15px;
              color: #1f2937;
            }
            .message-text {
              font-size: 15px;
              line-height: 1.6;
              color: #4b5563;
              margin-bottom: 30px;
            }
            .details-card {
              background-color: #f8fafc;
              border: 1px solid #f1f5f9;
              border-radius: 16px;
              padding: 24px;
              margin-bottom: 35px;
              text-align: left;
            }
            .detail-row {
              margin-bottom: 12px;
              font-size: 14px;
            }
            .detail-row:last-child {
              margin-bottom: 0;
            }
            .detail-label {
              font-weight: 600;
              color: #64748b;
              display: inline-block;
              width: 150px;
            }
            .detail-value {
              font-weight: 600;
              color: #0f172a;
            }
            .cta-btn {
              background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
              color: #ffffff !important;
              padding: 16px 36px;
              font-weight: 700;
              text-decoration: none;
              border-radius: 12px;
              display: inline-block;
              font-size: 16px;
              box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2);
              transition: transform 0.2s, box-shadow 0.2s;
            }
            .verify-text {
              font-size: 12px;
              color: #64748b;
              margin-top: 30px;
            }
            .verify-link {
              color: #2563eb;
              text-decoration: none;
              font-weight: 600;
            }
            .footer {
              background-color: #f8fafc;
              padding: 30px 20px;
              text-align: center;
              border-top: 1px solid #f1f5f9;
              font-size: 12px;
              color: #94a3b8;
              line-height: 1.5;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header-banner">
              <div class="logo">NLITedu</div>
              <h1 class="title">Congratulations!</h1>
              <div class="subtitle">Certificate of Completion Issued</div>
            </div>
            <div class="badge-container">
              <span class="badge">🎓</span>
            </div>
            <div class="content">
              <div class="greeting">Dear ${studentName},</div>
              <p class="message-text">
                Great job! You have successfully completed all the requirements for your training and internship program. In recognition of your dedication and excellent performance, your official certificate has been issued.
              </p>
              
              <div class="details-card">
                <div class="detail-row">
                  <span class="detail-label">Candidate Name:</span>
                  <span class="detail-value">${studentName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Course Title:</span>
                  <span class="detail-value">${courseTitle}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Certificate No:</span>
                  <span class="detail-value">${certificateNumber}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Verification Status:</span>
                  <span class="detail-value" style="color: #10b981;">✓ Authenticated</span>
                </div>
              </div>

              <a href="${pdfUrl}" class="cta-btn">Download Certificate PDF</a>
              
              <p class="verify-text">
                This credential is securely registered on our server. To verify its authenticity, visit:<br/>
                <a class="verify-link" href="https://nlitedu.in/verify?id=${certificateNumber}">https://nlitedu.in/verify?id=${certificateNumber}</a>
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} NLITedu. All rights reserved.</p>
              <p>This is an automated delivery. Please do not reply directly to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: '"NLITedu" <info@nlitedu.com>',
        to: studentEmail,
        subject: `🎓 Congratulations ${studentName}! Your Certificate for ${courseTitle} is issued`,
        html: htmlBody,
        attachments: attachments,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`Certificate email sent successfully to ${studentEmail}: ${info.messageId}`);
      return NextResponse.json({ success: true, messageId: info.messageId });
    } else {
      // Default: Course Enrollment Confirmation
      if (!orderId) {
        return NextResponse.json(
          { error: "Missing orderId for enrollment confirmation" },
          { status: 400 }
        );
      }

      console.log(`Sending enrollment email to ${studentEmail} for ${courseTitle}`);

      const htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&display=swap');
            body {
              margin: 0;
              padding: 0;
              background-color: #f3f4f6;
              font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            }
            .email-container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
              border: 1px solid #e5e7eb;
            }
            .header-banner {
              background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
              padding: 50px 20px;
              text-align: center;
              color: #ffffff;
            }
            .logo {
              font-size: 24px;
              font-weight: 800;
              letter-spacing: 2px;
              color: #3b82f6;
              background: #ffffff;
              display: inline-block;
              padding: 6px 16px;
              border-radius: 50px;
              margin-bottom: 20px;
              box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            }
            .title {
              font-size: 26px;
              font-weight: 800;
              margin: 0;
              text-transform: uppercase;
              letter-spacing: 1px;
              line-height: 1.2;
              color: #ffffff;
            }
            .subtitle {
              font-size: 14px;
              font-weight: 600;
              color: #3b82f6;
              margin-top: 10px;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .content {
              padding: 40px 30px;
              text-align: left;
              color: #374151;
            }
            .greeting {
              font-size: 18px;
              font-weight: 600;
              margin-bottom: 15px;
              color: #1f2937;
            }
            .message-text {
              font-size: 15px;
              line-height: 1.6;
              color: #4b5563;
              margin-bottom: 25px;
            }
            .details-card {
              background-color: #f8fafc;
              border: 1px solid #f1f5f9;
              border-radius: 16px;
              padding: 24px;
              margin-bottom: 30px;
            }
            .detail-row {
              margin-bottom: 12px;
              font-size: 14px;
            }
            .detail-row:last-child {
              margin-bottom: 0;
            }
            .detail-label {
              font-weight: 600;
              color: #64748b;
              display: inline-block;
              width: 140px;
            }
            .detail-value {
              font-weight: 600;
              color: #0f172a;
            }
            .cta-btn {
              background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
              color: #ffffff !important;
              padding: 16px 36px;
              font-weight: 700;
              text-decoration: none;
              border-radius: 12px;
              display: block;
              text-align: center;
              font-size: 16px;
              box-shadow: 0 10px 20px rgba(59, 130, 246, 0.2);
              margin-bottom: 20px;
            }
            .footer {
              background-color: #f8fafc;
              padding: 30px 20px;
              text-align: center;
              border-top: 1px solid #f1f5f9;
              font-size: 12px;
              color: #94a3b8;
              line-height: 1.5;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header-banner">
              <div class="logo">NLITedu</div>
              <h1 class="title">Welcome Aboard!</h1>
              <div class="subtitle">Course Enrollment Successful</div>
            </div>
            <div class="content">
              <div class="greeting">Dear ${studentName},</div>
              <p class="message-text">
                Thank you for choosing NLITedu. We are excited to inform you that your course enrollment payment has been successfully verified. Your training is officially confirmed.
              </p>
              
              <div class="details-card">
                <div class="detail-row">
                  <span class="detail-label">Course:</span>
                  <span class="detail-value">${courseTitle}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Payment ID:</span>
                  <span class="detail-value">${orderId}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status:</span>
                  <span class="detail-value" style="color: #10b981;">✓ Paid & Registered</span>
                </div>
              </div>

              <a href="https://nlitedu.in/profile" class="cta-btn">Access Student Dashboard</a>
              
              <p style="font-size: 14px; color: #4b5563; line-height: 1.6;">
                You can now log in to your profile to download your invoice, view training schedules, upload required academic marksheets, and track your progress.
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} NLITedu. All rights reserved.</p>
              <p>This is an automated delivery. Please do not reply directly to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: '"NLITedu" <info@nlitedu.com>',
        to: studentEmail,
        subject: `📝 NLITedu Enrollment Confirmed: ${courseTitle}`,
        html: htmlBody,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`Enrollment confirmation email sent successfully to ${studentEmail}: ${info.messageId}`);
      return NextResponse.json({ success: true, messageId: info.messageId });
    }
  } catch (error: any) {
    console.error("Error in email proxy route:", error);
    return NextResponse.json(
      { error: "Failed to send email", details: error.message },
      { status: 500 }
    );
  }
}
