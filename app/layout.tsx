import type { Metadata } from "next";
import "./globals.css";
import { JarvisBridge } from "@/components/dev/JarvisBridge";
import { Navigation } from "@/components/ui/Navigation";
import { Footer } from "@/components/ui/Footer";
import { AgeGate } from "@/components/ui/AgeGate";
import { Cursor } from "@/components/ui/Cursor";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { PageTransition } from "@/components/providers/PageTransition";
import { display, body } from "./fonts";

export const metadata: Metadata = {
  title: "1464byW — Warmbachhof Kitzbühel",
  description: "Edelbrand-Destillerie aus Kitzbühel. Erstmals 1464 im Salbuch verzeichnet. From our Soil to your Soul.",
  metadataBase: new URL("https://warmbachhof.com"),
  openGraph: {
    title: "1464byW — Warmbachhof Kitzbühel",
    description: "Sechsundzwanzig Generationen. Eine Quelle. Ein Osthang.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${display.variable} ${body.variable} bg-night`}>
      <head>
        {/* Preload the hero LCP poster (what the home hero actually paints) so it is fetched in parallel with the document */}
        <link rel="preload" href="/video/alpine-poster.jpg" as="image" type="image/jpeg" />
      </head>
      <body className="bg-night text-cream font-body antialiased min-h-screen">
        <SmoothScroll />
        <Cursor />
        <AgeGate />
        <Navigation />
        <main>
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        {(process.env.NODE_ENV !== "production" || process.env.JARVIS_INSTRUMENT === "1") && <JarvisBridge />}
      </body>
    </html>
  );
}
