const nodemailer = require("nodemailer");

async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 465,
    secure: true,
    auth: {
      user: "info@nlitedu.com",
      pass: "Nlitedu@Admin2026",
    },
  });

  try {
    await transporter.verify();
    console.log("SMTP Credentials are VALID!");
    
    await transporter.sendMail({
      from: '"NLITedu" <info@nlitedu.com>',
      to: "info@nlitedu.com",
      subject: "Test Email from Vercel SMTP",
      text: "If you get this, the email works!",
    });
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("SMTP Error:", error);
  }
}

testEmail();
