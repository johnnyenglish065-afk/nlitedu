import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { audience, subject, message } = await request.json();

    if (!subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Initialize Supabase with Service Role Key to bypass RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log('--- Email Blast Debug ---');
    console.log('Audience:', audience);
    console.log('Supabase URL present:', !!supabaseUrl);
    console.log('Supabase Key type:', supabaseKey === process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'ANON' : 'SECRET/SERVICE');

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase configuration missing on server' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // Determine target emails based on audience
    let emails: string[] = [];

    if (audience === 'ALL_REGISTERED') {
      const { data, error: dbError } = await supabaseAdmin.from('profiles').select('email');
      if (dbError) {
        console.error('Database Error (Profiles):', dbError);
        return NextResponse.json({ error: `DB Error: ${dbError.message}` }, { status: 500 });
      }
      emails = Array.from(new Set(data?.map(p => p.email).filter(Boolean) as string[]));
    } else {
      let query = supabaseAdmin.from('enrollments').select('email');
      
      if (audience !== 'ALL') {
        query = query.eq('course_slug', audience);
      }

      const { data: students, error: dbError } = await query;

      if (dbError) {
        console.error('Database Error (Enrollments):', dbError);
        return NextResponse.json({ error: `DB Error: ${dbError.message}` }, { status: 500 });
      }

      console.log(`Query returned ${students?.length || 0} students`);

      if (!students || students.length === 0) {
        return NextResponse.json({ 
          error: 'No enrolled students found for this audience',
          debug: { audience, count: students?.length, keyType: supabaseKey === process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'ANON' : 'SECRET' }
        }, { status: 404 });
      }

      // Extract unique emails
      emails = Array.from(new Set(students.map(s => s.email).filter(Boolean) as string[]));
    }

    console.log(`Unique emails identified: ${emails.length}`);

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

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, count: emails.length });
  } catch (error: any) {
    console.error('Email API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
