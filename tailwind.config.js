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
        display: ["Iowan Old Style", "Palatino Linotype", "Book Antiqua", "Georgia", "serif"],
        sans: ["Avenir Next", "Gill Sans", "Trebuchet MS", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        refined: "0 18px 60px rgba(34, 30, 24, 0.08)",
        "refined-dark": "0 18px 70px rgba(0, 0, 0, 0.34)",
      },
      colors: {
        ink: "#211f1b",
        bone: "#f7f2ea",
        brass: "#b28a49",
      },
    },
  },
  plugins: [],
};
