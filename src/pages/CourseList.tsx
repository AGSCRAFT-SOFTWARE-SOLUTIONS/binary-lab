import { CourseCard } from "../components/CourseCard";

export const CourseList = () => (
  <section class="max-w-100rem m-a py-6rem px-[min(7vw,4rem)]">
    <h1 class="font-bold">Courses</h1>
    <section class="grid grid-cols-[repeat(auto-fit,minmax(21rem,1fr))] gap-6">
      <CourseCard course="golang" />
      <CourseCard course="golang" />
      <CourseCard course="golang" />
      <CourseCard course="golang" />
      <CourseCard course="golang" />
      <CourseCard course="golang" />
      <CourseCard course="golang" />
      <CourseCard course="golang" />
      <CourseCard course="golang" />
      <CourseCard course="golang" />
    </section>
  </section>
);
