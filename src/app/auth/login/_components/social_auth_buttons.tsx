"use client";

import { authClient } from "@/lib/auth-client";
import { OAUTH_PROVIDERS, OAUTH_PROVIDER_DETAILS } from "@/lib/oauth-providers";
import { AuthActionButton } from "@/components/auth/auth-action-button";

export function SocialAuthButtons() {
  return (
    <>
      {OAUTH_PROVIDERS.map((provider) => {
        const Icon = OAUTH_PROVIDER_DETAILS[provider].Icon;

        return (
          <AuthActionButton
            variant="outline"
            key={provider}
            action={() =>
              authClient.signIn.social({
                provider,
                callbackURL: "/",
              })
            }
          >
            <Icon />
            {OAUTH_PROVIDER_DETAILS[provider].name}
          </AuthActionButton>
        );
      })}
    </>
  );
}
