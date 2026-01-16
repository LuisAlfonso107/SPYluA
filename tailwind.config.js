/** @type {import(tailwindcss).Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00FFFF",
        secondary: "#9C27B0",
        dark: "#0A0A0A",
        "dark-gray": "#1A1A1A",
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        rajdhani: ["Rajdhani", "sans-serif"],
      },
      animation: {
        glow: "glow 2s ease-in-out infinite alternate",
        "pulse-glow": "pulse-glow 1.5s ease-in-out infinite",
        scan: "scan 2s linear infinite",
        "gradient-shift": "gradient-shift 3s ease infinite",
      },
      keyframes: {
        glow: {
          from: { boxShadow: "0 0 5px #00FFFF, 0 0 10px #00FFFF" },
          to: { boxShadow: "0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 30px #00FFFF" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.7 },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
}
