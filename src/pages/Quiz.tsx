export default ({ children }: { children: JSX.Element }) => (
  <>
    <section class="grid lg:grid-cols-[max-content_1fr] gap-4">
      <div
        id="filtersContainer"
        class="relative backdrop-blur-16 min-w-20rem lg:backdrop-blur-0"
      >
        <div
          class="lg:b lg:b-b-0 b-tertiary flex justify-between items-center cursor-pointer bg-glass p-4 rd-36 lg:rd-t-xl lg:rd-b-0"
          onclick="toggleFilter()"
        >
          <h4>Filters</h4>
          <div class="lg:hidden h-1.5rem">
            <span class="material-symbols-outlined">arrow_drop_down</span>
          </div>
        </div>
        <form
          id="filters"
          class="b lg:b-t-0 b-tertiary bg-glass absolute top-110% h-min w-100% backdrop-blur-16 lg:backdrop-blur-0 hidden lg:static p-4 rd-xl lg:rd-t-0 lg:pt-0 lg:grid"
          hx-post="/quiz/filter"
          hx-target="#quizCards"
          hx-trigger="change"
        >
          <fieldset class="fieldsetStyle">
            <legend class="legendStyle">Sort by </legend>
            <div class="pl-4 mb-2">
              <input type="radio" name="sortBy" id="new" value="new" checked />
              <label for="new">New</label>
            </div>
            <div class="pl-4 mb-2">
              <input type="radio" name="sortBy" id="old" value="old" />
              <label for="old">Old</label>
            </div>
          </fieldset>
          <fieldset class="fieldsetStyle">
            <legend class="legendStyle">Status</legend>
            <div class="pl-4 mb-2">
              <input
                type="radio"
                name="status"
                id="notCompleted"
                checked
                value="notCompleted"
              />
              <label for="notCompleted">Not Completed</label>
            </div>
            <div class="pl-4 mb-2">
              <input
                type="radio"
                name="status"
                id="completed"
                value="completed"
              />
              <label for="completed">Completed</label>
            </div>
            <div class="pl-4 mb-2">
              <input type="radio" name="status" id="all" value="all" />
              <label for="all">All</label>
            </div>
          </fieldset>
        </form>
      </div>
      {children}
    </section>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,1,0"
    />
    <link rel="stylesheet" href="/public/stylesheets/quiz.css" />
    <script>{`
			var toggleFilter = () => filtersContainer.classList.toggle('opened');

			var timeout;
			var quizFormHandler = () => (
				document.querySelectorAll('.quiz').forEach(quiz => {
				  quiz.onsubmit = e => {
				    e.preventDefault();
						const messageElement = document.getElementById(\`messageOf\${e.target.id}\`);

						timeout && clearTimeout(timeout);
						e.target.classList.add("b-tertiary", "b-green", "b-red");
						messageElement.classList.add("color-text", "color-green", "color-red");
				
				    var form = e.target;
				    var formData = new FormData(form);
				
				    fetch(form.action, {
				      method: 'POST',
				      body: formData,
							}).then(async response => {
									const data = await response.text()
									if(data.length > 1){
										location = "/auth/sign-in-form?err=You must be signed in to attend quizzes"
										return
									}
									
									const truth = data == 1;

									messageElement.innerHTML = truth ? "You're right 🎉!!!" : "🫥 Try again";

									const classesToToggleOnForm = ["b-tertiary", truth ? "b-red" : "b-green"];
									const classesToToggleOnMessageElement = ["color-text", truth ? "color-red" : "color-green"];

									e.target.classList.remove(...classesToToggleOnForm);
									messageElement.classList.remove(...classesToToggleOnMessageElement);

									timeout = setTimeout(() => {
										e.target.classList.add(...classesToToggleOnForm);
										messageElement.innerHTML = "";
										messageElement.classList.add(...classesToToggleOnMessageElement);
									}, 3E3);
								});
				  };
				}))

			quizFormHandler();
			var config = { attributes: true, childList: true, subtree: true };
			var observer = new MutationObserver(quizFormHandler).observe(document.querySelector("section"),config) 
		`}</script>
  </>
);
