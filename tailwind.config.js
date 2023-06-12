module.exports = {
  mode: 'jit',
  content: ['./app/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'], // remove unused styles in production
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    colors:{
      primary: '#181818',
      secondary: '#f0f0f0',
      accent: '#ffac5f',
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
