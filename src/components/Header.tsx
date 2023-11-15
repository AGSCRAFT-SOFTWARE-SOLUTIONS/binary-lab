export const Header = ({ user }: any) => (
  <header class="bg-glass grid grid-cols-[min-content_1fr_1fr] lg:grid-cols-3 items-center w-[clamp(22rem,75vw,80rem)] rounded-36 px-6 py-4 fixed translate-x--50% left-50% top-4 backdrop-blur-4 z-10">
    <nav class="flex gap-4">
      <a
        aria-label="courses"
        href="/courses"
        hx-boost="true"
        hx-target="#swap-container"
        hx-swap="innerHTML transition:true"
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
        aria-label="ide"
        href="/ide"
        hx-boost="true"
        hx-target="#swap-container"
        hx-swap="innerHTML transition:true"
        class="color-gray hidden lg:block  hover:color-white"
      >
        ide
      </a>
      <a
        aria-label="help"
        href=""
        class="color-gray hidden lg:block  hover:color-white"
      >
        Help
      </a>
    </nav>
    <a
      aria-label="lab"
      href="/"
      hx-boost="true"
      hx-target="#swap-container"
      hx-swap="innerHTML transition:true"
    >
      <h3 class="font-[Pixelify_Sans] lg:text-center font-bold uppercase cursor-pointer font-[Pixelify_ Sans]">
        Lab
      </h3>
    </a>
    <div class="flex gap-6 items-center justify-end">
      <button>
        <i class="fa-solid fa-magnifying-glass"></i>
      </button>
      {user ? (
        <>
          <a href="/auth/sign-out">Sign out</a>
          <a
            aria-label="profile"
            href="/profile"
            title={user.name}
            hx-boost="true"
            hx-target="#swap-container"
            hx-swap="innerHTML transition:true"
          >
            <img
              src={`https://api.dicebear.com/7.x/big-smile/svg?seed=${user.name}&flip=true`}
              alt="avatar"
              class="h-2rem glow rd-full"
            />
          </a>
        </>
      ) : (
        <button
          hx-get="/sign-in-form"
          hx-target="body"
          hx-swap="afterbegin transition:true"
          class="cursor-pointer"
        >
          Sign in
        </button>
      )}
    </div>
  </header>
);
