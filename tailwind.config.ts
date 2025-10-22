import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Usa --font-inter per i titoli
        heading: ["var(--font-inter)", "sans-serif"],
        // Usa --font-rubik come default (sans)
        sans: ["var(--font-rubik)", "sans-serif"],
      },
      colors: {
        "background-main": "#0D0C12",
        "background-secondary": "#1A1821",
        "primary": "#00BFFF",
        "secondary": "#FF00FF",
      },
      backdropBlur: {
        xs: "2px", sm: "4px", md: "8px", lg: "12px",
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(-3%)' },
          '50%': { transform: 'translateY(3%)' },
        },
        // Nuova animazione "shine" per i bottoni
        shine: {
          '0%': { transform: 'translateX(-100%) skewX(-15deg)' },
          '100%': { transform: 'translateX(200%) skewX(-15deg)' },
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shine': 'shine 1.5s infinite linear',
      }
    },
  },
  plugins: [],
};
export default config;