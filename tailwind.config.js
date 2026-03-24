/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aroma-brown': '#8B4513',
        'aroma-gold': '#FFD700',
        'aroma-dark': '#2C1810',
      }
    },
  },
  plugins: [],
}
