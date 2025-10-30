import { sendEmail } from "./send-email";

export async function sendWelcomeEmail( user: { email: string, name: string }) {
  await sendEmail({
    to: user.email,
    subject: "Welcome to Auth App",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2c3e50; margin-bottom: 10px;">Welcome to Auth App, ${user.name}!</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          We're thrilled to have you on board. Thank you for signing up for Auth App! 
          You're now part of a community that values security, simplicity, and seamless authentication.
        </p>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          To get started, make sure to complete your profile and explore the features available to you.
        </p>
        <p style="margin-top: 30px; color: #555; font-size: 16px; line-height: 1.6;">
          Best regards,<br/>
          <strong>Your Auth App Team</strong>
        </p>
      </div>
    `,
  });
}