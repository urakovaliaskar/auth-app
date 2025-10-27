import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const EMAIL_ENABLED = !!process.env.RESEND_API_KEY && !!process.env.RESEND_SENDER;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function canSendEmails() {
  return EMAIL_ENABLED
}