/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0d0d0d",
          100: "rgb(30, 30, 30)",
        },
        secondary: {
          DEFAULT: "#00d5ff",
          100: "rgba(0, 213, 255, .1)",
          300: "rgba(0, 213, 255, .3)",
          700: "rgba(0, 213, 255, .7)",
        },
        highlight: "#e34ba9"
      },
    },
  },
  plugins: [],
};
