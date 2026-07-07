/**
 * SVG "gooey" filter (Floema's meta-row bridges, done as a filter): blur the
 * source, push the alpha contrast so mid-tones snap to solid, then composite
 * the crisp source back on top. Elements whose backgrounds come close merge
 * with a liquid neck. Reference one instance by id via `filter: url(#id)`.
 */
export function GooFilter({ id, blur = 6 }: { id: string; blur?: number }) {
  return (
    <svg aria-hidden className="pointer-events-none absolute h-0 w-0">
      <defs>
        <filter id={id} x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}
