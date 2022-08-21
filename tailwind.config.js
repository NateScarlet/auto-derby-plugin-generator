const { mdiChevronDown } = require('@mdi/js');
const forms = require('@tailwindcss/forms');
var svgDataURI = require('mini-svg-data-uri');

function inlineSVG(svg) {
  return `url("${svgDataURI(svg)}")`;
}

module.exports = {
  important: '#h',
  content: ['src/**/*.{vue,ts}', 'index.html', 'public/**/*.html'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        main: '#409eff',
        success: '#67c23a',
        danger: '#f56c6c',
        info: '#909399',
      },
      textColor: {
        primary: '#000000',
        secondary: '#bfcbd9',
      },
      backgroundColor: {
        primary: '#ffffff',
        secondary: '#304156',
      },
      minHeight: {
        10: '2.5rem',
        16: '4rem',
        32: '8rem',
        64: '16rem',
      },
      maxHeight: {
        64: '16rem',
        96: '24rem',
        128: '32rem',
      },
      minWidth: {
        32: '8rem',
        48: '12rem',
        64: '16rem',
      },
      backgroundImage: (theme) => ({
        'select-icon': inlineSVG(
          `<svg fill="${theme(
            'colors.gray.400'
          )}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${mdiChevronDown}"/></svg>`
        ),
      }),
    },
  },
  plugins: [forms],
};
