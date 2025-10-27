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

const signInSchema = z.object({
  email: z.email().min(1),
  password: z.string().min(1),
});

type SignInForm = z.infer<typeof signInSchema>;

export function SignInTab({
  openEmailVerificationTab,
}: {
  openEmailVerificationTab: (email: string) => void;
}) {
  const [isSubmitting, setSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSignIn(data: SignInForm) {
    setSubmitting(true);
    await authClient.signIn.email(
      {
        ...data,
        callbackURL: "/",
      },
      {
        onError: (error) => {
          if(error.error?.code === "EMAIL_NOT_VERIFIED") {
            openEmailVerificationTab(data.email);
          }
          toast.error(
            error.error.message || "Something went wrong during sign in."
          );
        },
        onSuccess: () => {
          router.push("/");
        },
      }
    );
    setSubmitting(false);
  }

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(handleSignIn)}>
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
          {!isSubmitting && "Sign In"}
        </Button>
      </form>
    </Form>
  );
}
