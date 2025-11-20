import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle/db";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware } from "better-auth/api";
import { sendPasswordResetEmail } from "./emails/send-password-reset";
import { sendVerificationEmail } from "./emails/send-verification";
import { canSendEmails } from "./utils";
import { sendWelcomeEmail } from "./emails/send-welcome-email";

export const auth = betterAuth({
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, url, newEmail }) => {
        await sendVerificationEmail({ 
          user: { ...user, email: newEmail },
          url 
        });
      },
    }
  },
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
  hooks: {
    after: createAuthMiddleware(async ctx => {
      if(ctx.path.startsWith("/sign-up")) { 
        const user = ctx.context.newSession?.user ?? {
          name: ctx.body.name,
          email: ctx.body.email
        }
        if(user !== null) {
          await sendWelcomeEmail(user)
        }
      }
    })
  }
});