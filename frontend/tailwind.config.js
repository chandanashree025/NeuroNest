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
        primary: {
          50: '#f0f9ff',
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
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
        },
        navy: {
          950: '#060d1f',
          900: '#0a1128',
          850: '#0f172a',
          800: '#131d3b',
          700: '#1e293b',
          600: '#334155',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(14, 165, 233, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 25px -3px rgba(14, 165, 233, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        'dark-soft': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
