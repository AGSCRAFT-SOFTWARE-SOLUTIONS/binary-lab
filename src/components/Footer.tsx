import { db } from "../lib/db/drizzle";

const courses = await db.query.courses.findMany({ columns: { title: true } });
export default () => (
  <footer class="bg-secondary grid place-items-center py-10">
    <div class="w-[clamp(22rem,90vw,104rem)] grid gap-8 lg:grid-cols-[2fr_1fr]">
      <div>
        <h3 class="uppercase font-bold text-5">AGScraft software solutions</h3>
        <p class="line-height-tight">
          At AGSCRAFT, we specialize in turning your digital dreams into
          reality. Whether you need a stunning website, a powerful mobile app,
          or both, our team of expert developers and designers is here to make
          it happen! 🎉
        </p>
        <br />
        <a aria-label="agscraft23@gmail.com" href="mailto:agscraft23@gmail.com">
          agscraft23@gmail.com
        </a>
        <br />
        <a aria-label="+91 90255 49976" href="tel:+91 90255 49976">
          +91 90255 49976{" "}
        </a>{" "}
        |
        <a aria-label="+91 93444 97320" href="tel:+91 93444 97320">
          {" "}
          +91 93444 97320
        </a>
      </div>
      <div class="grid grid-cols-3">
        <div>
          <h6>Quick links</h6>
          <p class="line-height-tight pl-2">
            <a aria-label="home" href="" class="hover:color-text">
              Home
            </a>
            <br />
            <a aria-label="courses" href="" class="hover:color-text">
              Courses
            </a>
            <br />
            <a aria-label="quiz" href="" class="hover:color-text">
              Quiz
            </a>
            <br />
            <a aria-label="playground" href="" class="hover:color-text">
              Playground
            </a>
            <br />
            <a aria-label="faq" href="/faq" class="hover:color-text">
              FAQ
            </a>
          </p>
        </div>
        <div>
          <h6>Courses</h6>
          <p class="line-height-tight pl-2 ">
            {courses.map((course) => (
              <>
                <a
                  aria-label={course.title}
                  href={`courses/${course.title}`}
                  class="hover:color-text"
                >
                  {course.title}
                </a>

                <br />
              </>
            ))}
          </p>
        </div>
        <script
          src="https://kit.fontawesome.com/7ae938555b.js"
          crossorigin="anonymous"
        ></script>
        <div>
          <h6>Follow Us</h6>
          <div class="flex gap-2">
            <a aria-label="linkedin" href="">
              <i class="fa-brands fa-linkedin-in"></i>
            </a>
            <a aria-label="instagram" href="">
              <i class="fa-brands fa-instagram"></i>
            </a>
            <a aria-label="twitter" href="">
              <i class="fa-brands fa-x-twitter"></i>
            </a>
            <a aria-label="facebook" href="">
              <i class="fa-brands fa-facebook-f"></i>
            </a>
            <a aria-label="youtuvbe" href="">
              <i class="fa-brands fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);
