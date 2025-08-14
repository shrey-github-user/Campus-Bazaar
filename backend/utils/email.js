// backend/utils/email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'test@example.com',
    pass: process.env.EMAIL_PASS || 'password'
  }
});

// Send verification email
exports.sendVerificationEmail = async (to, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify/${token}`;

  const message = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Verify Your Email - Notes Platform',
    html: `<p>Click the link below to verify your email:</p>
           <p><a href="${verifyUrl}">${verifyUrl}</a></p>`
  };

  try {
    await transporter.sendMail(message);
    console.log(`✅ Verification email sent to ${to}: ${verifyUrl}`);
  } catch (err) {
    console.error('❌ Error sending verification email:', err);
  }
};

// Send password reset email
exports.sendPasswordResetEmail = async (to, token) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${token}`;

  const message = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Reset Your Password - Notes Platform',
    html: `<p>Click the link below to reset your password:</p>
           <p><a href="${resetUrl}">${resetUrl}</a></p>`
  };

  try {
    await transporter.sendMail(message);
    console.log(`✅ Password reset email sent to ${to}: ${resetUrl}`);
  } catch (err) {
    console.error('❌ Error sending password reset email:', err);
  }
};
