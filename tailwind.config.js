/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#080a0d',
          900: '#0d1117',
          850: '#111822',
          800: '#151d28',
          700: '#1e2a38',
        },
        signal: {
          green: '#54d6a7',
          amber: '#f6b65f',
          orange: '#f2794c',
          red: '#e34d59',
          violet: '#b86cff',
        },
      },
      boxShadow: {
        panel: '0 20px 60px rgba(0, 0, 0, 0.28)',
        glow: '0 0 32px rgba(246, 182, 95, 0.18)',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
