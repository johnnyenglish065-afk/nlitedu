import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import QRCode from "qrcode";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";

// ─── Font Registration ──────────────────────────────────────────────────────

let fontsRegistered = false;

function registerFonts() {
  if (fontsRegistered) return;

  try {
    const fontDir = path.join(process.cwd(), "public", "fonts");

    const boldPath = path.join(fontDir, "Roboto-Bold.ttf");
    const regularPath = path.join(fontDir, "Roboto-Regular.ttf");

    if (fs.existsSync(boldPath)) {
      GlobalFonts.registerFromPath(boldPath, "Roboto");
      console.log("✅ Registered Roboto Bold font");
    } else {
      console.warn("⚠️ Roboto-Bold.ttf not found at:", boldPath);
    }

    if (fs.existsSync(regularPath)) {
      GlobalFonts.registerFromPath(regularPath, "RobotoRegular");
      console.log("✅ Registered Roboto Regular font");
    } else {
      console.warn("⚠️ Roboto-Regular.ttf not found at:", regularPath);
    }

    fontsRegistered = true;
    console.log("Available font families:", GlobalFonts.families.map((f: any) => f.family).join(", "));
  } catch (err) {
    console.error("Font registration error:", err);
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!serviceKey) {
    console.warn(
      "⚠️ SUPABASE_SERVICE_ROLE_KEY is not set! Using anon key — database writes may fail due to RLS policies."
    );
  }

  const key = serviceKey || anonKey;
  return createClient(url, key);
}

async function uploadToCloudinary(buffer: Buffer, publicId: string): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary configuration missing. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.");
  }

  const base64 = buffer.toString("base64");
  const dataUri = `data:image/png;base64,${base64}`;

  const formData = new FormData();
  formData.append("file", dataUri);
  formData.append("upload_preset", uploadPreset);
  formData.append("public_id", publicId);
  formData.append("folder", "certificates");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Cloudinary upload failed: ${errText}`);
  }

  const data = await res.json();
  return data.secure_url;
}

// ─── Canvas certificate renderer ───────────────────────────────────────────

function centerTextInGap(
  ctx: any,
  text: string,
  baseFontSize: number,
  gapStart: number,
  gapEnd: number | null,
  y: number,
  fontWeight = "bold"
) {
  // Use Roboto (our bundled font) instead of Arial
  const fontFamily = "Roboto";
  let fontSize = baseFontSize;
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  let textWidth = ctx.measureText(text).width;

  if (gapEnd !== null) {
    const maxWidth = gapEnd - gapStart;
    while (textWidth > maxWidth && fontSize > 10) {
      fontSize -= 2;
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      textWidth = ctx.measureText(text).width;
    }
    const gapCenter = gapStart + (gapEnd - gapStart) / 2;
    const x = gapCenter - textWidth / 2;
    ctx.fillText(text, x, y);
  } else {
    ctx.fillText(text, gapStart, y);
  }
}

async function generateCertificateImage(
  templatePath: string,
  student: any,
  startDate: string,
  endDate: string,
  certNumber: string
): Promise<Buffer> {
  // Ensure fonts are registered before rendering
  registerFonts();

  const templateImage = await loadImage(templatePath);
  const width = templateImage.width;
  const height = templateImage.height;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Draw template
  ctx.drawImage(templateImage, 0, 0, width, height);

  // Set text color
  ctx.fillStyle = "black";

  // Certificate ID
  centerTextInGap(ctx, certNumber, 55, 780, null, 445);

  // Date
  const dateStr = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).replace(/\//g, "-");
  centerTextInGap(ctx, dateStr, 55, 2850, null, 330);

  // Student Name (spaced letters)
  const rawName = (student.full_name || "UNKNOWN").toUpperCase();
  const spacedName = rawName.split("").join(" ");
  centerTextInGap(ctx, spacedName, 100, 0, width, 1040);

  // College
  const college = (student.college_name || "NLIT AUTHORIZED CENTER").toUpperCase();
  centerTextInGap(ctx, college, 60, 880, 1850, 1230);

  // Course
  const course = (student.course_title || "UNKNOWN COURSE").toUpperCase();
  centerTextInGap(ctx, course, 60, 850, 1320, 1345);

  // Start Date
  centerTextInGap(ctx, startDate, 60, 1480, 1800, 1345);

  // End Date
  centerTextInGap(ctx, endDate, 60, 1880, 2220, 1345);

  // QR Code
  const verifyUrl = `https://www.nlitedu.com/verify?id=${certNumber}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    width: 220,
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" },
  });
  const qrImage = await loadImage(qrDataUrl);
  const qrX = (width - 220) / 2;
  ctx.drawImage(qrImage, qrX, 2020, 220, 220);

  return canvas.toBuffer("image/png");
}

// ─── Email Sender Helper ───────────────────────────────────────────────────

async function sendCertificateEmail(
  studentName: string,
  studentEmail: string,
  courseTitle: string,
  certificateNumber: string,
  pdfUrl: string
) {
  try {
    // Validate SMTP config
    const smtpHost = (process.env.SMTP_HOST || "").replace(/^["']|["']$/g, '');
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = (process.env.SMTP_USER || "").replace(/^["']|["']$/g, '');
    const smtpPass = (process.env.SMTP_PASS || "").replace(/^["']|["']$/g, '');

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error("SMTP not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS in environment variables.");
      return false;
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort) || 465,
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    let attachments: any[] = [];
    try {
      const response = await fetch(pdfUrl);
      if (response.ok) {
        const buffer = Buffer.from(await response.arrayBuffer());
        const isPng = pdfUrl.toLowerCase().includes(".png") || !pdfUrl.toLowerCase().includes(".pdf");
        attachments.push({
          filename: `NLIT_Certificate_${studentName.replace(/\s+/g, "_")}.${isPng ? "png" : "pdf"}`,
          content: buffer,
          contentType: isPng ? "image/png" : "application/pdf",
        });
      }
    } catch (err) {
      console.error("Error fetching certificate for attachment:", err);
    }

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
            font-family: 'Montserrat', Arial, sans-serif;
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
          }
          .title {
            font-size: 28px;
            font-weight: 800;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 1px;
            line-height: 1.2;
          }
          .subtitle {
            font-size: 14px;
            font-weight: 600;
            color: #93c5fd;
            margin-top: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
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
          <div class="content">
            <div class="greeting">Dear ${studentName},</div>
            <p class="message-text">
              Great job! You have successfully completed all the requirements for your training and internship program. In recognition of your dedication and performance, your official certificate has been issued.
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
            <a href="${pdfUrl}" class="cta-btn" target="_blank">Download Certificate</a>
            <p class="verify-text">
              This credential is securely registered on our server. To verify its authenticity, visit:<br/>
              <a class="verify-link" href="https://www.nlitedu.com/verify?id=${certificateNumber}">https://www.nlitedu.com/verify?id=${certificateNumber}</a>
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} NLITedu. All rights reserved.</p>
            <p>This is an automated delivery. Please do not reply directly to this email.</p>
            <p style="margin-top: 15px; font-size: 10px; color: #cbd5e1;">System designed by <a href="https://saveragraphics.com" target="_blank" style="color: #94a3b8; text-decoration: underline;">SAVERAGRAPHICS</a> A Sindhura Group Company.</p>
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

    await transporter.sendMail(mailOptions);
    console.log(`Certificate email sent successfully to ${studentEmail}`);
    return true;
  } catch (error) {
    console.error(`Failed to send certificate email to ${studentEmail}:`, error);
    return false;
  }
}

// ─── Main POST handler ─────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { adminId, adminPass, startDate, endDate, courseFilter, mode, studentQuery, sendEmail } = body;

    // 1. Authenticate
    const expectedId = process.env.CERTIFICATE_ADMIN_ID;
    const expectedPass = process.env.CERTIFICATE_ADMIN_PASS;

    if (!expectedId || !expectedPass || adminId !== expectedId || adminPass !== expectedPass) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (!startDate || !endDate) {
      return NextResponse.json({ error: "Missing start/end date." }, { status: 400 });
    }

    // 2. Fetch enrollments from database
    const supabase = getSupabaseAdmin();
    let students: any[] = [];

    if (mode === "individual") {
      if (!studentQuery) {
        return NextResponse.json({ error: "Missing student ID or Email." }, { status: 400 });
      }
      const queryClean = studentQuery.trim();
      
      // Fetch the student regardless of status first to give a better error message
      let query = supabase
        .from("enrollments")
        .select("id, full_name, college_name, course_title, email, status");

      if (/^\d+$/.test(queryClean)) {
        query = query.eq("id", parseInt(queryClean, 10));
      } else {
        query = query.eq("email", queryClean);
      }

      const { data, error: fetchError } = await query;
      if (fetchError) {
        console.error("Enrollment fetch error:", fetchError);
        return NextResponse.json(
          { error: `Database error fetching enrollments: ${fetchError.message}` },
          { status: 500 }
        );
      }
      
      if (!data || data.length === 0) {
        return NextResponse.json(
          { error: `No enrollment found for "${queryClean}". Please check if the ID or Email is correct.` },
          { status: 404 }
        );
      }

      // Filter only PAID students
      students = data.filter(s => s.status?.toUpperCase() === "PAID" || s.status?.toUpperCase() === "SUCCESS");

      if (students.length === 0) {
        const currentStatus = data[0].status || "UNKNOWN";
        return NextResponse.json(
          { error: `Enrollment found for "${queryClean}", but their payment status is "${currentStatus}". Status must be "PAID" to generate a certificate.` },
          { status: 400 }
        );
      }
    } else {
      // Bulk Mode by Course Filter
      let query = supabase
        .from("enrollments")
        .select("id, full_name, college_name, course_title, email")
        .eq("status", "PAID");

      if (courseFilter && courseFilter !== "all") {
        query = query.eq("course_title", courseFilter);
      }

      const { data, error: fetchError } = await query;
      if (fetchError) {
        console.error("Enrollment fetch error:", fetchError);
        return NextResponse.json(
          { error: `Database error fetching enrollments: ${fetchError.message}. Ensure SUPABASE_SERVICE_ROLE_KEY is set.` },
          { status: 500 }
        );
      }
      students = data || [];

      if (students.length === 0) {
        return NextResponse.json(
          { error: "No paid enrollments found for the selected course." },
          { status: 404 }
        );
      }
    }

    // 3. Load template
    const templatePath = path.join(process.cwd(), "public", "certificate-template.png");
    if (!fs.existsSync(templatePath)) {
      return NextResponse.json(
        { error: "Certificate template not found at public/certificate-template.png" },
        { status: 500 }
      );
    }

    // 4. Generate certificates
    const results: any[] = [];

    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      // Pad to 6 digits to match standard Certificate ID lengths nicely
      const paddedId = String(student.id).padStart(6, "0");
      const certNumber = `NLIT-${new Date().getFullYear()}-${paddedId}`;

      try {
        // Check for duplicate certificate before generating
        const { data: existingCert } = await supabase
          .from("certificates")
          .select("id, certificate_number, pdf_url")
          .eq("certificate_number", certNumber)
          .maybeSingle();

        if (existingCert) {
          let emailSent = false;
          if (sendEmail && student.email) {
            emailSent = await sendCertificateEmail(
              student.full_name,
              student.email,
              student.course_title,
              certNumber,
              existingCert.pdf_url
            );
          }
          
          results.push({
            name: student.full_name,
            course: student.course_title,
            college: student.college_name,
            certNumber,
            cloudinaryUrl: existingCert.pdf_url,
            emailSent: emailSent,
            status: "success",
            dbError: "Certificate already exists — skipped regeneration.",
          });
          continue;
        }

        // Generate image with text overlay
        const imageBuffer = await generateCertificateImage(
          templatePath,
          student,
          startDate,
          endDate,
          certNumber
        );

        // Upload to Cloudinary
        const safeName = (student.full_name || "unknown").replace(/\s+/g, "_").toLowerCase();
        const publicId = `cert_${safeName}_${Date.now()}`;
        const cloudinaryUrl = await uploadToCloudinary(imageBuffer, publicId);

        // Insert into certificates table
        const issueDate = new Date().toISOString().split("T")[0];

        const { data: certData, error: certError } = await supabase
          .from("certificates")
          .insert({
            student_name: student.full_name,
            course_name: student.course_title,
            course_title: student.course_title,
            college_name: student.college_name || "NLIT Authorized Center",
            certificate_number: certNumber,
            grade: "A",
            duration: `${startDate} to ${endDate}`,
            pdf_url: cloudinaryUrl,
            issue_date: issueDate,
            issued_date: issueDate,
            user_email: student.email || null,
          })
          .select()
          .single();

        // Send email if requested
        let emailSent = false;
        if (sendEmail && student.email) {
          emailSent = await sendCertificateEmail(
            student.full_name,
            student.email,
            student.course_title,
            certNumber,
            cloudinaryUrl
          );
        }

        if (certError) {
          console.error(`Database insertion failed for ${student.full_name}:`, certError);
          results.push({
            name: student.full_name,
            course: student.course_title,
            college: student.college_name,
            certNumber,
            cloudinaryUrl,
            emailSent,
            status: "success",
            dbError: `DB insert failed: ${certError.message}. Add SUPABASE_SERVICE_ROLE_KEY or run certificates RLS fix SQL.`,
          });
        } else {
          results.push({
            name: student.full_name,
            course: student.course_title,
            college: student.college_name,
            certNumber,
            cloudinaryUrl,
            certId: certData?.id,
            emailSent,
            status: "success",
          });
        }
      } catch (genErr: any) {
        console.error(`Error generating cert for ${student.full_name}:`, genErr);
        results.push({
          name: student.full_name,
          course: student.course_title,
          status: "error",
          error: genErr.message,
        });
      }
    }

    const successCount = results.filter((r) => r.status === "success").length;
    const errorCount = results.filter((r) => r.status === "error").length;
    const dbErrors = results.filter((r) => r.dbError).length;
    const emailsSent = results.filter((r) => r.emailSent).length;
    const emailsFailed = results.filter((r) => r.status === "success" && sendEmail && !r.emailSent).length;

    let message = `Generated ${successCount} certificates. ${errorCount} errors.`;
    if (sendEmail) {
      message += ` 📧 ${emailsSent} emails delivered.`;
      if (emailsFailed > 0) message += ` ⚠️ ${emailsFailed} emails failed to send!`;
    }
    if (dbErrors > 0) {
      message += ` ⚠️ ${dbErrors} DB warnings.`;
    }

    return NextResponse.json({
      success: true,
      message,
      totalStudents: students.length,
      results,
    });
  } catch (error: any) {
    console.error("Certificate generation error:", error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}

// ─── GET: Fetch distinct courses + existing certificates ────────────────────

export async function GET(req: Request) {
  const url = new URL(req.url);
  const adminId = url.searchParams.get("adminId");
  const adminPass = url.searchParams.get("adminPass");

  // Authenticate GET requests
  const expectedId = process.env.CERTIFICATE_ADMIN_ID;
  const expectedPass = process.env.CERTIFICATE_ADMIN_PASS;

  if (!expectedId || !expectedPass || adminId !== expectedId || adminPass !== expectedPass) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const action = url.searchParams.get("action");
  const supabase = getSupabaseAdmin();

  if (action === "courses") {
    // Fetch distinct course titles from paid enrollments
    const { data, error } = await supabase
      .from("enrollments")
      .select("course_title")
      .eq("status", "PAID");

    if (error) {
      return NextResponse.json({ error: `Failed to fetch courses: ${error.message}` }, { status: 500 });
    }

    const uniqueCourses = [...new Set((data || []).map((d: any) => d.course_title).filter(Boolean))];
    return NextResponse.json({ courses: uniqueCourses });
  }

  if (action === "certificates") {
    // Fetch all issued certificates
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      return NextResponse.json({ error: `Failed to fetch certificates: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ certificates: data || [] });
  }

  if (action === "enrollments") {
    // Fetch paid enrollments preview
    const courseFilter = url.searchParams.get("course");
    let query = supabase
      .from("enrollments")
      .select("id, full_name, college_name, course_title, email, created_at")
      .eq("status", "PAID")
      .order("created_at", { ascending: false });

    if (courseFilter && courseFilter !== "all") {
      query = query.eq("course_title", courseFilter);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: `Failed to fetch enrollments: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ enrollments: data || [] });
  }

  return NextResponse.json({ error: "Invalid action parameter" }, { status: 400 });
}
