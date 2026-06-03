import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#05060b",
        deep: "#080b13",
        panel: "#0d121f",
        "panel-raised": "#12182a",
        cyan: "#35e9ff",
        purple: "#9b5cff",
        blue: "#4586ff",
        pink: "#ff4d9d",
        amber: "#ffb84d",
        danger: "#ff4d6d",
        success: "#38e88b",
        "text-primary": "#f4f7ff",
        "text-secondary": "#a4aec4",
        "text-muted": "#657089",
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
        pink: "0 0 28px rgba(255, 77, 157, 0.22)",
        amber: "0 0 24px rgba(255, 184, 77, 0.18)",
        danger: "0 0 28px rgba(255, 77, 109, 0.24)",
      },
      borderRadius: {
        panel: "16px",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
      animation: {
        "gm-pulse": "gm-pulse 1.8s ease-in-out infinite",
        "gm-scan": "gm-scan 4s linear infinite",
      },
      keyframes: {
        "gm-pulse": { "0%, 100%": { opacity: "0.35" }, "50%": { opacity: "1" } },
        "gm-scan": { "0%": { transform: "translateY(-100%)" }, "100%": { transform: "translateY(100%)" } },
      },
    },
  },
  plugins: [],
} satisfies Config;
