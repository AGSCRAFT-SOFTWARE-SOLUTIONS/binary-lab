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

new Elysia()
  .use(html())
  .use(staticPlugin())
  .get(`/`, ({ headers }) => smartResponse(headers, <Home />))
  .get(`/courses`, ({ headers }) => smartResponse(headers, <CourseList />))
  .get(
    `/courses/:course`,
    (ctx) => (ctx.set.redirect = `/courses/${ctx.params.course}/0`)
  )
  .get(`/courses/:course/:ep`, ({ headers, params }) =>
    smartResponse(
      headers,
      <Course course={params.course} ep={Number(params.ep)} />
    )
  )
  .get("/video", () => Bun.file("public/assets/sample-video.mp4"))
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
          href="https://fonts.googleapis.com/css2?family=Comfortaa&family=Gabarito&&family=Ubuntu+Mono&display=swap"
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
        <tag
          of="dialog"
          _="on toggleDialog(state) if state me.show() else me.close() end "
          class="absolute"
        >
          Your dialog content goes here
        </tag>
      </body>
    </html>
  </>
);
