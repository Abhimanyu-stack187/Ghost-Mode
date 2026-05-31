import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#05060b",
        panel: "#0d121f",
        "panel-raised": "#12182a",
        cyan: "#35e9ff",
        purple: "#9b5cff",
        blue: "#4586ff",
        pink: "#ff4d9d",
        amber: "#ffb84d",
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "sans-serif"],
        display: ["Space Grotesk", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "monospace"],
      },
      boxShadow: {
        panel: "0 18px 60px rgba(0, 0, 0, 0.28)",
        cyan: "0 0 28px rgba(53, 233, 255, 0.2)",
        purple: "0 0 32px rgba(155, 92, 255, 0.22)",
      },
    },
  },
  plugins: [],
} satisfies Config;
