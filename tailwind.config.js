/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#1957D6",
        abu: "#808080",
        border: "#DBDFE5",
        hover: "#DFE9FF",
        button: "#F5F5F5",
        borderTabel: "#E3E3E3",
        black: "#161616",
        hitam2: "#636363",
        putih: "#FFFFFF",
        hijau: "#34C759",
        merah: "#FF3B30",
      },
    },
  },
  plugins: [],
};
