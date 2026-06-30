/**
 * W// — die offizielle, eingetragene Wortmarke (DPMA Reg.-Nr. 30 2026 207 672),
 * aus der gelieferten Logodatei. Schwarzer Hintergrund entfernt → transparent
 * (public/logo-w.png): weißes W + goldene Schrägstriche, für dunkle Flächen.
 */
export function Monogram({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-w.png"
      alt="1464 by W"
      draggable={false}
      className={`${className} select-none object-contain`}
    />
  );
}
