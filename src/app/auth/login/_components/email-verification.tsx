"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { AuthActionButton } from "@/components/auth/auth-action-button";

export function EmailVerification({ email }: { email: string }) {
  const [timeToNextReset, setTimeToNextReset] = useState(30);
  const interval = useRef<NodeJS.Timeout>(undefined);

  function emailVerificationCountdown(time = 30) {
    setTimeToNextReset(time);

    interval.current = setInterval(() => {
      setTimeToNextReset((t) => {
        if (t <= 1) {
          clearInterval(interval.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  function resendEmail() {
    emailVerificationCountdown();
    return authClient.sendVerificationEmail({ email, callbackURL: "/" });
  }

  useEffect(() => {
    emailVerificationCountdown();

    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        A verification email has been sent to <strong>{email}</strong>. Please
        check your inbox and click on the verification link to continue.
      </p>
      <AuthActionButton
        variant="outline"
        className="w-full"
        action={resendEmail}
        disabled={timeToNextReset > 0}
      >
        Resend Email {timeToNextReset > 0 ? `(${timeToNextReset}s)` : ""}
      </AuthActionButton>
    </div>
  );
}
