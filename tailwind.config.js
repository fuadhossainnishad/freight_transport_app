/** @type {import('tailwindcss').Config} */
const Colors = require('./src/constants/colors.ts').default;

module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: Colors,
    },
  },
  plugins: [],
};
