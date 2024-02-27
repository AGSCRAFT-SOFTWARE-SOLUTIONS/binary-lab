import { Course } from "../types/types";
import ChapterCard from "./ChapterCard";

export default ({ course }: { course: Course }) => (
  <>
    <aside class="lg:pr-8 b-solid max-w-20rem ">
      <h3 class="font-bold capitalize m-b-1rem">{course.title}</h3>
      <div
        id="chapterCardsContainer"
        class="lg:h-[calc(90vh-6rem)] p-r-1rem grid place-content-start gap-2"
      >
        {course.chapters?.map((chapter, i) => (
          <ChapterCard chapter={chapter} index={i} />
        ))}
      </div>
    </aside>
  </>
);
