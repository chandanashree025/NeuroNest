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
        // PRIMARY: Deep muted teal / blue-green (#2F6F73)
        // Mapped to sky & primary so all existing utility classes render the refined healthcare palette
        sky: {
          50: '#F2F6F5',
          100: '#E1ECE8',
          200: '#C5DAD3',
          300: '#9EBEB4',
          400: '#5E9489',
          500: '#2F6F73', // Primary deep muted teal
          600: '#275E61',
          700: '#1F4B4E',
          800: '#173B3D',
          900: '#102A2C',
          950: '#091A1B',
        },
        primary: {
          50: '#F2F6F5',
          100: '#E1ECE8',
          200: '#C5DAD3',
          300: '#9EBEB4',
          400: '#5E9489',
          500: '#2F6F73',
          600: '#275E61',
          700: '#1F4B4E',
          800: '#173B3D',
          900: '#102A2C',
        },
        // SECONDARY: Soft sage (#7FA89B)
        teal: {
          50: '#F4F7F5',
          100: '#E6EFEA',
          200: '#CADBD2',
          300: '#ADC6BA',
          400: '#95B4A6',
          500: '#7FA89B', // Secondary soft sage
          600: '#699083',
          700: '#54766A',
          800: '#405B52',
          900: '#2D4039',
          950: '#1B2723',
        },
        // ACCENT: Muted blue (#5B83A6)
        blue: {
          50: '#F2F6FA',
          100: '#E2EBF2',
          200: '#C5D6E5',
          300: '#A4BED5',
          400: '#7EA2C1',
          500: '#5B83A6', // Accent muted blue
          600: '#4B6E8C',
          700: '#3C5770',
          800: '#2E4255',
          900: '#202E3B',
        },
        indigo: {
          50: '#F2F6FA',
          100: '#E2EBF2',
          200: '#C5D6E5',
          300: '#A4BED5',
          400: '#7EA2C1',
          500: '#5B83A6',
          600: '#4B6E8C',
          700: '#3C5770',
          800: '#2E4255',
          900: '#202E3B',
        },
        cyan: {
          50: '#F2F6F5',
          100: '#E1ECE8',
          200: '#C5DAD3',
          300: '#9EBEB4',
          400: '#5E9489',
          500: '#2F6F73',
          600: '#275E61',
          700: '#1F4B4E',
          800: '#173B3D',
          900: '#102A2C',
        },
        // BACKGROUND, TEXT, BORDERS:
        // BACKGROUND: Warm off-white / ivory (#F7F8F5)
        // PRIMARY TEXT: Deep navy/slate (#243447)
        // SECONDARY TEXT: Muted slate (#667085)
        // BORDER: Soft neutral gray (#D9E0DC)
        slate: {
          50: '#F7F8F5',  // Background warm off-white / ivory
          100: '#EDF1EE',
          200: '#D9E0DC', // Border soft neutral gray
          300: '#BAC4BE',
          400: '#8E9A93',
          500: '#667085', // Secondary text muted slate
          600: '#515B6D',
          700: '#3A4656',
          800: '#243447', // Primary text deep navy/slate
          900: '#1A2634',
          950: '#101822',
        },
        // DARK MODE SURFACES: Deep navy/slate backgrounds (not pure black)
        navy: {
          950: '#121A22', // Deepest dark background
          900: '#17222D', // Main dark page background
          850: '#1E2C3A', // Dark mode card surface
          800: '#253748', // Dark mode elevated / hover
          700: '#33485C', // Dark mode border
          600: '#48627B',
        },
        // SUCCESS: Soft green (#5C8D72)
        emerald: {
          50: '#F3F8F5',
          100: '#E4F0E9',
          200: '#C8E0D2',
          300: '#A3CBBA',
          400: '#7EAF96',
          500: '#5C8D72', // Soft green success
          600: '#4C765E',
          700: '#3D5E4B',
          800: '#2F483A',
          900: '#203228',
        },
        green: {
          50: '#F3F8F5',
          100: '#E4F0E9',
          200: '#C8E0D2',
          300: '#A3CBBA',
          400: '#7EAF96',
          500: '#5C8D72',
          600: '#4C765E',
          700: '#3D5E4B',
          800: '#2F483A',
          900: '#203228',
        },
        // WARNING: Warm muted amber (#C99545)
        amber: {
          50: '#FCF9F3',
          100: '#F7F0E2',
          200: '#EEDEC2',
          300: '#E1C79D',
          400: '#D5AE70',
          500: '#C99545', // Warm muted amber
          600: '#A87934',
          700: '#845E28',
          800: '#62451D',
          900: '#442F14',
        },
        // ERROR: Muted red (#B85C5C)
        rose: {
          50: '#FAF4F4',
          100: '#F5E6E6',
          200: '#E8C9C9',
          300: '#D9A7A7',
          400: '#C98282',
          500: '#B85C5C', // Muted red error
          600: '#9B4B4B',
          700: '#7B3A3A',
          800: '#5C2B2B',
          900: '#3E1C1C',
        },
        red: {
          50: '#FAF4F4',
          100: '#F5E6E6',
          200: '#E8C9C9',
          300: '#D9A7A7',
          400: '#C98282',
          500: '#B85C5C',
          600: '#9B4B4B',
          700: '#7B3A3A',
          800: '#5C2B2B',
          900: '#3E1C1C',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 12px -2px rgba(36, 52, 71, 0.06), 0 1px 4px -1px rgba(0, 0, 0, 0.02)',
        'soft-lg': '0 6px 20px -3px rgba(36, 52, 71, 0.08), 0 2px 6px -2px rgba(0, 0, 0, 0.03)',
        'dark-soft': '0 4px 16px -2px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
