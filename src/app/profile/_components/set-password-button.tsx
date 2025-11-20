"use client";

import { AuthActionButton } from "@/components/auth/auth-action-button";
import { authClient } from "@/lib/auth-client";

export function SetPasswordButton({ email }: { email: string }) {
  function handleSetPassword() {
    // Logic to send password reset email
    console.log(`Sending password reset email to ${email}`);
  }
  return (
    <AuthActionButton
      variant="outline"
      className="w-full"
      successMessage="Password reset email sent"
      action={() =>
        authClient.requestPasswordReset({
          email,
          redirectTo: "/auth/reset-password",
        })
      }
    >
      Send Password Reset Email
    </AuthActionButton>
  );
}
