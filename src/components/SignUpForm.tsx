export default ({ err }: { err: string | null }) => (
  <tag
    of="dialog"
    class="b b-tertiary bg-glass backdrop-blur-16 top-50% left-50% translate-x--50% translate-y--50% p-4 rd-xl w-[min(100%,30rem)]"
    id="authModal"
  >
    {err && <p class="color-red m-2">*{err}</p>}
    <fieldset class="fieldsetStyle">
      <legend class="legendStyle">Basic details (*required)</legend>
      <form id="basicDetailsForm">
        <input
          class="inputStyle"
          type="text"
          placeholder="Name"
          name="name"
          required={true}
        />
        <input
          class="inputStyle"
          type="number"
          placeholder="Phone number"
          name="phone"
          required={true}
          title="10 digits"
          pattern="[0-9]{10}"
        />
        <input
          class="inputStyle"
          type="text"
          placeholder="City"
          name="location"
          required={true}
        />
        <input
          class="inputStyle"
          type="text"
          placeholder="Institute"
          name="institute"
          required={true}
        />
      </form>
    </fieldset>
    <fieldset class="fieldsetStyle">
      <legend class="legendStyle">Sign up with email & password</legend>
      <form id="credential" method="POST" action="/auth/sign-up/credential">
        <input
          class="inputStyle"
          type="email"
          placeholder="Email"
          name="email"
          required={true}
          title="Must be in this pattern username123@service.domain"
          pattern=".+@.+[.].{2,}"
        />
        <input
          class="inputStyle"
          type="password"
          placeholder="Password"
          name="password"
          required={true}
          title="Must atleast 8 characters, no special characters allowed"
          pattern="[A-Za-z0-9]{8,}"
          oninput="updatePasswordCondirmation(password.value,passwordConfirmation)"
        />
        <input
          class="inputStyle"
          type="password"
          placeholder="Re-enter password"
          name="passwordConfirmation"
          required={true}
          title="Must match the password entered above"
        />
        <script>{`function updatePasswordCondirmation(password,target){
          target.pattern=password
        }`}</script>
      </form>
      <button
        class={"inputStyle" + " relative"}
        value="Sign Up"
        form="credential"
      >
        <input
          type="submit"
          value=""
          form="basicDetailsForm"
          class="absolute top-0 left-0 h-full w-full"
        />
        Sign in
      </button>
    </fieldset>
    <fieldset class="fieldsetStyle">
      <legend class="legendStyle">Sign in with auth providers</legend>
      <button
        class={"inputStyle" + " relative"}
        onclick='location.href = "/auth/sign-in/google"'
      >
        <i class="fa-brands fa-google"></i> Sign in with Google
        <input
          type="submit"
          value=""
          form="basicDetailsForm"
          class="absolute top-0 left-0 h-full w-full"
        />
      </button>
      <button
        class={"inputStyle" + " relative  "}
        onclick='location.href = "/auth/sign-in/github"'
      >
        <i class="fa-brands fa-github"></i> Sign in with Github
        <input
          type="submit"
          value=""
          form="basicDetailsForm"
          class="absolute top-0 left-0 h-full w-full"
        />
      </button>
    </fieldset>

    <br />
    <p class="text-center">
      Already have an account?{" "}
      <a
        href="/auth/sign-in-form"
        hx-boost="true"
        hx-push-url="false"
        hx-target="#authModal"
        hx-swap="outerHTML transition:true"
        class="hover:drop-shadow-[0_0_.5rem_var(--secondary)] duration-200"
      >
        Sign in!
      </a>
    </p>
    <script>
      {`
      var prevData = JSON.parse(document.cookie?.split("=")[1] ?? "{}");

      authModal.close();
      authModal.showModal();

      authModal.addEventListener("mouseup", e => {
        const {left, right, top, bottom} = authModal.getBoundingClientRect();
        if (e.clientX < left || e.clientX > right || e.clientY < top || e.clientY > bottom) authModal.remove();
      });

      function saveAsCookie() {
        if(!basicDetailsForm.checkValidity()) return
        const { name, phone, location, institute } = basicDetailsForm;
        const expires = new Date(Date.now() + 10 * 60 * 1000).toUTCString();
        document.cookie = \`basicDetails=\${JSON.stringify({ "name" : name.value, "phone" : phone.value, "location" : location.value, "institute" : institute.value })}; expires=\${expires}; path=/\`;
      }

      function disableBasicFormButtonOverlay(){
        document.querySelectorAll('[value=""]').forEach( (input, i) => {
          input.style.pointerEvents = basicDetailsForm.checkValidity() ? "none" : "auto"
        })
      };
      
      ['name', 'phone', 'location', 'institute'].forEach(field => {
        basicDetailsForm[field].value = prevData[field] ?? "";
        basicDetailsForm[field].addEventListener("keyup", () => {
            saveAsCookie();
            disableBasicFormButtonOverlay();
          });
        });
        
      disableBasicFormButtonOverlay();
`}
    </script>
  </tag>
);
