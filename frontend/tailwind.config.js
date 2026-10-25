/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Newsreader"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['monospace'],
      },
      colors: {
        substack: {
          orange: '#FF6719',
          orangeHover: '#E5530B',
          orangeLight: '#FFF4EE',
          darkOrange: '#FF7D3B',
          bgLight: '#FCFBF9',
          bgDark: '#0F0F10',
          cardDark: '#171719',
          borderLight: '#EDEDEA',
          borderDark: '#27272A',
        },
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#FF6719',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
      },
    },
  },
  plugins: [],
}
