/**
 * W// — die offizielle, eingetragene Wortmarke (DPMA Reg.-Nr. 30 2026 207 672),
 * aus den gelieferten SVG-Logodateien. Zwei Fassungen, beide mit den gelben
 * Schrägstrichen (#facd1a):
 *
 *   invert (Standard) → weißes W, für dunkle Flächen (night, Hero, Footer)
 *   dark              → schwarzes W, für helle Flächen (cream, z. B. die Nav)
 *
 * Die Farben stecken in der Datei, nicht in `currentColor` — `text-*`-Klassen
 * haben hier also keine Wirkung, die Fassung wird über `variant` gewählt.
 */
const SRC = {
  invert: "/warmbach_wy_logo_w.svg",
  dark: "/warmbach_wy_logo_b.svg",
} as const;

export function Monogram({
  className = "",
  variant = "invert",
}: {
  className?: string;
  variant?: keyof typeof SRC;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={SRC[variant]}
      alt="1464 by W"
      draggable={false}
      className={`${className} select-none object-contain`}
    />
  );
}
