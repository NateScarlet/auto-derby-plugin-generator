const { mdiChevronDown } = require("@mdi/js");
const forms = require("@tailwindcss/forms");

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
    defaultLineHeights: true,
    standardFontWeights: true,
  },
  darkMode: false,
  theme: {
    extend: {
      colors: {
        main: "#409eff",
        success: "#67c23a",
        danger: "#f56c6c",
        info: "#909399",
      },
      textColor: {
        primary: "#000000",
        secondary: "#bfcbd9",
      },
      backgroundColor: {
        primary: "#ffffff",
        secondary: "#304156",
      },
      minHeight: {
        10: "2.5rem",
        16: "4rem",
        32: "8rem",
        64: "16rem",
      },
      maxHeight: {
        64: "16rem",
        96: "24rem",
        128: "32rem",
      },
      customForms: (theme) => ({
        default: {
          "input, textarea, multiselect, select": {
            color: "#000000",
            backgroundColor: "#ffffff",
            borderColor: theme("colors.gray.400"),
            "&:focus": {
              boxShadow: null,
            },
          },
          select: {
            icon: `<svg fill="${theme(
              "colors.gray.500"
            )}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${mdiChevronDown}"/></svg>`,
          },
        },
      }),
    },
  },
  variants: {},
  plugins: [forms],
  purge: {
    content: ["src/**/*.{vue,ts}", "public/**/*.html"],
  },
};
