/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ejs}'],
  theme: {
    extend: {
      fontFamily: {
        clashDisplay: ['"Clash Display"', 'sans-serif'],
        openSans: ['"Open Sans"', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
