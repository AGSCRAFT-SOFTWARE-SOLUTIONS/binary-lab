export const Header = () => (
  <header class=" border-10px border-amber grid grid-cols-[min-content_1fr_1fr] lg:grid-cols-3 items-center w-[clamp(22rem,75vw,80rem)] rounded-36 px-6 py-4 fixed translate-x--50% left-50% top-4 backdrop-blur-4 z-10">
    <nav class="flex gap-4">
      <a
        href="/courses"
        hx-boost="true"
        hx-target="#swap-container"
        class="color-gray hidden lg:block  hover:color-white"
      >
        Courses
      </a>
      <a href="" class="color-gray hidden lg:block  hover:color-white">
        Quiz
      </a>
      <a href="" class="color-gray hidden lg:block  hover:color-white">
        Playground
      </a>
      <a href="" class="color-gray hidden lg:block  hover:color-white">
        Help
      </a>
    </nav>
    <a href="/" hx-boost="true" hx-target="#swap-container">
      <h3 class="text-5 lg:text-center font-bold uppercase cursor-pointer">
        Binary Lab
      </h3>
    </a>
    <div class="flex gap-6 items-baseline justify-end">
      <button>
        <i class="fa-solid fa-magnifying-glass p-b-2"></i>
      </button>
      <button
        _="set :state to true
    on click send toggleDialog(state: :state) to <dialog/> put not(:state) into :state"
      >
        Log in
      </button>
    </div>
  </header>
);
