import { asc, eq } from "drizzle-orm";
import { db } from "../lib/db/drizzle";
import { comments, faqs } from "../lib/db/schema";
import { User } from "../types/types";

export default async ({ title, user }: { title: string; user: User }) => (
  <div class={"min-h-[calc(100vh-12rem)]"}>
    <h1>{title}</h1>
    <br />
    <div class={"flex gap-2"}>
      <button
        class={"flex gap-2 items-center glow p-2 rd-xl"}
        onclick="window.location='/faq'"
      >
        <span class="material-symbols-outlined">arrow_back</span>
        Go back
      </button>

      <button
        class={"flex gap-2 items-center glow p-2 rd-xl"}
        hx-get={`/faq/cud/${title}`}
        hx-push-url="true"
        hx-target="#swap-container"
        hx-swap="innerHTML transition:true"
      >
        <span class="material-symbols-outlined">edit</span>
        Edit
      </button>
    </div>
    {await db.query.faqs
      .findFirst({
        where: eq(faqs.title, title),
        with: {
          comments: {
            with: { user: true },
            orderBy: [asc(comments.createdAt)],
          },
        },
      })
      .then(
        (faq) =>
          faq?.comments.map((comment) => (
            <>
              <br />
              <div
                class={
                  "grid grid-cols-[3rem_1fr] gap-4 glow p-4 rd-xl items-center"
                }
              >
                <img
                  src={`https://api.dicebear.com/7.x/big-smile/svg?seed=${comment.user.name}&flip=true`}
                  class={"glow rd-full"}
                  title={comment.user.name}
                />
                <div>
                  <p>{comment.user.name}</p>
                  <span class={"op-50 text-3"}>
                    Commented on {comment.createdAt?.toLocaleString()}
                  </span>
                </div>
                <div></div>
                <p>{comment.content}</p>
              </div>
            </>
          )),
      )}
  </div>
);
