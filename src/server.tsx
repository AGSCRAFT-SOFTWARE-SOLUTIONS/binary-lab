/// <reference types="@kitajs/html/htmx.d.ts" />

// Elysia is the backend server for Bun
import Elysia, { t } from "elysia";
// To use tsx
import Html, { html } from "@elysiajs/html";
// To server static files
import staticPlugin from "@elysiajs/static";
// To set cookies on client side
import { cookie } from "@elysiajs/cookie";
// Auth
import { auth, githubAuth, googleAuth } from "./lib/auth/lucia";
// Types of auth variables
import { AuthRequest, LuciaError, Session } from "lucia";
// The db connection
import { db } from "./lib/db/drizzle";
// SQL operators
import { asc, desc, eq } from "drizzle-orm";
// db schemas
import {
  chapters,
  comments,
  courses,
  faqs,
  quizzes,
  userQuizzes,
} from "./lib/db/schema";
// Type of context of the request
import { Context } from "vm";
// Pages
import Home from "./pages/Home";
import CourseList from "./pages/CourseList";
import Profile from "./pages/Profile";
import Ide from "./pages/Ide";
import Quiz from "./pages/Quiz";
import FAQ from "./pages/FAQ";
import Error from "./pages/Error";
// Components
import Course from "./components/Course";
import SignInForm from "./components/SignInForm";
import SignUpForm from "./components/SignUpForm";
import { User } from "./types/types";
import BaseHTML from "./components/BaseHTML";
import Chapter from "./components/Chapter";
import QuizList from "./components/QuizList";
import FAQConvo from "./components/FAQConvo";
import CUDFAQ from "./components/CUDFAQ";

// Declaring and exoprting these variables. Refer comment above
// `onRequest` method for explaination
export let user: User, session: Session, authRequest: AuthRequest;

// Send either the component alone or the entire page based on the
// request, as the requests that need only the component have
// "hx-request" in them as we use htmx for frontend
const smartResponse = (ctx: Context, component: JSX.Element) =>
  ctx.headers?.["hx-request"] ? component : <BaseHTML>{component}</BaseHTML>;

new Elysia()
  .use(html())
  .use(staticPlugin())
  .use(cookie())
  // Validate whether the user is logged in or not on every request,
  // so that they can be served with content they are allowed to receive
  .onRequest(async (ctx) => {
    authRequest = auth.handleRequest(ctx);
    session = await authRequest.validate();
    user = session ? session.user : null;
  })
  .get(`/`, (ctx) => smartResponse(ctx, <Home />))
  .group("/courses", (app) =>
    app
      .get(`/`, (ctx) => smartResponse(ctx, <CourseList />))
      .group(`/:course`, (app) =>
        app
          .get(`/`, async (ctx) => {
            const course = await db.query.courses.findFirst({
              where: eq(courses.title, decodeURI(ctx.params.course)),
              with: {
                chapters: {
                  with: { course: true },
                },
              },
            });
            return (ctx.set.redirect = `/courses/${ctx.params.course}/${course?.chapters[0].title}`);
          })
          .group("/:chapter", (app) =>
            app
              .get(`/`, async (ctx) => {
                const course = await db.query.courses.findFirst({
                  where: eq(courses.title, decodeURI(ctx.params.course)),
                  with: {
                    chapters: {
                      with: { course: true },
                    },
                  },
                });

                const currentChapter = course?.chapters.find(
                  (chapter) => chapter.title == ctx.params.chapter,
                );
                if (ctx.headers?.["hx-request"]) {
                  return (
                    <Chapter
                      course={course?.title!}
                      chapter={currentChapter!}
                    />
                  );
                } else {
                  return (
                    <BaseHTML>
                      <Course course={course!}>
                        <Chapter
                          course={course?.title!}
                          chapter={currentChapter!}
                        />
                      </Course>
                    </BaseHTML>
                  );
                }
              })
              .get("/video", async (ctx) => {
                const videoQuality = ctx.query.quality! as
                  | "480"
                  | "720"
                  | "1080";
                const videoLinks = await db.query.courses
                  .findFirst({
                    where: eq(courses.title, decodeURI(ctx.params.course)),
                    with: {
                      chapters: {
                        where: eq(
                          chapters.title,
                          decodeURI(ctx.params.chapter),
                        ),
                      },
                    },
                  })
                  .then((res) => res?.chapters[0].videoLinks);

                const video = Bun.file(videoLinks![videoQuality]);
                const videoSize = video.size;
                const chunkSize = 10e4;
                const start = Number(ctx.headers.range?.replace(/\D/g, "")!);
                const end = Math.min(start + chunkSize, videoSize - 1);

                const contentLength = end - start + 1;
                ctx.set.headers = {
                  "Content-Range": `bytes ${start}-${end}/${videoSize}`,
                  "Accept-Ranges": "bytes",
                  "Content-Length": contentLength.toString(),
                  "Content-Type": "video/mp4",
                };
                ctx.set.status = 206;
                const videoStream = video.slice(start, end);

                return videoStream;
              }),
          ),
      ),
  )
  .group("/ide", (app) =>
    app
      .get("/", (ctx) => (ctx.set.redirect = "/ide/c"))
      .get("/:lang", (ctx) =>
        smartResponse(ctx, <Ide lang={ctx.params.lang} />),
      ),
  )
  .group("/auth", (app) =>
    app
      .get(`/sign-in-form`, ({ headers, query }) =>
        headers["hx-request"] ? (
          <SignInForm err={query.err} />
        ) : (
          <BaseHTML>
            <SignInForm err={query.err} />
            <Home />
            <script>{`window.history.pushState({},"","/")`}</script>
          </BaseHTML>
        ),
      )
      .get(`/sign-up-form`, ({ headers, query }) =>
        headers["hx-request"] ? (
          <SignUpForm err={query.err} />
        ) : (
          <BaseHTML>
            <SignUpForm err={query.err} />
            <Home />
            <script>{`window.history.pushState({},"","/")`}</script>
          </BaseHTML>
        ),
      )
      .group(`/sign-up`, (app) =>
        app.post(
          `/credential`,
          async (ctx) => {
            const { email, password, passwordConfirmation } = ctx.body;

            const basicDetails: { [key: string]: string } = ctx.cookie?.[
              "basicDetails"
            ]
              ? JSON.parse(ctx.cookie["basicDetails"])
              : null;

            if (!/.+@.+[.].{2,}/.test(email)) {
              ctx.set.status = 400;
              return `Invalid Email`;
            }

            if (
              password !== passwordConfirmation ||
              typeof password !== "string" ||
              password.length < 8 ||
              password.length > 255
            ) {
              ctx.set.status = 400;
              return `Invalid Password`;
            }

            if (!basicDetails) {
              ctx.set.status = 400;
              return `Didnt get basic details. You're kindly asked to fill it. its required`;
            }

            try {
              const user = await auth.createUser({
                key: {
                  providerId: "email",
                  providerUserId: email.toLowerCase(),
                  password,
                },
                attributes: {
                  email,
                  ...basicDetails,
                },
              });
              const session = await auth.createSession({
                userId: user.userId,
                attributes: {},
              });
              const authRequest = auth.handleRequest(ctx);
              authRequest.setSession(session);
              ctx.set.status = 204;
              ctx.set.redirect = ctx.headers?.["hx-current-url"] ?? "/";
              return;
            } catch (e) {
              ctx.set.status = 400;
              ctx.set.redirect =
                "/auth/sign-up-form?err=account already exists";
              return;
            }
          },
          {
            body: t.Object({
              email: t.String(),
              password: t.String(),
              passwordConfirmation: t.String(),
            }),
          },
        ),
      )
      .group(`/sign-in`, (app) =>
        app
          .post(
            `/credential`,
            async (ctx) => {
              const { email, password } = ctx.body;
              ctx.set.redirect = ctx.headers?.["hx-current-url"] ?? "/";

              if (!/.+@.+[.].{2,}/.test(email)) {
                ctx.set.status = 400;
                return `Invalid Email`;
              }

              if (
                typeof password !== "string" ||
                password.length < 8 ||
                password.length > 255
              ) {
                ctx.set.status = 400;
                return `Invalid Password`;
              }

              try {
                const key = await auth.useKey(
                  "email",
                  email.toLowerCase(),
                  password,
                );
                const session = await auth.createSession({
                  userId: key.userId,
                  attributes: {},
                });
                const authRequest = auth.handleRequest(ctx);
                authRequest.setSession(session);
                ctx.set.status = 302;
                return;
              } catch (e) {
                if (
                  e instanceof LuciaError &&
                  (e.message === "AUTH_INVALID_KEY_ID" ||
                    e.message === "AUTH_INVALID_PASSWORD")
                ) {
                  ctx.set.status = 400;
                  ctx.set.redirect =
                    "/auth/sign-in-form?err=Incorrect email or password";
                  return "Incorrect email or password";
                }

                ctx.set.status = 500;
                ctx.set.redirect = "/auth/sign-in-form";
                return "An unknown error occurred";
              }
            },
            {
              body: t.Object({
                email: t.String(),
                password: t.String(),
              }),
            },
          )
          .group(`/github`, (app) =>
            app
              .get(`/`, async ({ set, setCookie }) => {
                const [url, state] = await githubAuth.getAuthorizationUrl();
                setCookie("github_oauth_state", state, {
                  httpOnly: true,
                  path: "/",
                  maxAge: 60 * 60,
                });
                set.status = 302;
                set.redirect = url.toString();
              })
              .get(`/callback`, async (ctx) => {
                const storedState = ctx.cookie.github_oauth_state;
                const state = ctx.query.state;
                const code = ctx.query.code;
                if (
                  !storedState ||
                  !state ||
                  storedState !== state ||
                  typeof code !== "string"
                ) {
                  return (ctx.set.status = 400);
                }
                try {
                  const { getExistingUser, githubUser, createUser } =
                    await githubAuth.validateCallback(code);
                  const getUser = async () => {
                    const existingUser = await getExistingUser();

                    if (existingUser) return existingUser;

                    const basicDetails: { [key: string]: string } = ctx
                      .cookie?.["basicDetails"]
                      ? JSON.parse(ctx.cookie["basicDetails"])
                      : null;
                    if (!basicDetails) {
                      return null;
                    }

                    const user = await createUser({
                      attributes: {
                        ...basicDetails,
                        email: githubUser.email,
                      },
                    });

                    return user;
                  };

                  const user = await getUser();
                  if (!user) {
                    ctx.set.redirect = "/sign-up-form";
                  }
                  const session = await auth.createSession({
                    userId: user.userId,
                    attributes: {},
                  });

                  const authRequest = auth.handleRequest(ctx);
                  authRequest.setSession(session);

                  ctx.set.status = 302;
                  ctx.set.redirect = ctx.headers?.["hx-current-url"] ?? "/";

                  return;
                } catch (e) {
                  return `error ${e}`;
                }
              }),
          )
          .group(`/google`, (app) =>
            app
              .get(`/`, async ({ set, setCookie }) => {
                const [url, state] = await googleAuth.getAuthorizationUrl();
                setCookie("google_oauth_state", state, {
                  httpOnly: true,
                  path: "/",
                  maxAge: 60 * 60,
                });
                set.status = 302;
                set.redirect = url.toString();
              })
              .get(`/callback`, async (ctx) => {
                const storedState = ctx.cookie.google_oauth_state;
                const state = ctx.query.state;
                const code = ctx.query.code;
                if (
                  !storedState ||
                  !state ||
                  storedState !== state ||
                  typeof code !== "string"
                ) {
                  return (ctx.set.status = 400);
                }
                try {
                  const { getExistingUser, googleUser, createUser } =
                    await googleAuth.validateCallback(code);

                  const getUser = async () => {
                    const existingUser = await getExistingUser();

                    if (existingUser) return existingUser;

                    const basicDetails: { [key: string]: string } = ctx
                      .cookie?.["basicDetails"]
                      ? JSON.parse(ctx.cookie["basicDetails"])
                      : null;
                    if (!basicDetails) {
                      return null;
                    }

                    const user = await createUser({
                      attributes: {
                        ...basicDetails,
                        email: googleUser.email,
                      },
                    });

                    return user;
                  };

                  const user = await getUser();
                  if (!user) {
                    ctx.set.redirect = "/auth/sign-up-form";
                  }
                  const session = await auth.createSession({
                    userId: user.userId,
                    attributes: {},
                  });

                  const authRequest = auth.handleRequest(ctx);
                  authRequest.setSession(session);

                  ctx.set.status = 302;
                  ctx.set.redirect = ctx.headers?.["hx-current-url"] ?? "/";

                  return;
                } catch (e) {
                  return e;
                }
              }),
          ),
      )
      .get(`/sign-out`, async ({ set, headers }) => {
        set.redirect = headers?.["hx-current-url"] ?? "/";

        if (!user) {
          set.status = 401;
          return;
        }
        await auth.invalidateSession(session.sessionId);
        authRequest.setSession(null);
        set.status = 302;
        return;
      }),
  )
  .group("/faq", (app) =>
    app
      .get("/", (ctx) => smartResponse(ctx, <FAQ />))
      .get("/:query", (ctx) =>
        smartResponse(
          ctx,
          <FAQConvo title={decodeURI(ctx.params.query)} user={user} />,
        ),
      )
      // cud stands for create/update/delete
      .get("/cud/:query", async (ctx) => {
        const param = decodeURI(ctx.params.query);
        const query =
          param == "new"
            ? undefined
            : await db.query.faqs.findFirst({
                where: eq(faqs.title, param),
              });
        return smartResponse(ctx, <CUDFAQ query={query} />);
      })
      // cud stands for create/update/delete
      .post(
        "/cud/new",
        async (ctx) => {
          const { title, content } = ctx.body;
          try {
            await db.transaction(async (tx) => {
              const newFaq = await tx
                .insert(faqs)
                .values({ title })
                .returning();
              await tx
                .insert(comments)
                .values({ content, userId: user.id, belongsTo: newFaq[0].id });
            });
            return (ctx.set.redirect = `/faq/${title}`);
          } catch (err) {
            return <Error err={"Something went wront"} />;
          }
        },
        {
          body: t.Object({ title: t.String(), content: t.String() }),
        },
      )
      .patch(
        "/cud/:query",
        async (ctx) => {
          const param = decodeURI(ctx.params.query);
          const query = await db.query.faqs.findFirst({
            where: eq(faqs.title, param),
            with: {
              comments: { orderBy: [asc(comments.createdAt)] },
            },
          });

          if (user.id != query?.comments[0].userId) {
            ctx.set.status = 403;
            return <Error err="Forbidden request" />;
          }

          const { title, content } = ctx.body;
          await db
            .update(faqs)
            .set({ title })
            .where(eq(faqs.title, query.title));
          await db
            .update(comments)
            .set({ content })
            .where(eq(comments.content, query.comments[0].content));

          ctx.set.status = 200;
          return <script>window.location=`/faq/{title}`</script>;
        },
        { body: t.Object({ title: t.String(), content: t.String() }) },
      ),
  )
  .get(`/profile`, async (ctx) => {
    const authRequest = auth.handleRequest(ctx);
    const session = await authRequest.validate();
    if (session) {
      return smartResponse(ctx, <Profile user={session.user} />);
    }
    ctx.set.status = 401;
    ctx.set.redirect = ctx.headers?.["hx-current-url"] ?? "/";
    return;
  })
  .get("/video", (ctx) => {
    const video = Bun.file("public/assets/sample-video.mp4");
    const range = ctx.headers.range;
    const videoSize = video.size;
    const chunckSize = 10e4;
    const start = Number(range?.replace(/\D/g, ""));
    const end = Math.min(start + chunckSize, videoSize - 1);
    const contentLength = end - start + 1;

    ctx.set.headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength.toString(),
      "Content-Type": "video/mp4",
    };

    ctx.set.status = 206;
    const videoStream = video.slice(start, end);

    return videoStream;
  })
  .group(`/quiz`, (app) =>
    app
      .get(`/`, async (ctx) => {
        if (!user) return (ctx.set.redirect = "/auth/sign-in-form");
        const retrievedQuizzes = await db.query.quizzes.findMany({
          orderBy: [desc(quizzes.createdAt)],
        });
        const retrievedUserQuizzes = await db.query.userQuizzes.findMany({
          where: eq(userQuizzes.userId, user.id),
        });
        if (retrievedUserQuizzes.length == 0)
          return smartResponse(
            ctx,
            <Quiz>
              <QuizList quizzes={retrievedQuizzes} />
            </Quiz>,
          );
        if (retrievedQuizzes.length == retrievedUserQuizzes.length)
          return smartResponse(
            ctx,
            <Quiz>
              <QuizList />
            </Quiz>,
          );

        const notCompletedQuizzes = retrievedQuizzes.filter((quiz) =>
          retrievedUserQuizzes.some((userQuiz) => userQuiz.quizId != quiz.id),
        );
        return smartResponse(
          ctx,
          <Quiz>
            <QuizList quizzes={notCompletedQuizzes} />
          </Quiz>,
        );
      })
      .post(
        `/submit`,
        async (ctx) => {
          const quizId = Object.keys(ctx.body)[0];
          const submittedAns = Object.values(ctx.body)[0];
          const quiz = await db.query.quizzes.findFirst({
            where: eq(quizzes.id, quizId),
          });
          const answer =
            quiz &&
            Object.keys(quiz.answers).filter(
              (ans) => quiz?.answers[ans] == "true",
            )[0];

          if (!user) {
            ctx.set.status = 401;
            return <SignInForm />;
          }

          if (submittedAns == answer) {
            await db.insert(userQuizzes).values({ userId: user.id, quizId });
            return 1;
          } else return 0;
        },
        {
          body: t.ObjectString({}),
        },
      )
      .post(
        `/filter`,
        async (ctx) => {
          const sortBy = ctx.body.sortBy;
          const status = ctx.body.status;

          const sortedQuizzes = await db.query.quizzes.findMany({
            orderBy: [
              sortBy == "new"
                ? desc(quizzes.createdAt)
                : asc(quizzes.createdAt),
            ],
          });
          if (status == "all") return <QuizList quizzes={sortedQuizzes} />;

          let filteredQuizzes = sortedQuizzes;
          const retrievedUserQuizzes = await db.query.userQuizzes.findMany({
            where: eq(userQuizzes.userId, user.id),
          });
          if (status == "notCompleted") {
            if (sortedQuizzes.length == retrievedUserQuizzes.length) return;
            if (retrievedUserQuizzes.length == 0)
              return <QuizList quizzes={sortedQuizzes} />;
            filteredQuizzes = sortedQuizzes.filter((quiz) =>
              retrievedUserQuizzes.some(
                (userQuiz) => userQuiz.quizId != quiz.id,
              ),
            );
          } else if (status == "completed") {
            filteredQuizzes = sortedQuizzes.filter((quiz) =>
              retrievedUserQuizzes.some(
                (userQuiz) => userQuiz.quizId == quiz.id,
              ),
            );
          }
          return <QuizList quizzes={filteredQuizzes} />;
        },
        { body: t.Object({ sortBy: t.String(), status: t.String() }) },
      ),
  )
  .get("/md", () => Bun.file("README.md"))
  .get("/*", (ctx) => smartResponse(ctx, <Error />))
  .listen(5555, ({ hostname, port }) =>
    console.log(`🦊 runnin on http://${hostname}:${port}`),
  );
