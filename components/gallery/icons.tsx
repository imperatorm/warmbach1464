/**
 * The gallery's drawn icon set. One stroke weight (1.3), one cap style, one
 * 14×14 box — the same hand as the Säulen door chevron, so a control in the
 * lightbox reads as part of the house rather than as a typed character.
 */
type IconProps = { className?: string };

const BASE = {
  viewBox: "0 0 14 14",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true,
  stroke: "currentColor",
  strokeWidth: 1.3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ChevronLeft({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg {...BASE} className={className}>
      <path d="M9.02 11.12 4.52 6.62l4.5-4.5" />
    </svg>
  );
}

export function ChevronRight({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg {...BASE} className={className}>
      <path d="M4.98 11.12 9.48 6.62l-4.5-4.5" />
    </svg>
  );
}

export function Close({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg {...BASE} className={className}>
      <path d="M3 3l8 8M11 3l-8 8" />
    </svg>
  );
}

/** The four-way drag hint on the pannable table. */
export function Pan({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg {...BASE} className={className}>
      <path d="M7 1.6v10.8M1.6 7h10.8M5.2 3.4 7 1.6l1.8 1.8M5.2 10.6 7 12.4l1.8-1.8M3.4 5.2 1.6 7l1.8 1.8M10.6 5.2 12.4 7l-1.8 1.8" />
    </svg>
  );
}
