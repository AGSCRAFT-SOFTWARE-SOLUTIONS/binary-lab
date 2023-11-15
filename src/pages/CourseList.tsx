import { CourseCard } from "../components/CourseCard";
import { db } from "../lib/db/drizzle";

const courses = await db.query.courses.findMany();
console.log(courses);

export const CourseList = () => (
  <section>
    <h1 class="font-bold">Courses</h1>
    <section class="course-grid">
      {courses.map((course) => (
        <CourseCard course={course} />
      ))}
    </section>
  </section>
);
