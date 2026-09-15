import type { Metadata } from "next";
import "./globals.css";
import { JarvisBridge } from "@/components/dev/JarvisBridge";
import { Navigation } from "@/components/ui/Navigation";
import { Footer } from "@/components/ui/Footer";
import { AgeGate } from "@/components/ui/AgeGate";
import { Cursor } from "@/components/ui/Cursor";
import { EntryVeil } from "@/components/ui/EntryVeil";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { PageTransition } from "@/components/providers/PageTransition";
import { hankenGrotesk } from "./fonts";

export const metadata: Metadata = {
  title: "1464byW — Warmbachhof Kitzbühel",
  description: "Edelbrand-Destillerie aus Kitzbühel. Erstmals 1464 im Salbuch verzeichnet. From our Soil to your Soul.",
  metadataBase: new URL("https://warmbachhof.com"),
  openGraph: {
    title: "1464byW — Warmbachhof Kitzbühel",
    description: "Sechsundzwanzig Generationen. Eine Quelle. Ein Osthang.",
    type: "website",
    images: [{ url: "/og/default.jpg", alt: "Die Warmbach-Flasche, liegend auf Stein" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${hankenGrotesk.variable} bg-night`}>
      <head>
        {/* Preload the hero LCP image (what the home hero actually paints) so it is fetched in parallel with the document */}
        <link rel="preload" href="/figma/hero-bar-interior.jpg" as="image" type="image/jpeg" />
      </head>
      <body className="bg-night text-cream font-body antialiased min-h-screen">
        <SmoothScroll />
        <Cursor />
        <EntryVeil />
        <AgeGate />
        {/* Everything the age gate has to seal off. AgeGate marks this subtree
            inert while it is open, so nothing behind the threshold is
            focusable, readable to a screen reader, or clickable. */}
        <div id="app-root">
          <Navigation />
          <main>
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </div>
        {(process.env.NODE_ENV !== "production" || process.env.JARVIS_INSTRUMENT === "1") && <JarvisBridge />}
      </body>
    </html>
  );
}
