/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'safemind-blue': '#3B82F6',
        'safemind-green': '#10B981',
        'safemind-yellow': '#F59E0B',
        'safemind-red': '#EF4444',
      },
    },
  },
  plugins: [],
}
