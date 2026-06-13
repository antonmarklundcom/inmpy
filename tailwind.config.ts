import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: "rgb(var(--c-forest) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--c-primary) / <alpha-value>)",
          dark: "rgb(var(--c-primary-dark) / <alpha-value>)",
        },
        clay: {
          DEFAULT: "rgb(var(--c-clay) / <alpha-value>)",
          soft: "rgb(var(--c-clay-soft) / <alpha-value>)",
        },
        sand: "rgb(var(--c-sand) / <alpha-value>)",
        cream: "rgb(var(--c-cream) / <alpha-value>)",
        bg: "rgb(var(--c-bg) / <alpha-value>)",
        text: "rgb(var(--c-text) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        border: "rgb(var(--c-border) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      borderRadius: {
        card: "12px",
        control: "8px",
      },
      boxShadow: {
        soft: "0 2px 12px rgba(20, 69, 47, 0.06), 0 1px 3px rgba(20, 69, 47, 0.04)",
        card: "0 4px 20px rgba(20, 69, 47, 0.08)",
        float: "0 12px 40px rgba(20, 69, 47, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
