import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { audience, subject, message } = await request.json();

    if (!subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Initialize Supabase with Service Role Key to bypass RLS for administrative email blast
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Determine target emails based on audience
    let emails: string[] = [];

    if (audience === 'ALL_REGISTERED') {
      const { data, error: dbError } = await supabaseAdmin.from('profiles').select('email');
      if (dbError) {
        console.error('Supabase Error:', dbError);
        return NextResponse.json({ error: 'Database error fetching profiles' }, { status: 500 });
      }
      if (!data || data.length === 0) {
        return NextResponse.json({ error: 'No registered users found' }, { status: 404 });
      }
      emails = Array.from(new Set(data.map(p => p.email)));
    } else {
      let query = supabaseAdmin.from('enrollments').select('email');
      
      if (audience !== 'ALL') {
        query = query.eq('course_slug', audience);
      }

      const { data: students, error: dbError } = await query;

      if (dbError) {
        console.error('Supabase Error:', dbError);
        return NextResponse.json({ error: 'Database error fetching enrollments' }, { status: 500 });
      }

      if (!students || students.length === 0) {
        // Log more info for debugging
        console.warn(`No students found for audience: ${audience}`);
        return NextResponse.json({ error: 'No enrolled students found for this audience' }, { status: 404 });
      }

      // Extract unique emails
      emails = Array.from(new Set(students.map(s => s.email)));
    }

    // Setup Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtpout.secureserver.net',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send emails
    const mailOptions = {
      from: `"NLITedu Admin" <${process.env.SMTP_USER}>`,
      to: emails, // Sending as BCC technically if we use BCC, but passing an array to `to` sends to all
      // Actually, better to BCC so students don't see each other's emails
      bcc: emails,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #0ea5e9; margin: 0;">NLITedu Update</h2>
          </div>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
            ${message}
          </div>
          <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #64748b;">
            <p>This is an automated message from NLITedu.</p>
            <p>Please do not reply to this email.</p>
          </div>
        </div>
      `,
    };

    // Remove `to` to prevent exposing all emails if provider doesn't handle array well in BCC
    delete mailOptions.to;

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, count: emails.length });
  } catch (error: any) {
    console.error('Email API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
