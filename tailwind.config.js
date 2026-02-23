/** @type {import('tailwindcss').Config} */
const Colors = require("./constants/colors");

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: Colors,
    },
  },
  plugins: [],
};
