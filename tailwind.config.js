/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs",
    "./public/**/*.js",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        success: '#28a745',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8',
        // Premium brand colors for glassmorphism
        brand1: '#0d1b2a',
        brand2: '#1b263b',
        gold: '#ffc371',
        coral: '#ff5f6d',
        aqua: '#00c8ff',
        glass: 'rgba(255, 255, 255, 0.1)',
        'glass-dark': 'rgba(0, 0, 0, 0.2)',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
  // Prefix to avoid conflicts with Bootstrap
  prefix: 'tw-',
  // Don't reset Bootstrap styles
  corePlugins: {
    preflight: false,
  },
}
