"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { SubmitButton } from "@/components/ui/submit-button";

const forgotPasswordSchema = z.object({
  email: z.email().min(1),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export function ForgotPassword({ openSignIn }: { openSignIn: () => void }) {
  const [isSubmitting, setSubmitting] = useState(false);
  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function handleForgotPassword(data: ForgotPasswordForm) {
    setSubmitting(true);
    await authClient.requestPasswordReset(
      {
        ...data,
        redirectTo: "/auth/reset-password",
      },
      {
        onError: (error) => {
          toast.error(
            error.error.message || "Failed to send password reset email"
          );
        },
        onSuccess: () => {
          toast.success("Reset password email sent");
        },
      }
    );
    setSubmitting(false);
  }

  return (
    <Form {...form}>
      <form
        className="space-y-8"
        onSubmit={form.handleSubmit(handleForgotPassword)}
      >
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button variant="outline" onClick={openSignIn}>
            Back
          </Button>
          <SubmitButton isSubmitting={isSubmitting}>Send Reset Email</SubmitButton>
        </div>
      </form>
    </Form>
  );
}
