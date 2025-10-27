import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function EmailVerification({ email }: { email: string }) {
  const [timeToNextReset, setTimeToNextReset] = useState(30)
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
  };

  function resendEmail() {
    authClient
      .sendVerificationEmail({ email, callbackURL: "/" })
      .then(() => {
        toast.success("Verification email sent.");
      })
      .catch((error) => {
        toast.error(
          error.error?.message ||
            "Something went wrong while resending the email."
        );
      });
  };

  useEffect(() => {
    emailVerificationCountdown();
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        A verification email has been sent to <strong>{email}</strong>. Please
        check your inbox and click on the verification link to continue.
      </p>
      <Button variant="outline" className="w-full" onClick={resendEmail} disabled={timeToNextReset > 0}>
        Resend Email {timeToNextReset > 0 ? `(${timeToNextReset}s)` : ""}
      </Button>
    </div>
  );
}
