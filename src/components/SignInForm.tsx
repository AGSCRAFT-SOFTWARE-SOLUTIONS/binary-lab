export const SignInForm = ({ err }: { err: string | null }) => (
  <tag
    of="dialog"
    class="b b-tertiary bg-glass backdrop-blur-16 top-50% left-50% translate-x--50% translate-y--50% p-4 rd-xl w-[min(100%,30rem)]"
    id="authModal"
  >
    {err && <p class="color-red m-2">*{err}</p>}
    <fieldset class="fieldsetStyle">
      <legend class="legendStyle">Sign in with email & password</legend>
      <form method="POST" action="/auth/sign-in/credential">
        <input
          class="inputStyle"
          type="text"
          placeholder="Email"
          name="email"
          required="true"
          title="Must be in this pattern username123@service.domain"
          pattern=".+@.+[.].{2,}"
        />
        <input
          class="inputStyle"
          type="password"
          placeholder="Password"
          name="password"
          required="true"
          title="Must atleast 8 characters, no special characters allowed"
          pattern="[A-Za-z0-9]{8,}"
        />
        <input class="inputStyle" type="submit" value="Sign in" />
      </form>
    </fieldset>
    <fieldset class="fieldsetStyle">
      <legend class="legendStyle">Sign in with auth providers</legend>
      <button
        class="inputStyle"
        onclick='location.href = "/auth/sign-in/google"'
      >
        <i class="fa-brands fa-google"></i> Sign in with Google
      </button>
      <button
        class="inputStyle"
        onclick='location.href = "/auth/sign-in/github"'
      >
        <i class="fa-brands fa-github"></i> Sign in with Github
      </button>
    </fieldset>
    <br />
    <p class="text-center">
      Don't have an account?{" "}
      <a
        href="/sign-up-form"
        hx-boost="true"
        hx-push-url="false"
        hx-target="#authModal"
        hx-swap="outerHTML transition:true"
        class="hover:drop-shadow-[0_0_.5rem_var(--secondary)] duration-200 z-24 relative"
      >
        Create one!
      </a>
    </p>
    <script>{`
      authModal.close()
      authModal.showModal()
      
      authModal.addEventListener("click", e => {
      const dialogDimensions = authModal.getBoundingClientRect()
        if (
          e.clientX < dialogDimensions.left ||
          e.clientX > dialogDimensions.right ||
          e.clientY < dialogDimensions.top ||
          e.clientY > dialogDimensions.bottom
        ) {
            authModal.remove()
        }
      })
`}</script>
  </tag>
);
