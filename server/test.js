// test.js
import 'dotenv/config'; // Load .env variables
import nodemailer from 'nodemailer';

// Verify environment variables are loaded
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? '*****' : undefined);
console.log('SENDER_EMAIL:', process.env.SENDER_EMAIL);

// Create transporter for Brevo SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // STARTTLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

// Send test email
transporter.sendMail({
    from: process.env.SENDER_EMAIL,             // sender email (verified in Brevo)
    to: 'betelhembiruk11@gmail.com',            // recipient email
    subject: 'Test Email from Brevo SMTP',
    text: 'Hello Betelhem! This is a test email from Node.js using Brevo SMTP.',
}, (err, info) => {
    if (err) {
        console.error('Error sending email:', err);
    } else {
        console.log('Email sent successfully:', info.response);
    }
});
