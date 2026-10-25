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
        dark: {
          bg: '#090A0F',
          card: '#0D0E15',
          elevated: '#12141D',
          hover: '#181B26',
        },
        accent: {
          blue: '#3B82F6',
          blueHover: '#2563EB',
          blueLight: '#60A5FA',
          blueDark: '#1D4ED8',
          blueMuted: '#1E3A8A',
        },
      },
    },
  },
  plugins: [],
}
