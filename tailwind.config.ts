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
        forest: "var(--forest)",
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
        },
        clay: {
          DEFAULT: "var(--clay)",
          soft: "var(--clay-soft)",
        },
        sand: "var(--sand)",
        cream: "var(--cream)",
        bg: "var(--bg)",
        text: "var(--text)",
        muted: "var(--muted)",
        border: "var(--border)",
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
