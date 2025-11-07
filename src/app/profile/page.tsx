import { ArrowLeft, User } from "lucide-react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";

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
    </div>
  );
}
