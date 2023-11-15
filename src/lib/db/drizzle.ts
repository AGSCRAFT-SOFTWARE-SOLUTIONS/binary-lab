import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const migrationClient = postgres(Bun.env.DB_URI!, { max: 1 });

const queryCLient = postgres(Bun.env.DB_URI!);
export const db = drizzle(queryCLient, { schema });
