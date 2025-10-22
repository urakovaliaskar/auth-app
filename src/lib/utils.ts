import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function canSendEmails() {
  return !!process.env.RESEND_API_KEY && !!process.env.RESEND_SENDER;
}