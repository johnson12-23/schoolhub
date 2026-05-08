import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        school: {
          ink: "#10243E",
          blue: "#2563EB",
          sky: "#EAF2FF",
          navy: "#0F2747",
          gold: "#F2B84B",
          mint: "#2BB673"
        }
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 39, 71, 0.10)",
        panel: "0 10px 30px rgba(15, 39, 71, 0.08)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
