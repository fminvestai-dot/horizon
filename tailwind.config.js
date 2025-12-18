/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'zen-black': '#0A0A0A',
        'zen-dark': '#121212',
        'zen-darker': '#0D0D0D',
        'zen-white': '#F5F5F5',
        'zen-gray': '#808080',
        'zen-gray-light': '#A0A0A0',
        'zen-gray-dark': '#404040',
        'zen-accent': '#00D9FF',
        'zen-accent-dark': '#00A8E8',
        'zen-accent-light': '#4DE8FF',
        // Belt progression colors with gradients
        'belt-white': '#FFFFFF',
        'belt-yellow': '#FFD700',
        'belt-orange': '#FF8C00',
        'belt-green': '#10B981',
        'belt-black': '#000000',
      },
      borderWidth: {
        'hairline': '0.5px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'dot-pattern': "radial-gradient(circle at 1px 1px, rgba(128, 128, 128, 0.2) 1px, transparent 0)",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'accent-gradient': 'linear-gradient(135deg, #00D9FF 0%, #00A8E8 100%)',
      },
      backgroundSize: {
        'dot-pattern': '20px 20px',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 217, 255, 0.3)',
        'glow-lg': '0 0 40px rgba(0, 217, 255, 0.4)',
        'inner-glow': 'inset 0 0 20px rgba(0, 217, 255, 0.1)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
};