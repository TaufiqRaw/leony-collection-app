/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src_frontend/**/*.{pug,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF6363",
          dark: "#FF6363",
          light: "#FF6363",
        },
        secondary: {
          DEFAULT: "#C5ECFD",
          dark: "#C5ECFD",
        },
      },
    },
  },
  plugins: [],
}

