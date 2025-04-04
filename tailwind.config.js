const {hairlineWidth} = require('nativewind/theme');
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      borderWidth: {
        hairline: hairlineWidth(),
        md: 2,
        sm: 1,
      },
      colors: {
        accent: '#EC722B',
        lightGray: '#F6F7F9',
        gray: '#B0BCCE',
        darkGray: '#4C4D56',
        lightRed: '#FFEBEA',
        red: '#FF3932',
      },
      spacing: {
        layout: '20px',
        menu: '80px',
      },
    },
    borderRadius: {
      none: '0',
      sm: '10px',
      md: '15px',
      lg: '20px',
      full: '9999px',
      xl: '30px',
      xs: '10px',
      xxs: '5px',
    },
  },
  plugins: [],
};
