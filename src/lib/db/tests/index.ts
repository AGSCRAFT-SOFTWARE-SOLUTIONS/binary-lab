import { db } from "../drizzle";

const course = await db.query.courses.findFirst({ with: { chapters: true } });
// console.log(course);
