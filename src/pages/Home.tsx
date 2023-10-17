import { CourseList } from "./CourseList";

const floatIconClasses =
  `h-[clamp(3rem,5vw,5rem)] drop-shadow-2rem absolute animate-ease` + ` `;

export const Home = () => (
  <>
    <section class="h-100vh grid place-items-center px-[min(7vw,4rem)]">
      <h1 class="border-1px border-amber text-center font-bold line-height-80% uppercase w-[clamp(22rem,75vw,70rem)] animate-fade-in-up animate-ease text-accent drop-shadow-2rem">
        Learn programming in a new way!
      </h1>
      <img
        src="/public/assets/lang-icons/c-plus-plus.png"
        class={floatIconClasses + `top-15% left-5% animate-fade-in-top-left`}
      />
      <img
        src="/public/assets/lang-icons/python.png"
        class={floatIconClasses + `top-25% left-15% animate-fade-in-top-left`}
      />
      <img
        src="/public/assets/lang-icons/java.png"
        class={floatIconClasses + `top-35% left-5% animate-fade-in-top-left`}
      />
      <img
        src="/public/assets/lang-icons/php.png"
        class={
          floatIconClasses + `top-65% left-10% animate-fade-in-bottom-left`
        }
      />
      <img
        src="/public/assets/lang-icons/mysql.png"
        class={
          floatIconClasses + `top-80% left-25% animate-fade-in-bottom-left`
        }
      />
      <img
        src="/public/assets/lang-icons/dart.png"
        class={floatIconClasses + `top-20% left-48% animate-fade-in-down`}
      />
      <img
        src="/public/assets/lang-icons/html.png"
        class={floatIconClasses + `top-15% right-5% animate-fade-in-top-right`}
      />
      <img
        src="/public/assets/lang-icons/css3.png"
        class={floatIconClasses + `top-25% right-15% animate-fade-in-top-right`}
      />
      <img
        src="/public/assets/lang-icons/javascript.png"
        class={floatIconClasses + `top-35% right-5% animate-fade-in-top-right`}
      />
      <img
        src="/public/assets/lang-icons/react.png"
        class={
          floatIconClasses + `top-65% right-10% animate-fade-in-bottom-right`
        }
      />
      <img
        src="/public/assets/lang-icons/tailwind.png"
        class={
          floatIconClasses + `top-80% right-25% animate-fade-in-bottom-right`
        }
      />
    </section>
    <CourseList />
    <section>
      <h1>Features</h1>
    </section>
  </>
);
