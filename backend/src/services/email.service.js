const nodemailer = require('nodemailer');

// Create a transporter using environment variables
const createTransporter = () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️ SMTP credentials not found in env. Email forwarding is disabled.');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendEmail = async (options) => {
  const transporter = createTransporter();
  if (!transporter) return false;

  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME || 'Portfolio Contact'}" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_TO_EMAIL || 'akhils88815@gmail.com',
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✉️ Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return false;
  }
};

const sendContactInquiryEmail = async (inquiry) => {
  const subject = `New Portfolio Inquiry: ${inquiry.subject}`;
  const text = `
You have received a new message from your portfolio contact form:

Name: ${inquiry.name}
Email: ${inquiry.email}
Subject: ${inquiry.subject}

Message:
${inquiry.message}
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
      <h2 style="color: #0077ff; margin-top: 0; font-size: 20px;">New Portfolio Inquiry</h2>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
      <p style="margin: 8px 0; font-size: 14px;"><strong>Name:</strong> ${inquiry.name}</p>
      <p style="margin: 8px 0; font-size: 14px;"><strong>Email:</strong> <a href="mailto:${inquiry.email}" style="color: #0077ff; text-decoration: none;">${inquiry.email}</a></p>
      <p style="margin: 8px 0; font-size: 14px;"><strong>Subject:</strong> ${inquiry.subject}</p>
      <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 16px;">
        <p style="margin: 0; white-space: pre-wrap; line-height: 1.6; font-size: 14px; color: #334155;">${inquiry.message}</p>
      </div>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 11px; color: #64748b; margin-bottom: 0; text-align: center;">This email was sent automatically from your Portfolio Backend.</p>
    </div>
  `;

  return sendEmail({ subject, text, html });
};

module.exports = {
  sendEmail,
  sendContactInquiryEmail,
};
