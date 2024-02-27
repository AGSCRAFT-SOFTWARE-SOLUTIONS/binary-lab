import { eq } from "drizzle-orm";
import { db } from "../lib/db/drizzle";
import { FAQ } from "../types/types";
import { faqs } from "../lib/db/schema";

export default async ({ query }: { query: FAQ | undefined }) => (
  <>
    <form
      class={"grid gap-2"}
      {...(query
        ? { "hx-patch": `/faq/cud/${encodeURI(query.title)}` }
        : { "hx-post": "/faq/cud/new" })}
    >
      <input
        type="value"
        name="title"
        placeholder="Query title goes here"
        class={"text-size-[clamp(1rem,10vw,5rem)] font-[Gabarito] max-w-90vw"}
        autofocus="true"
        required
        value={query ? query.title : ""}
      />
      <br />
      <textarea
        name="content"
        placeholder="You thought goes here, just feel free to express you issuse as clear as possible"
        class={"resize-y min-h-15rem glow p-2 rd-xl"}
        required
        safe
      >
        {query &&
          (await db.query.faqs
            .findFirst({
              where: eq(faqs.title, query.title),
              with: { comments: true },
            })
            .then((result) => result?.comments[0].content)
            .catch((err) => ""))}
      </textarea>
      <button class={"inputStyle w-min"}>{query ? "Update" : "Create"}</button>
    </form>
    <script>{`
		`}</script>
  </>
);
