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
        display: ["Newsreader Variable", "Georgia", "Songti SC", "Noto Serif CJK SC", "serif"],
        sans: ["Newsreader Variable", "Georgia", "Songti SC", "Noto Serif CJK SC", "serif"],
        type: ["Courier Prime", "Courier New", "ui-monospace", "monospace"],
      },
      boxShadow: {
        paper: "0 10px 26px var(--shadow-paper)",
        print: "0 1px 1.5px var(--shadow-print), 0 8px 18px -10px var(--shadow-print)",
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
