import type { Config } from "tailwindcss";
import formsPlugin from "@tailwindcss/forms";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        pulseCustom: {
          "0% 100%": {opacity: "1"},
          "50%": {opacity: "0.7"}
        }
      },
      animation: {
        pulseCustom: "pulseCustom 2s infinite"
      }
    }
  },
  plugins: [formsPlugin],
} satisfies Config;
