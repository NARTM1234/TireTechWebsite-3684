import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins";
import { db } from "./database";
export const ADMIN_EMAILS = ["abdulrasheednabeeh@gmail.com", "tmarasheed@gmail.com"];
export const auth = betterAuth({
  basePath: "/api/auth",
  baseURL: process.env.WEBSITE_URL,
  database: drizzleAdapter(db, { provider: "sqlite" }),
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: { enabled: true, disableSignUp: true, minPasswordLength: 10 },
  trustedOrigins: [
    process.env.WEBSITE_URL,
    process.env.AUTH_PREVIEW_ORIGIN,
    "http://localhost:4200",
    "http://127.0.0.1:4200",
  ]
    .filter((value): value is string => Boolean(value))
    .map((value) => new URL(value).origin),
  plugins: [bearer()],
  rateLimit: { enabled: true, window: 60, max: 30 },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (!ADMIN_EMAILS.includes(user.email.toLowerCase()))
            throw new Error("Registration is closed");
          return { data: user };
        },
      },
    },
  },
});
