"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { SignUpTab } from "./_components/sign-up-tab";
import { SignInTab } from "./_components/sign-in-tab";
import { SocialAuthButtons } from "./_components/social_auth_buttons";
import { EmailVerification } from "./_components/email-verification";
import { set } from "zod";

type Tab = "signin" | "signup" | "email-verification";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [selectedTab, setSelectedTab] = useState<Tab>("signin");

  function openEmailVerificationTab (email: string) {
    setEmail(email);
    setSelectedTab("email-verification");
  }

  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data !== null) {
        router.push("/");
      }
    });
  }, []);

  return (
    <Tabs
      value={selectedTab}
      onValueChange={(t) => setSelectedTab(t as Tab)}
      className="w-full max-w-96 mx-auto my-6 px-4"
    >
      {["signin", "signup"].includes(selectedTab) && (
        <TabsList>
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
      )}
      <TabsContent value="signin">
        <Card>
          <CardContent>
            <SignInTab openEmailVerificationTab={openEmailVerificationTab} />
          </CardContent>
          <Separator />
          <CardFooter className="grid grid-cols-2 gap-3">
            <SocialAuthButtons />
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="signup">
        <Card>
          <CardContent>
            <SignUpTab openEmailVerificationTab={openEmailVerificationTab} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="email-verification">
        <Card>
          <CardHeader>
            <CardTitle>Verify Your Email</CardTitle>
          </CardHeader>
          <CardContent>
            <EmailVerification email={email} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
