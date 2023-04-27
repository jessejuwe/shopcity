/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,pug,scss}'],
  theme: {
    extend: {
      fontFamily: {
        openSans: ['"Open Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
