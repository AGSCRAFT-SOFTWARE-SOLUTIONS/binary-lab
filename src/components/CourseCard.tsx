export const CourseCard = ({ course }: { course: string }) => (
  <a
    title={course}
    class="grid gap-4 rd-xl overflow-hidden glow cursor-pointer"
    href={`/courses/${course}`}
    hx-boost="true"
    hx-target="#swap-container"
  >
    <img
      src={`public/assets/courses-posters/${course}.jpg`}
      alt={`${course} poster`}
      class="aspect-ratio-video object-cover w-full"
    />
    <div class="p-4">
      <div class="flex justify-between">
        <div class="grid gap-1">
          <h4 class="text-2xl font-bold">{course}</h4>
          <p class="text-sm">Tamil</p>
        </div>
        <p> &#8377;499</p>
      </div>
      <br />
      <div class="flex flex-wrap gap-2">
        <span class="bg-#04A9D3 rd px-2 py-1">#go</span>
        <span class="bg-#04A9D3 rd px-2 py-1">#golang</span>
      </div>
    </div>
  </a>
);
