/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#050D1A",
          100: "#0C1929",
          200: "#132040",
          300: "#1A3060",
        },
        secondary: {
          DEFAULT: "#4DA6FF",
          100: "rgba(77, 166, 255, 0.1)",
          300: "rgba(77, 166, 255, 0.3)",
          700: "rgba(77, 166, 255, 0.7)",
        },
        highlight: "#1A6EEB",
      },
    },
  },
  plugins: [],
};
