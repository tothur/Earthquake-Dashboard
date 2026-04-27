/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        white: 'rgb(var(--color-white) / <alpha-value>)',
        slate: {
          100: 'rgb(var(--color-slate-100) / <alpha-value>)',
          200: 'rgb(var(--color-slate-200) / <alpha-value>)',
          300: 'rgb(var(--color-slate-300) / <alpha-value>)',
          400: 'rgb(var(--color-slate-400) / <alpha-value>)',
          500: 'rgb(var(--color-slate-500) / <alpha-value>)',
        },
        ink: {
          950: 'rgb(var(--color-ink-950) / <alpha-value>)',
          900: 'rgb(var(--color-ink-900) / <alpha-value>)',
          850: 'rgb(var(--color-ink-850) / <alpha-value>)',
          800: 'rgb(var(--color-ink-800) / <alpha-value>)',
          700: 'rgb(var(--color-ink-700) / <alpha-value>)',
        },
        signal: {
          green: 'rgb(var(--color-signal-green) / <alpha-value>)',
          amber: 'rgb(var(--color-signal-amber) / <alpha-value>)',
          orange: 'rgb(var(--color-signal-orange) / <alpha-value>)',
          red: 'rgb(var(--color-signal-red) / <alpha-value>)',
          violet: 'rgb(var(--color-signal-violet) / <alpha-value>)',
        },
      },
      boxShadow: {
        panel: 'var(--shadow-panel)',
        glow: 'var(--shadow-glow)',
      },
      fontFamily: {
        display: [
          'Inter Tight',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
};
