import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle/db";
import { nextCookies } from "better-auth/next-js";
import { sendPasswordResetEmail } from "./emails/send-password-reset";
import { sendVerificationEmail } from "./emails/send-verification";
import { canSendEmails, canUseGoogleOAuth, canUseGitHubOAuth } from "./utils";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: canSendEmails(),
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({ user, url })
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail({ user, url });
    },
  },
  rateLimit: {
    storage: "database"
  },
  socialProviders: {
        google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
        github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60, // 1 minute
    }
  },
  plugins: [nextCookies()], 
  secret: process.env.BETTER_AUTH_SECRET!,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});