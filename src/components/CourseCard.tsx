import { Course } from "../types/types";

export default ({ course }: { course: Course }) => (
  <a
    title={course?.title}
    class="grid gap-4 rd-xl overflow-hidden glow cursor-pointer"
    href={`/courses/${course.title}`}
  >
    <img
      src={course.thumbnailLink}
      alt={`${course?.title} poster`}
      class="aspect-ratio-video object-cover w-full"
    />
    <div class="p-4">
      <div class="flex justify-between">
        <div class="grid gap-1">
          <h4 class="text-2xl font-bold" safe>
            {course?.title}
          </h4>
          <p class="text-sm">Tamil</p>
        </div>
        <p> &#8377;{course?.price}</p>
      </div>
      <br />
      <div class="flex flex-wrap gap-2">
        {course.tags.map((tag) => (
          <span class="bg-#04A9D3 rd px-2 py-1">#{tag}</span>
        ))}
      </div>
    </div>
  </a>
);
