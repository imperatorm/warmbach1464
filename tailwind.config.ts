import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // v2 "Natur" palette — deep forest green + copper/bronze + warm cream
        night:   "#1b261f",
        soot:    "#232f26",
        copper:  "#6f4f34",
        gold:    "#c0916a",
        cream:   "#ece4d2",
        stone:   "#8f9a84",
        hairline:"#9aa78e",
        kalk:       "#c6ccb9",
        terrakotta: "#a8473a",
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
