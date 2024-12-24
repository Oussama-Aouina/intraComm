/** @type {import('tailwindcss').Config} */
module.exports = {
  // darkMode: "selector",
  content: [
    "./App.{js,ts,jsx,tsx}",
    "./Screens/**/*.{js,jsx,ts,tsx}",
    "./Components/**/*.{js,jsx,ts,tsx}",
    "./Hooks/**/*.{js,jsx,ts,tsx}",
    "./Screens/Home/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "greenBlue-100": "#05F2DB",
        "greenBlue-200": "#1ED9D9",
        "greenBlue-300": "#0F97A6",
        "greenBlue-400": "#0E6973",
        "greenBlue-500": "#0A3A40",
        purpleBlue: "#030A8C",
        "dark-500": "#2B2B2B",
        "dark-200": "#5C5C5C",
      },
    },
  },
  plugins: [],
};
