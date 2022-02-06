module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  content: [],
  theme: {
    colors: {
      black       : '#555',
      gray        : '#aaa',
      lightgray   : '#ddd',
      red         : 'rgb(244, 63, 94)',
      purple      : '#89558d',
      white       : '#fff',
      orange      : '#F9A076',
      darkorange  : '#DB6933',
      lightpurple : '#9E81A0',
      lightred    : '#E16075'
    },
    extend: {},
  },
  plugins: [],
}
