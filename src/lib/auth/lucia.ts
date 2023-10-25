import { lucia } from "lucia";
import { elysia } from "lucia/middleware";
import { pg } from "@lucia-auth/adapter-postgresql";
import postgres from "pg";
import { github } from "@lucia-auth/oauth/providers";

const pool = new postgres.Pool({
  connectionString: "postgresql://postgres:0000@localhost:5432/testdb",
});

export const auth = lucia({
  env: "DEV", // "PROD" if deployed to HTTPS
  middleware: elysia(),
  adapter: pg(pool, {
    user: "auth_user",
    key: "user_key",
    session: "user_session",
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

export type Auth = typeof auth;
