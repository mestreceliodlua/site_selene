/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        seleneDark: "#0a0e27",
        seleneDarker: "#050814",
        seleneGold: "#D4AF37",
        seleneGoldLight: "#e5c158",
      },
    },
  },
  plugins: [],
}