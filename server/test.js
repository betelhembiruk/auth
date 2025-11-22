import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function sendTestEmail() {
  try {
    const info = await transporter.sendMail({
      from: process.env.SENDER_EMAIL,             // must be verified
      to: "betelhembiruk8@gmail.com",             // recipient
      subject: "Test OTP Email",
      text: "Hello! This is a test email sent using Brevo SMTP.",
    });

    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);
  } catch (err) {
    console.error("❌ Error sending test email:");
    console.error(err);
  }
}

sendTestEmail();
