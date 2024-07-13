/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js}',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'login-background': "url('/src/assets/img/login_background.png')",
        'footer-texture': "url('/img/footer-texture.png')",
      },
      colors: {
        transparent: 'transparent',
        background: '#0d0d12',
        squareBackground: "#26262a",
        afterBackground: '#0d0d12',
        selectedSquareBackground: "#757575",
        gameLaunched: "#727272",
        white: '#FFFFFF',
        textButton: '#272727',
      },
    },
  },
  plugins: [],
}

