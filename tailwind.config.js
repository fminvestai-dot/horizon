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
        'zen-black': '#121212',
        'zen-white': '#F5F5F5',
        'zen-gray': '#808080',
        'zen-accent': '#00A8E8',
        // Belt progression colors
        'belt-white': '#FFFFFF',
        'belt-yellow': '#FFD700',
        'belt-orange': '#FF8C00',
        'belt-green': '#28A745',
        'belt-black': '#000000',
      },
      borderWidth: {
        'hairline': '0.25px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'dot-pattern': "radial-gradient(circle at 1px 1px, #808080 0.5px, transparent 0)",
      },
      backgroundSize: {
        'dot-pattern': '5mm 5mm',
      }
    },
  },
  plugins: [],
};