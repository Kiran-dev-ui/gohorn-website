import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1F2433",
          light: "#2D3142",
        },
        green: {
          DEFAULT: "#3FAE89",
          dark: "#2A8F6E",
          light: "#5DC4A2",
        },
        cream: "#FAF7F0",
        yellow: "#E8C77A",
        lavender: "#B5A8D4",
        sage: "#C5D4B5",
        warm: {
          100: "#F5F5F0",
          300: "#D4D4D0",
          500: "#8A8A85",
          700: "#4A4A45",
        },
      },
      fontFamily: {
        fraunces: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
