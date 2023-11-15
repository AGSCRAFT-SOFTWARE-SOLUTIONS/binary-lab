/// <reference types="@kitajs/html/htmx.d.ts" />

import { html } from "@elysiajs/html";
import Html, { Children } from "@kitajs/html";
import Elysia, { t } from "elysia";
import { Header } from "./components/Header";
import staticPlugin from "@elysiajs/static";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { CourseList } from "./pages/CourseList";
import { Course } from "./pages/Course";
import { SignInForm } from "./components/SignInForm";
import { SignUpForm } from "./components/SignUpForm";
import { auth, githubAuth, googleAuth } from "./lib/auth/lucia";
import { cookie } from "@elysiajs/cookie";
import { Profile } from "./pages/Profile";
import { User } from "./types/types";
import { AuthRequest, LuciaError, Session } from "lucia";
import { Ide } from "./pages/Ide";

let user: User, session: Session, authRequest: AuthRequest;
new Elysia()
  .use(html())
  .use(staticPlugin())
  .use(cookie())
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
          .get(
            `/`,
            (ctx) => (ctx.set.redirect = `/courses/${ctx.params.course}/0`),
          )
          .get(`/:ep`, (ctx) =>
            smartResponse(
              ctx,
              <Course course={ctx.params.course} ep={Number(ctx.params.ep)} />,
            ),
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
  .group("/auth", (app) =>
    app
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
              ctx.set.redirect = "/sign-up-form?err=account already exists";
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
                    "/sign-in-form?err=Incorrect email or password";
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
  .get("/video", () => Bun.file("public/assets/sample-video.mp4"))
  .get("/md", () => Bun.file("README.md"))
  .listen(3000, ({ hostname, port }) =>
    console.log(`🦊 runnin on http://${hostname}:${port}`),
  );

const smartResponse = (ctx: any, component: JSX.Element) => {
  return ctx.headers?.["hx-request"] ? (
    component
  ) : (
    <BaseHTML>{component}</BaseHTML>
  );
};

const BaseHTML = ({ children }: { children?: Children }) => (
  <>
    {"<!doctype html>"}
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Binary Lab</title>
        <link rel="stylesheet" href="/public/stylesheets/style.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin="true"
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Comfortaa&family=Gabarito&&family=Ubuntu+Mono&family=Pixelify+Sans&display=swap"
          rel="stylesheet"
        ></link>
        <script
          src="https://kit.fontawesome.com/7ae938555b.js"
          crossorigin="anonymous"
          defer
        ></script>
        <script
          src="https://unpkg.com/htmx.org@1.9.6"
          integrity="sha384-FhXw7b6AlE/jyjlZH5iHa/tTe9EpJ1Y55RjcgPbjeWMskSxZt1v9qkxLJWNJaGni"
          crossorigin="anonymous"
          defer
        ></script>
      </head>
      <body class="box-border bg-primary color-white">
        <div
          id="stars"
          class="animate-shake-y animate-duration-30000 animate-iteration-infinite"
        ></div>
        <Header user={user} />
        <main
          id="swap-container"
          class="py-6rem px-[min(7vw,4rem)] max-w-104rem m-a"
        >
          {children}
        </main>
        <Footer />
      </body>
      <script>console.log("SDafsdfa");</script>
    </html>
  </>
);
