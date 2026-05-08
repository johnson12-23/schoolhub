import crypto from "crypto";

// In-memory store for password reset tokens
// In production, use a database or Redis
const resetTokens = new Map();

// Token expiry time: 1 hour
const TOKEN_EXPIRY_MS = 60 * 60 * 1000;

export function generateResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function storeResetToken(email, token) {
  resetTokens.set(token, {
    email,
    expiresAt: Date.now() + TOKEN_EXPIRY_MS
  });
}

export function verifyResetToken(token) {
  const record = resetTokens.get(token);

  if (!record) {
    return null;
  }

  if (Date.now() > record.expiresAt) {
    resetTokens.delete(token);
    return null;
  }

  return record.email;
}

export function consumeResetToken(token) {
  resetTokens.delete(token);
}

import sgMail from "@sendgrid/mail";

// Set SendGrid API key if available
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Email service (logs to console in development, sends real emails in production)
export async function sendPasswordResetEmail(email, resetToken) {
  const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${resetToken}`;

  const message = `
Hi,

You requested a password reset for your SchoolHub account.

Click the link below to reset your password:
${resetLink}

This link will expire in 1 hour.

If you didn't request this, please ignore this email.

Best regards,
SchoolHub Team
  `;

  // Check if SendGrid is configured
  if (process.env.SENDGRID_API_KEY && process.env.FROM_EMAIL) {
    try {
      const msg = {
        to: email,
        from: process.env.FROM_EMAIL,
        subject: "Password Reset Request - SchoolHub",
        text: message,
        html: message.replace(/\n/g, "<br>")
      };

      await sgMail.send(msg);
      console.log(`✅ Password reset email sent to ${email}`);
      return true;
    } catch (error) {
      console.error("❌ Failed to send email via SendGrid:", error.message);
      // Fall back to console logging
    }
  }

  // Fallback: log to console (development mode)
  console.log("=== PASSWORD RESET EMAIL ===");
  console.log(`To: ${email}`);
  console.log(`Subject: Password Reset Request - SchoolHub`);
  console.log(message);
  console.log("===========================\n");

  // For local testing, also log the reset link directly
  console.log(`🔗 RESET LINK FOR TESTING: ${resetLink}\n`);

  return true;
}
