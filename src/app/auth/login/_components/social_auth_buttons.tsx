"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { OAUTH_PROVIDERS, OAUTH_PROVIDER_DETAILS } from "@/lib/oauth-providers";
import { is } from "drizzle-orm";
import { Loader } from "lucide-react";

export function SocialAuthButtons() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSignIn = async (provider: string) => {
    setIsLoading(provider);
    try {
      await authClient.signIn.social({ provider, callbackURL: "/" });
    } finally {
      setIsLoading(provider);
    }
  };
  
  return (
    <>
      {OAUTH_PROVIDERS.map((provider) => {
        const Icon = OAUTH_PROVIDER_DETAILS[provider].Icon;

        return (
            <Button
            variant="outline"
            key={provider}
            className=""
            onClick={() => handleSignIn(provider)}
            disabled={isLoading === provider}
            >
            {isLoading === provider && <Loader className="spinner" />}
            {isLoading !== provider && (
              <>
              <Icon />
              {OAUTH_PROVIDER_DETAILS[provider].name}
              </>
            )}
            </Button>
        );
      })}
    </>
  );
}
