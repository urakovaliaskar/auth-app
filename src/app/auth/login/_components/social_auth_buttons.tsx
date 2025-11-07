"use client";

import { useState } from "react";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { OAUTH_PROVIDERS, OAUTH_PROVIDER_DETAILS } from "@/lib/oauth-providers";

export function SocialAuthButtons() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSignIn = async (provider: string) => {
    setIsLoading(provider);

    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: "/",
    });

    if (error) {
      toast.error(`Error signing in with ${provider}: ${error.message}`);
    }

    setIsLoading(null);
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
