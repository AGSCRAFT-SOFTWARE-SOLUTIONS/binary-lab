import { Children } from "@kitajs/html";
import Header from "./Header";
import { user } from "../server";
import Footer from "./Footer";

export default ({ children }: { children?: Children }) => (
  <>
    {"<!DOCTYPE html>"}
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Binary Lab</title>
        <link rel="stylesheet" href="/public/stylesheets/reset.css" />
        <link rel="stylesheet" href="/public/stylesheets/uno.css" />
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
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
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
          class="py-6rem w-[clamp(22rem,90vw,104rem)] m-a"
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  </>
);
