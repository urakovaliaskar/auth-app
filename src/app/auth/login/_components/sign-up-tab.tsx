"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import z from "zod";
import { Loader } from "lucide-react";
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
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useEmailConfig } from "@/hooks/useEmailConfig";

const signUpSchema = z.object({
  name: z.string().min(1),
  email: z.email().min(1),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
});

type SignUpForm = z.infer<typeof signUpSchema>;

export function SignUpTab({
  openEmailVerificationTab,
}: {
  openEmailVerificationTab: (email: string) => void;
}) {
  const router = useRouter();
  const isEmailConfigured = useEmailConfig();
  const [isSubmitting, setSubmitting] = useState(false);
  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function handleSignUp(data: SignUpForm) {
    setSubmitting(true);
    const res = await authClient.signUp.email(
      {
        ...data,
        callbackURL: "/",
      },
      {
        onError: (error) => {
          toast.error(
            error.error.message || "Something went wrong during sign up."
          );
        },
      }
    );

    if (
      res.error === null &&
      !res.data.user.emailVerified &&
      isEmailConfigured
    ) {
      openEmailVerificationTab(data.email);
    } else if (res.error === null && !isEmailConfigured) {
      router.push("/");
    }
    setSubmitting(false);
  }

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(handleSignUp)}>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader className="spinner" />}
          {!isSubmitting && "Sign Up"}
        </Button>
      </form>
    </Form>
  );
}
