import CourseCard from "../components/CourseCard";
import { db } from "../lib/db/drizzle";

let courses;
export default async () => (
  <section>
    <h1 class="font-bold">Courses</h1>
    <section class="course-grid">
      {(courses = await db.query.courses.findMany()) && ""}
      {courses.length > 0
        ? courses.map((course) => <CourseCard course={course} />)
        : "No courses have been added 😶"}
    </section>
  </section>
);
