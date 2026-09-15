// Hanken Grotesk — the Figma source's UI/body/label face (next/font/google;
// freely licensed, no self-hosting needed). Grand Slang (display/numerals)
// and Whyte (calm statement headlines) are self-hosted via fonts.css.
import { Hanken_Grotesk } from "next/font/google";

export const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hanken",
  display: "swap",
  fallback: ["system-ui", "Arial", "sans-serif"],
});
