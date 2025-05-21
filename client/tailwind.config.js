/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@progress/kendo-react-*/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        'primary-orange': '#F27A56',
        'accent-magenta': '#9A1A3B',
        'gradient-blend-start': '#D1442F',
        'gradient-blend-end': '#E45A2B',
        
        // Neutral UI Colors
        'dark-gray': '#3C3D3D',
        'gray': '#646665',
        'light-gray': '#E5E5E5',
        'white': '#FFFFFF',
        
        // Data Visualization & Feedback Colors
        'info-blue': '#177CF3',
        'success-green': '#1D7A34',
        'warning-yellow': '#FED83A',
        'error-red': '#DE241E',
        
        // Light Gradient
        'peach': '#FDE2CF',
        'cream': '#FFF8F4',
      },
      fontFamily: {
        sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'h1': ['48px', '56px'],
        'h2': ['32px', '40px'],
        'h3': ['24px', '32px'],
        'h4': ['18px', '28px'],
        'body': ['16px', '24px'],
        'small': ['14px', '20px'],
        'button': ['16px', '24px'],
        'input': ['16px', '24px'],
        'table': ['14px', '22px'],
      },
      fontWeight: {
        'h1': '700',
        'h2': '700',
        'h3': '500',
        'h4': '500',
        'body': '400',
        'small': '300',
        'button': '500',
        'input': '400',
        'table': '500',
      },
    },
  },
  plugins: [],
}