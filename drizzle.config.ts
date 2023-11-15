import { Config } from "drizzle-kit";

export default {
  schema: "src/lib/db/schema.ts",
  out: "src/lib/db/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DB_URI!,
  },
} satisfies Config;
