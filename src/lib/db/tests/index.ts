import { eq } from "drizzle-orm";
import { db } from "../drizzle";
import { courses } from "../schema";

const coursesList = await db
  .update(courses)
  .set({ tags: ["test3", "test4"] })
  .where(eq(courses.title, "golang"))
  .returning();

console.log("courses:", coursesList);
