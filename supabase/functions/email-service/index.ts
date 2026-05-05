import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import nodemailer from "npm:nodemailer";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { studentName, studentEmail, courseTitle, orderId } = await req.json();

    if (!studentName || !studentEmail || !courseTitle || !orderId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch full enrollment details from Supabase to include in the email
    let enrollmentDetails = "";
    let paymentDetails = "";
    
    if (supabaseUrl && supabaseKey) {
      const { data: enrollment, error } = await supabase
        .from("enrollments")
        .select("*")
        .eq("cf_payment_id", orderId)
        .single();

      if (!error && enrollment) {
        enrollmentDetails = `
          <h3>Student Details</h3>
          <p><strong>Name:</strong> ${enrollment.full_name}</p>
          <p><strong>Email:</strong> ${enrollment.email}</p>
          <p><strong>WhatsApp:</strong> ${enrollment.whatsapp || 'N/A'}</p>
          <p><strong>Gender:</strong> ${enrollment.gender || 'N/A'}</p>
          <p><strong>Date of Birth:</strong> ${enrollment.dob || 'N/A'}</p>
          <p><strong>Father's Name:</strong> ${enrollment.father_name || 'N/A'}</p>
          <p><strong>State:</strong> ${enrollment.state || 'N/A'}</p>
          
          <h3>Academic Details</h3>
          <p><strong>Qualification:</strong> ${enrollment.qualification || 'N/A'}</p>
          <p><strong>College Name:</strong> ${enrollment.college_name || 'N/A'}</p>
          <p><strong>Branch:</strong> ${enrollment.branch || 'N/A'}</p>
          <p><strong>Semester:</strong> ${enrollment.semester || 'N/A'}</p>
          <p><strong>College Type:</strong> ${enrollment.college_type === 'govt' ? 'Government' : 'Private'}</p>
        `;

        paymentDetails = `
          <h3>Payment Details</h3>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Payment Status:</strong> <span style="color: green; font-weight: bold;">${enrollment.status}</span></p>
          <p><strong>Amount Paid:</strong> ₹${enrollment.payment_amount || 'N/A'} ${enrollment.payment_currency || ''}</p>
          <p><strong>Payment Method:</strong> ${enrollment.payment_method || 'N/A'}</p>
          <p><strong>Time:</strong> ${enrollment.payment_time || new Date().toLocaleString()}</p>
        `;
      }
    }

    // Use SMTP environment variables
    const host = Deno.env.get("SMTP_HOST") || "smtpout.secureserver.net";
    const port = parseInt(Deno.env.get("SMTP_PORT") || "465");
    const user = Deno.env.get("SMTP_USER") || "info@nlitedu.com";
    const pass = Deno.env.get("SMTP_PASS") || "Nlitedu!Admin2026";

    const transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: port === 465, 
      auth: {
        user: user,
        pass: pass,
      },
    });

    const mailOptions = {
      from: `"NLITedu" <${user}>`,
      to: studentEmail,
      subject: `Enrollment Confirmation - ${courseTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #2563eb; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Welcome to NLITedu!</h1>
          </div>
          <div style="padding: 30px; background-color: #ffffff;">
            <p style="font-size: 16px; color: #334155;">Dear <strong>${studentName}</strong>,</p>
            <p style="font-size: 16px; color: #334155; line-height: 1.5;">
              Thank you for enrolling in <strong>${courseTitle}</strong>. Your enrollment and payment have been successfully processed.
            </p>
            
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            
            ${enrollmentDetails}
            
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            
            ${paymentDetails}

            <div style="margin-top: 30px; padding: 15px; background-color: #f8fafc; border-radius: 6px; border-left: 4px solid #2563eb;">
              <p style="margin: 0; font-size: 14px; color: #475569;">
                <strong>Next Steps:</strong> You will receive further instructions and access details from our team shortly.
              </p>
            </div>
            
            <p style="font-size: 14px; color: #64748b; margin-top: 30px;">
              If you have any questions, please contact our support team at <a href="mailto:info@nlitedu.com" style="color: #2563eb;">info@nlitedu.com</a>.
            </p>
          </div>
          <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
            &copy; ${new Date().getFullYear()} Nexgen Learning Institute of Technology. All rights reserved.
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.messageId);

    // Also send to admin
    const adminEmail = Deno.env.get("ADMIN_EMAIL") || user;
    if (adminEmail) {
      await transporter.sendMail({
        ...mailOptions,
        to: adminEmail,
        subject: `New Enrollment - ${courseTitle} (${studentName})`,
      });
    }

    return new Response(JSON.stringify({ success: true, messageId: info.messageId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Email API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
