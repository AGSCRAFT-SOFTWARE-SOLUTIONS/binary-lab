import { defineConfig, presetUno } from "unocss";

export default defineConfig({
  theme: {
    colors: {
      primary: "var(--primary)",
      secondary: "var(--secondary)",
      tertiary: "var(--tertiary)",
      glass: "var(--glass)",
      text: "var(--text)",
    },
    dropShadow: {
      "2rem": "0 0 2rem var(--secondary)",
    },
  },
  shortcuts: {
    glow: "b b-tertiary bg-glass hover:b-secondary hover:drop-shadow-2rem duration-500 ",
    inputStyle: `glow block p-2 my-4 text-1rem rd-lg m-auto w-90% `,
    fieldsetStyle: "rd-lg glow ",
    legendStyle: "m-2 p-2 ",
    "course-grid": "grid grid-cols-[repeat(auto-fit,minmax(21rem,1fr))] gap-6",
  },
  content: {
    filesystem: ["src/**/*.tsx"],
  },
  presets: [presetUno()],
});
