"use server";

import { Resend } from 'resend';
import { canSendEmails } from '../utils';

type SendEmailProps = {
  to: string;
  subject: string;
  html: string;
}

const resend = canSendEmails() && new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }: SendEmailProps){
  if(resend) {
    await resend.emails.send({
      from: process.env.RESEND_SENDER!,
      to,
      subject,
      html
    })
  }
}