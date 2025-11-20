import { ArrowLeft, Loader2Icon, User } from "lucide-react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { user, account } from "../../drizzle/schemas/auth-schema";
import { ProfileUpdateForm } from "./_components/profile-update-form";
import { Suspense } from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { SetPasswordButton } from "./_components/set-password-button";
import { ChangePasswordForm } from "./_components/change-password-form";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session === null) return redirect("auth/login");

  return (
    <div className="max-w-4xl mx-auto my-6 px-4">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center mb-6">
          <ArrowLeft className="size-4 mr-2" />
          Back to Home
        </Link>
        <div className="flex items-center space-x-4">
          <div className="size-16 bg-muted rounded-full flex items-center justify-center overflow-hidden">
            {session.user.image ? (
              <Image
                width={64}
                height={64}
                src={session.user.image}
                alt="User Avatar"
                className="object-cover"
              />
            ) : (
              <User className="size-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex gap-1 justify-between items-start">
              <h1 className="text-3xl font-bold">
                {session.user.name || "User Profile"}
              </h1>
              {/* <Badge>{session.user.role}</Badge> */}
            </div>
            <p className="text-muted-foreground">{session.user.email}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-2">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">
            <User />
            <span className="max-sm-hidden">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security">
            <User />
            <span className="max-sm-hidden">Security</span>
          </TabsTrigger>
          <TabsTrigger value="session">
            <User />
            <span className="max-sm-hidden">Session</span>
          </TabsTrigger>
          <TabsTrigger value="accounts">
            <User />
            <span className="max-sm-hidden">Accounts</span>
          </TabsTrigger>
          <TabsTrigger value="danger">
            <User />
            <span className="max-sm-hidden">Danger</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardContent>
              <ProfileUpdateForm user={session.user} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <Suspense fallback={<Loader2Icon className="size-20 animate-spin" />}>
            <SecurityTab email={session.user.email} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

async function SecurityTab({ email }: { email: string }) {
  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });
  const hasPasswordAccount = accounts.some(
    (acc) => acc.providerId === "credential"
  );

  return (
    <div className="space-y-6">
      {hasPasswordAccount ? (
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password for improved security.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Set Password</CardTitle>
            <CardDescription>
              We will send you a password reset email to set up a password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SetPasswordButton email={email} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
