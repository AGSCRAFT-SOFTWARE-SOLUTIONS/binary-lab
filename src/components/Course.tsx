import ChapterList from "./ChaptersList";
import { Course as TCourse } from "../types/types";

export default ({
  course,
  children,
}: {
  course: TCourse;
  children: JSX.Element;
}) => (
  <>
    <section class="lg:flex flex-row-reverse gap-4">
      {children}
      <br />
      <br />
      <ChapterList course={course} />
      <script
        type="module"
        src="https://cdn.jsdelivr.net/gh/zerodevx/zero-md@2/dist/zero-md.min.js"
      ></script>
    </section>
    <link rel="stylesheet" href="/public/stylesheets/course.css" />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/gh/PrismJS/prism@1.29.0/themes/prism-tomorrow.css"
    />
  </>
);
