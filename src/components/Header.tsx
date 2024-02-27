export default ({ user }: any) => (
  <header class="bg-glass grid grid-cols-[1fr_max-content] lg:grid-cols-3 items-center w-[clamp(22rem,90vw,104rem)] rounded-36 px-6 py-4 fixed translate-x--50% left-50% top-4 backdrop-blur-4 z-10">
    <nav class="gap-4 hidden lg:flex">
      <a
        aria-label="courses"
        href="/courses"
        hx-boost="true"
        hx-target="#swap-container"
        hx-swap="innerHTML transition:true"
        class="color-gray hover:color-white"
      >
        Courses
      </a>
      <a
        aria-label="quiz"
        href="/quiz"
        class="color-gray hover:color-white"
        hx-boost="true"
        hx-target="#swap-container"
        hx-swap="innerHTML transition:true"
      >
        Quiz
      </a>
      <a
        aria-label="ide"
        href="/ide"
        hx-boost="true"
        hx-target="#swap-container"
        hx-swap="innerHTML transition:true"
        class="color-gray hover:color-white"
      >
        ide
      </a>
      <a aria-label="faq" href="/faq" class="color-gray hover:color-white">
        FAQ
      </a>
      <a href="/auth/sign-out" class="color-gray hover:color-white lg:hidden">
        Sign out
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
      {user ? (
        <>
          <a href="/auth/sign-out" class={"hidden lg:block"}>
            Sign out
          </a>
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
          hx-get="/auth/sign-in-form"
          hx-target="body"
          hx-swap="afterbegin transition:true"
          class="cursor-pointer"
        >
          Sign in
        </button>
      )}
      <button onclick="toggleMobileNav()" class={"lg:hidden"}>
        <span class="material-symbols-outlined" id={"menuIcon"}>
          menu
        </span>
      </button>
      <script>{`
				var toggleMobileNav = () => {
  				const nav = document.querySelector("nav");
  				["hidden","grid", "gap-2","absolute","top-110%", "right-0", "glow", "p-2", "rd-xl"].forEach( className => {
  					nav.classList.toggle(className)
  				});
				} 

				window.onclick = (e) => {
					if(document.querySelector("nav.absolute") && e.target != menuIcon) toggleMobileNav()
				}

				`}</script>
    </div>
  </header>
);
