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

const app = new Elysia()
  .use(html())
  .use(staticPlugin())
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
  .group(`/auth`, (app) =>
    app
      .get(`/sign-in`, ({ headers, set }) =>
        headers["hx-request"] ? <SignInForm /> : (set.redirect = "/")
      )
      .get(`/sign-up`, ({ headers, set }) =>
        headers["hx-request"] ? <SignUpForm /> : (set.redirect = "/")
      )
  )
  .group(`/profile`, (app) => app.get(`/`, () => "hellow user"))
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
      <body class="box-border bg-coolGray-950 color-white">
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
