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
        display: ["SF Pro Display", "-apple-system", "BlinkMacSystemFont", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        sans: ["SF Pro Text", "SF Pro Display", "-apple-system", "BlinkMacSystemFont", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
      boxShadow: {
        refined: "0 18px 50px rgba(0, 0, 0, 0.07)",
        "refined-dark": "0 18px 70px rgba(0, 0, 0, 0.42)",
      },
      colors: {
        ink: "#1d1d1f",
        appleGray: "#f5f5f7",
        appleBlue: "#0071e3",
      },
    },
  },
  plugins: [],
};
