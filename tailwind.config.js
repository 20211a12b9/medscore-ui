/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: { keyframes: {
      circle: {
        '0%': { transform: 'rotate(0deg) translateX(20px) rotate(0deg)' },
        '100%': { transform: 'rotate(360deg) translateX(20px) rotate(360deg)' },
      }
    },
    animation: {
      circle: 'circle 3s linear infinite',
    }},
   
  },
  plugins: [],
}