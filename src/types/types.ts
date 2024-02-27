import { chapters, courses, faqs, quizzes, users } from "../lib/db/schema";

export type User = typeof users.$inferSelect;

export type Course = typeof courses.$inferSelect & { chapters?: Chapter[] };
export type Chapter = typeof chapters.$inferSelect & { course: Course | null };
export type Quiz = typeof quizzes.$inferSelect;
export type FAQ = typeof faqs.$inferSelect;
