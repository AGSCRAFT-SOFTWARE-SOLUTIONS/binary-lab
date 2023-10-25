/// <reference types="@kitajs/html/htmx.d.ts" />

import { html } from "@elysiajs/html";
import Html, { Children } from "@kitajs/html";
import Elysia from "elysia";
import { Header } from "./components/Header";
import staticPlugin from "@elysiajs/static";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { CourseList } from "./pages/CourseList";
import { Course } from "./pages/Course";
import { SignInForm } from "./components/SignInForm";
import { SignUpForm } from "./components/SignUpForm";
import { auth, githubAuth } from "./lib/auth/lucia";
import { cookie } from "@elysiajs/cookie";
import { parseCookie } from "lucia/utils";

new Elysia()
  .use(html())
  .use(staticPlugin())
  .use(cookie())
  .get(`/`, ({ headers }) => smartResponse(headers, <Home />))
  .group("/courses", (app) =>
    app
      .get(`/`, ({ headers }) => smartResponse(headers, <CourseList />))
      .group(`/:course`, (app) =>
        app
          .get(
            `/`,
            (ctx) => (ctx.set.redirect = `/courses/${ctx.params.course}/0`)
          )
          .get(`/:ep`, ({ headers, params }) =>
            smartResponse(
              headers,
              <Course course={params.course} ep={Number(params.ep)} />
            )
          )
      )
  )
  .get(`/sign-in-form`, ({ headers, set }) =>
    headers["hx-request"] ? <SignInForm /> : (set.redirect = "/")
  )
  .get(`/sign-up-form`, ({ headers, set }) =>
    headers["hx-request"] ? <SignUpForm /> : (set.redirect = "/")
  )
  .group("/auth", (app) =>
    app.group(`/sign-in`, (app) =>
      app.group(`/github`, (app) =>
        app
          .get(`/`, async ({ cookie, setCookie, set, removeCookie }) => {
            if (!cookie["basicDetails"]) {
              set.redirect = "/";
              set.status = 412;
              return;
            }
            const [url, state] = await githubAuth.getAuthorizationUrl();

            setCookie("github_oauth_state", state, {
              httpOnly: true,
              path: "/",
              maxAge: 60 * 60,
            });

            set.status = 302;
            set.redirect = url.toString();

            return `loggin in with github!`;
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
              console.log(
                storedState,
                state,
                storedState !== state,
                typeof code
              );

              return (ctx.set.status = 400);
            }
            try {
              const { getExistingUser, githubUser, createUser } =
                await githubAuth.validateCallback(code);

              const getUser = async () => {
                const existingUser = await getExistingUser();

                if (existingUser) return existingUser;

                const basicDetails = JSON.parse(ctx.cookie["basicDetails"]);

                const user = await createUser({
                  attributes: {
                    ...basicDetails,
                    email: githubUser.email,
                  },
                });

                return user;
              };

              const user = await getUser();
              const session = await auth.createSession({
                userId: user.userId,
                attributes: {},
              });

              const authRequest = auth.handleRequest(ctx);
              authRequest.setSession(session);

              ctx.set.status = 302;
              ctx.set.redirect = "/";

              return;
            } catch (e) {
              return e;
            }
          })
      )
    )
  )
  .group(`/profile`, (app) =>
    app.get(`/`, async (ctx) => {
      const authRequest = auth.handleRequest(ctx);
      const user = await authRequest
        .validate()
        .then((session) => session.user)
        .catch((e) => null);
      if (user) {
        console.log(user);

        return `hi, ${user.name}`;
      }
      return `your current not logged in, so im giving you a sigin form. enjoy`;
    })
  )
  .get("/video", () => Bun.file("public/assets/sample-video.mp4"))
  .get("/md", () => Bun.file("README.md"))
  .listen(3000, ({ hostname, port }) =>
    console.log(`🦊 runnin on http://${hostname}:${port}`)
  );

const smartResponse = (headers: any, component: string) => {
  return headers?.["hx-request"] ? component : <BaseHTML>{component}</BaseHTML>;
};

const BaseHTML = ({ children }: { children?: Children }) => (
  <>
    {"<!doctype html>"}
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Binary Lab</title>
        <link rel="stylesheet" href="/public/stylesheets/index.css" />
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
        <Header />
        <main id="swap-container">{children}</main>
        <Footer />
      </body>
    </html>
  </>
);
