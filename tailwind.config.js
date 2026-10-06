/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        uyghur: ['"UKIJ Ekran"', 'UKIJEkran', '"UKIJ Tuz"', '"Microsoft Uighur"', '"Noto Naskh Arabic"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fb',
          400: '#38aaf7',
          500: '#0e8ee9',
          600: '#0271c7',
          700: '#035aa2',
          800: '#074c85',
          900: '#0c406e',
          950: '#082949',
        },
      },
    },
  },
  plugins: [],
};
