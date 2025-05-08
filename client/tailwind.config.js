/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#3b82f6',     // blue-500
        'primary-dark': '#1d4ed8',// blue-700
        'secondary': '#10b981',   // emerald-500
        'accent': '#f59e0b',      // amber-500
        'background': '#f3f4f6',  // gray-100
        'text': '#1f2937',        // gray-800

        // You can also use color objects for different shades
        'brand': {
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
    },
  },
  plugins: [],
  }