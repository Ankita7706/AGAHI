/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neo-cyan': '#0c6366',
        'neo-orange': '#efddcc',
        'primary-cyan': '#0c6366',
        'light-orange': '#efddcc',
        'neo-dark': '#171e19',
        'neo-sage': '#b7c6c2',
        'neo-white': '#ffffff',
        'neo-black': '#000000',
        'neo-neutral': '#272727',
        'traffic-red': '#ff5f57',
        'traffic-yellow': '#febc2e',
        'traffic-green': '#28c840',
      },
      fontFamily: {
        sans: ['Satoshi', 'system-ui', 'sans-serif'],
        heading: ['Cabinet Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'neo-sm': '2px 2px 0px 0px #000000',
        'neo': '4px 4px 0px 0px #000000',
        'neo-lg': '8px 8px 0px 0px #000000',
        'neo-xl': '12px 12px 0px 0px #000000',
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
}
