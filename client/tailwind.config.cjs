/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2196f3",
          dark: "#1976d2",
        },
        secondary: {
          DEFAULT: "#e9e9e9",
          dark: "#b0acac",
        },
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
    },
  },
  plugins: [],
};
