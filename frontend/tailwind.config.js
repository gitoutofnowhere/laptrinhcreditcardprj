/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#f1f4ff',
          100: '#e2e8ff',
          200: '#c6d1ff',
          300: '#9eadfb',
          400: '#7a8ef6',
          500: '#5b6ff0',
          600: '#4353e0',
          700: '#3341b8',
        },
        navy: {
          800: '#23307e',
          900: '#1b2560',
          950: '#121a45',
        },
        sun: '#ffc93c',
        blush: '#ff9ec4',
        mint: '#2fbf8f',
        paper: '#f6f8fe',
        line: '#e3e7f5',
        ink: {
          DEFAULT: '#1b2560',
          2: '#4a5380',
          3: '#8189ad',
        },
        success: '#1fa774',
        warning: '#f2a21b',
        danger: '#e5484d',
        // Backward-compatibility aliases
        brand: {
          50: '#f1f4ff',
          100: '#e2e8ff',
          500: '#5b6ff0',
          600: '#4353e0',
          700: '#3341b8',
        }
      },
      fontFamily: {
        display: ['"Nunito"', '"Be Vietnam Pro"', 'sans-serif'],
        sans: ['"Be Vietnam Pro"', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(27, 37, 96, 0.06), 0 4px 14px rgba(27, 37, 96, 0.06)',
        lift: '0 2px 4px rgba(27, 37, 96, 0.06), 0 14px 32px rgba(67, 83, 224, 0.16)',
        press: '0 3px 0 #23307e',
      },
    },
  },
  plugins: [],
}
