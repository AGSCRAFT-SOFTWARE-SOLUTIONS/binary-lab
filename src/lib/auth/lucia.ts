import { lucia } from "lucia";
import { elysia } from "lucia/middleware";
import { pg as postgresAdapter } from "@lucia-auth/adapter-postgresql";
import postgres from "pg";
// import { postgres as postgresAdapter } from "@lucia-auth/adapter-postgresql";
// import postgres from "postgres";
import { github, google } from "@lucia-auth/oauth/providers";

// const pool = postgres(Bun.env.pgConnectionString!);
const pool = new postgres.Pool({ connectionString: Bun.env.DB_URI! });

export const auth = lucia({
  env: "DEV", // "PROD" if deployed to HTTPS
  middleware: elysia(),
  adapter: postgresAdapter(pool, {
    user: "users",
    key: "credentials",
    session: "sessions",
  }),
  getUserAttributes: (data) => {
    return {
      ...data,
    };
  },
});

export const githubAuth = github(auth, {
  clientId: "917c53ad73b59a2e5d43",
  clientSecret: "ffcb5de76b2081b4e758cf8f6120440b4c853c9f",
});

export const googleAuth = google(auth, {
  clientId:
    "343829400427-8s3eh6km5hdht9spdpcqllkju31632ps.apps.googleusercontent.com",
  clientSecret: "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",
  redirectUri: "http://localhost:3000/auth/sign-in/google/callback",
});

export type Auth = typeof auth;
