export default ({ err = "Page cannot be found!🫥" }: { err?: string }) => (
  <div class="h-[calc(100vh-12rem)] grid place-content-center gap-8">
    <h1>{err}</h1>
    <button
      class="flex items-center p-4 w-max rd-xl glow m-auto"
      onclick="history.back()"
    >
      GO back
      <span class="material-symbols-rounded">arrow_back</span>
    </button>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,1,0"
    />
  </div>
);
