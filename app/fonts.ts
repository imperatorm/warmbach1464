// Typografie — self-hosted via next/font (Akzeptanzkriterium 7, keine Runtime-Google-Calls).
//
// Display = EB_Garamond: ein charaktervoller, hochkontrastiger Old-Style-Display-Serif mit
// optischer Achse (opsz) und „WONK"/„SOFT"-Achsen — nah an GT Sectras editorialem, leicht
// eigenwilligem Schnitt, und deutlich distinktiver als EB Garamond.
// Body = Hanken Grotesk: eine ruhige, präzise Grotesk als veredelte Söhne-Alternative.
//
// SWAP-READY: sobald lizenzierte GT Sectra / Söhne .woff2 vorliegen, diese beiden Exporte auf
// `next/font/local` umstellen — die CSS-Variablennamen (--font-display/--font-body) bleiben,
// der Rest der App ändert sich nicht.
import { EB_Garamond, Hanken_Grotesk } from "next/font/google";

export const display = EB_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const body = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  fallback: ["system-ui", "Arial", "sans-serif"],
});
