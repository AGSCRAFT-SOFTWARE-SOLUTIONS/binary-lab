export const Header = () => (
  <header class="bg-glass grid grid-cols-[min-content_1fr_1fr] lg:grid-cols-3 items-center w-[clamp(22rem,75vw,80rem)] rounded-36 px-6 py-4 fixed translate-x--50% left-50% top-4 backdrop-blur-4 z-10">
    <nav class="flex gap-4">
      <a
        aria-label="courses"
        href="/courses"
        hx-boost="true"
        hx-target="#swap-container"
        class="color-gray hidden lg:block  hover:color-white"
      >
        Courses
      </a>
      <a
        aria-label="quiz"
        href=""
        class="color-gray hidden lg:block  hover:color-white"
      >
        Quiz
      </a>
      <a
        aria-label="playground"
        href=""
        class="color-gray hidden lg:block  hover:color-white"
      >
        Playground
      </a>
      <a
        aria-label="help"
        href=""
        class="color-gray hidden lg:block  hover:color-white"
      >
        Help
      </a>
    </nav>
    <a aria-label="lab" href="/" hx-boost="true" hx-target="#swap-container">
      <h3 class="font-[Pixelify_Sans] lg:text-center font-bold uppercase cursor-pointer font-[Pixelify_ Sans]">
        Lab
      </h3>
    </a>
    <div class="flex gap-6 items-center justify-end">
      <button>
        <i class="fa-solid fa-magnifying-glass"></i>
      </button>
      <button
        hx-get="/auth/sign-up"
        hx-target="body"
        hx-swap="afterbegin"
        class="cursor-pointer"
      >
        Sign in
      </button>
      <a aria-label="profile" href="/profile" title="t0mri">
        <img
          src="https://api.dicebear.com/7.x/big-smile/svg?seed=tomri&flip=true"
          alt="avatar"
          class="h-2rem glow rd-full"
        />
      </a>
    </div>
  </header>
);
