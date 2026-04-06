/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff1f6",
          100: "#ffe4ee",
          200: "#ffc9dd",
          300: "#ff9fbe",
          400: "#ff6fa0",
          500: "#ff3f81",
          600: "#e61f62",
          700: "#bf124b",
          800: "#8f0f3a",
          900: "#5f0a27",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
