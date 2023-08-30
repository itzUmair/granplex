/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "clr-100": "#F3F8F2",
        "clr-800": "#5d5d5d",
        "clr-900": "#0B3954",
      },
    },
  },
  plugins: [],
};
