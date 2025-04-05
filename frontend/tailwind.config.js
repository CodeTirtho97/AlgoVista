/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5",
        secondary: "#10b981",
        dark: "#1f2937",
        light: "#f9fafb",
      },
    },
  },
  plugins: [],
};
