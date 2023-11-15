import { courses, users } from "../lib/db/schema";

export type User = typeof users.$inferSelect;

export type Course = typeof courses.$inferSelect;
