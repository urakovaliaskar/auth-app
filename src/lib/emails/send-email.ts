"use server";

import { Resend } from 'resend';

type SendEmailProps = {
  to: string;
  subject: string;
  html: string;
}

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendEmail({ to, subject, html }: SendEmailProps): Promise<void> {
  await resend.emails.send({
    from: process.env.RESEND_SENDER!,
    to,
    subject,
    html
  })
}