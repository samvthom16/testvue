module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  content: [],
  theme: {
    colors: {
      black       : '#555',
      gray        : '#aaa',
      lightgray   : '#ddd',
      lightergray : '#f2f2f2', 
      red         : 'rgb(244, 63, 94)',
      purple      : '#89558d',
      white       : '#fff',
      orange      : '#F9A076',
      midorange   : '#E59091',
      darkorange  : '#DB6933',
      lightpurple : '#9E81A0',
      lightred    : '#E16075',
    },
    extend: {
      boxShadow: {
        'vue': '0px -5px 5px 0px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
