import { sendEmail } from "./send-email";

export async function sendVerificationEmail({ user, url }: { user: { email: string, name: string }; url: string  }) {
  await sendEmail({
    to: user.email,
    subject: "Verify Your Email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Verify Your Email</h2>
        <p>Hello ${user.name},</p>
        <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
        <a href="${url}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin:16px 0;">Verify Email</a>
        <p>If you did not sign up for this account, please ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards, <br>Your Auth App Team</p>
      </div>
    `,
  });
}