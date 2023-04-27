/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,pug}', './**/*.{html,js,pug}'],
  theme: {
    extend: {
      fontFamily: {
        openSans: ['"Open Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
