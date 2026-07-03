import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // v3 Pantone palette (Figma board): Cloud Dancer / Light Gray page,
        // Copper + Mocha Bisque accents, Oxblood Red, Bronze Green ground.
        night:   "#1d291d", // bronze green 900
        soot:    "#2b3b2b", // bronze green 800
        copper:  "#8c5438", // Mocha Bisque 18-1140
        gold:    "#c57e5b", // Copper 16-1325
        cream:   "#f0efeb", // Cloud Dancer 11-4201
        stone:   "#a8a59b",
        hairline:"#9b988e",
        kalk:       "#d9d7cf", // Light Gray 12-0404
        terrakotta: "#713940", // Oxblood Red 19-1524
        oxblood:    "#713940",
        merlot:     "#422628", // oxblood 900 — dark red band
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body:    ["var(--font-body)", "system-ui", "sans-serif"],
        mono:    ["ui-monospace", "monospace"],
      },
      letterSpacing: {
        signage: "0.18em",
        title:   "-0.01em",
      },
      transitionTimingFunction: {
        deep: "cubic-bezier(0.16, 1, 0.3, 1)",
        std:  "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },
      animation: {
        drift: "drift 18s ease-in-out infinite",
        fadein: "fadein 800ms cubic-bezier(0.16,1,0.3,1) both",
      },
      keyframes: {
        drift: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
        fadein: { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};
export default config;
