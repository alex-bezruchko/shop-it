const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryBlue: '#0fa3b1',
        secondaryBlue: '#b5e2fa',
        primaryWhite: '#f9f7f3',
        primaryBeige: '#eddea4',
        primaryOrange: '#f7a072',
        primaryRed: '#F12802',
        primaryGreen: '#6CB462',
        primaryGray: '#C7C8CC',
      },
      // Additional theme customizations specific to Material Tailwind can be added here
    },
  },
  plugins: [],
});
