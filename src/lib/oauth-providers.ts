import { GitHubIcon, GoogleIcon } from "@/components/auth/icons";
import { ComponentProps, ElementType } from "react";

export const OAUTH_PROVIDERS = ["google", "github"] as const;
export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];

export const OAUTH_PROVIDER_DETAILS: Record<OAuthProvider, { name: string; Icon: ElementType<ComponentProps<"svg">>}> = {
  google: {
    name: "Google",
    Icon: GoogleIcon
  },
  github: {
    name: "GitHub",
    Icon: GitHubIcon
  }
}