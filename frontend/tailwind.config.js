// tailwind.config.js
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          'light-gray': '#F5F7FA',
          'dark-blue': '#1A3C5A',
          'gold': '#F4A261',
          'gray-border': '#E5E7EB',
        },
      },
    },
    plugins: [],
  };