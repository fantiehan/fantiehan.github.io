/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        display: ["EB Garamond", "Georgia", "Songti SC", "Noto Serif CJK SC", "serif"],
        sans: ["EB Garamond", "Georgia", "Songti SC", "Noto Serif CJK SC", "serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "ui-monospace", "Cascadia Code", "monospace"],
      },
      boxShadow: {
        paper: "0 10px 26px var(--shadow-paper)",
        "paper-soft": "0 1px 0 rgba(60, 45, 20, 0.05)",
      },
      colors: {
        paper: "var(--paper)",
        paperDeep: "var(--paper-deep)",
        ink: "var(--ink)",
        inkSoft: "var(--ink-soft)",
        zineLine: "var(--line)",
        zineAccent: "var(--accent)",
      },
    },
  },
  plugins: [],
};
