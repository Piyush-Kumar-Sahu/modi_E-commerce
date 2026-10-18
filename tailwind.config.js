/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#16894F',
          hover: '#11663C',
          light: '#E8F5EE',
        },
        accent: {
          DEFAULT: '#F07822',
          hover: '#D46315',
          light: '#FEF3EB',
        },
        charcoal: {
          DEFAULT: '#222426',
          light: '#36393C',
        },
        warmIvory: '#FAF8F3',
        softNeutral: '#F4F1E9',
        mutedGrey: '#6B6F72',
        borderNeutral: '#E4E1D9',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        button: '8px',
        card: '12px',
        modal: '16px',
      },
      maxWidth: {
        site: '1280px',
      },
      boxShadow: {
        subtle: '0 2px 8px -2px rgba(34, 36, 38, 0.05), 0 1px 4px -1px rgba(34, 36, 38, 0.03)',
        card: '0 4px 16px -4px rgba(34, 36, 38, 0.08), 0 2px 6px -2px rgba(34, 36, 38, 0.04)',
        float: '0 12px 32px -8px rgba(34, 36, 38, 0.12), 0 4px 12px -2px rgba(34, 36, 38, 0.06)',
      },
      transitionDuration: {
        fast: '180ms',
      }
    },
  },
  plugins: [],
}
