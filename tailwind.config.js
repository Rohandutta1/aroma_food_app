/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kid-bg': '#F2FBF9', // Soft playful mint
        'kid-blue': '#4ECDC4', // Sky blue
        'kid-pink': '#FF6B6B', // Sweet pink
        'kid-yellow': '#FFE66D', // Sunny yellow
        'kid-orange': '#FF9F1C', // Bright orange
        'kid-green': '#A8E6CF', // Pastel green
        'kid-text': '#2D3142', // Soft dark blue text
        // keep some original fallbacks just in case
        'aroma-green': '#A8E6CF', 
        'aroma-dark': '#2D3142',
        'aroma-gold': '#FFE66D',
      },
      fontFamily: {
        'kid-heading': ['Fredoka', 'sans-serif'],
        'kid': ['Nunito', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
