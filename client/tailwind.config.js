/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#070b14', // deepest backdrop
          900: '#0b1120', // main background
          850: '#111827', // panel surface
          800: '#1e293b', // card / border
          750: '#273549', // hovered surface
          700: '#334155', // muted border
          600: '#475569', // subtle text
        },
        pulse: {
          emerald: '#10b981',
          teal: '#14b8a6',
          cyan: '#06b6d4',
          accent: '#10b981',
          hover: '#059669',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.25)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.25)',
      }
    },
  },
  plugins: [],
}
