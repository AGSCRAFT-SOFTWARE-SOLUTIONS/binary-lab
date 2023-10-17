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
      "4rem": "0 0 4rem var(--secondary)",
    },
  },
  shortcuts: {
    glow: "b-solid b b-glass hover:b-secondary hover:drop-shadow-2rem duration-500 ",
  },
  content: {
    filesystem: ["**/*.tsx"],
  },
  presets: [presetUno()],
});
