import { Chapter } from "../types/types";

export default ({ chapter, index }: { chapter: Chapter; index?: number }) => (
  <a
    href={`/courses/${chapter.course?.title}/${chapter.title}`}
    hx-boost="true"
    hx-target="#chapterDisplay"
    hx-swap="outerHTML"
    class={`chapterCard cursor-pointer rd-xl h-[min-content] scale-95 op-50 hover:scale-100 hover:op-100 glow `}
    id={`chapter` + chapter.id.replaceAll("-", "")}
    data-status={index == 0 ? `active` : ``}
  >
    <img
      src={`/public/assets/courses-posters/golang.jpg`}
      alt={`chapeter poster`}
      class="aspect-ratio-video object-cover w-full rd-md"
    />
    <h4 class="text-left m-2">{chapter.title}</h4>
  </a>
);
