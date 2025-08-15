/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // important: allows our ThemeContext to toggle dark/light mode
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // All React source files
    "./public/index.html"         // Public root HTML
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Source Code Pro', 'monospace'], // Global font
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out'
      }
    }
  },
  plugins: []
};
