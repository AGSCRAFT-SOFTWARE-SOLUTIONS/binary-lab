import { db } from "../lib/db/drizzle";

export default async () => (
  <>
    <section id={"faqSection"} class={"grid gap-2"}>
      <h1>FAQs</h1>
      <div class={"flex gap-4"}>
        <input
          id={"searchQueryInput"}
          type="text"
          placeholder="Search queries"
          class={"inputStyle"}
        />
        <button
          hx-get="/faq/cud/new"
          hx-push-url="true"
          hx-target="#swap-container"
          hx-swap="innerHTML transition:true"
          class={"inputStyle flex gap-2 max-w-max"}
        >
          <span class="material-symbols-outlined">add</span>
          New Query
        </button>
      </div>
      <div id={"queriesContainer"} class={"w-full"}></div>
    </section>
    <script src="https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.js"></script>
    <script>{`
    	var originalList = ${JSON.stringify(await db.query.faqs.findMany())};
			var filteredQueries = originalList;
			var options = {
				keys: [ "title" ]
			}
			var fuse = new Fuse(originalList,options)

			var updateQueriesList = () => {
				queriesContainer.innerHTML = "";
				filteredQueries.forEach( query => {
					const element = \`
          	<a
          	  href="/faq/\${query.title}"
          	  hx-boost="true"
          	  hx-target="#faqSection"
          	  hx-swap="innerHTML transition:true"
          	  class="w-full"
          	>
          	  <div class="glow rd-xl p-4 flex justify-between">
          	    <h3>\${query.title}</h3>
          	    <span class="material-symbols-outlined">chevron_right</span>
          	  </div>
          	</a>
          	<br />
					\`
					queriesContainer.innerHTML += element;
				});
			}

			updateQueriesList();

			searchQueryInput.oninput = (e) => {
				filteredQueries = e.target.value.length != 0
					? fuse.search(e.target.value).map( result => result.item )
					: originalList;
				updateQueriesList();
			}; 
			
    `}</script>
  </>
);
