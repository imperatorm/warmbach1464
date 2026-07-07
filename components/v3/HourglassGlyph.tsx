/**
 * The Sanduhr — the recurring brand device of the v3 redesign. Not a clock:
 * Warmbach measures time in maturation (36 Monate im Glasballon) and heritage
 * (Salbuch 1464), so the mark is an hourglass drawn as thin line-art with an
 * optional sand fill. Pure SVG, themable via currentColor.
 *
 * `sand` (0–1) controls how far the sand has run: 0 = all sand in the upper
 * bulb, 1 = all in the lower. Default 0.5 renders the emblematic mid-fall.
 */
export function HourglassGlyph({
  className,
  sand = 0.5,
  strokeWidth = 1.5,
  showSand = true,
}: {
  className?: string;
  sand?: number;
  strokeWidth?: number;
  showSand?: boolean;
}) {
  const s = Math.min(1, Math.max(0, sand));
  // Geometry: viewBox 100×160. Bulbs meet at the neck (y=80).
  // Upper sand: a triangle-ish heap that recedes toward the neck as s→1.
  // Lower sand: a heap that grows from the floor as s→0→1.
  const upperTop = 22 + s * 50; // sand surface in the upper bulb sinks
  const lowerTop = 138 - s * 44; // sand heap in the lower bulb rises

  return (
    <svg
      viewBox="0 0 100 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Frame: top & bottom plates */}
      <line x1="14" y1="6" x2="86" y2="6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="14" y1="154" x2="86" y2="154" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />

      {/* Glass: two bulbs pinched at the neck */}
      <path
        d="M22 8 C22 42 40 62 47 76 C48.5 78.5 48.5 81.5 47 84 C40 98 22 118 22 152"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M78 8 C78 42 60 62 53 76 C51.5 78.5 51.5 81.5 53 84 C60 98 78 118 78 152"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {showSand && (
        <g fill="currentColor" opacity="0.5">
          {/* Upper sand body — clipped by the sinking surface */}
          {s < 1 && (
            <path
              d={`M${26 + (upperTop - 22) * 0.28} ${upperTop} L${74 - (upperTop - 22) * 0.28} ${upperTop} C${66 - s * 8} ${upperTop + 18} 52 ${72 - s * 4} 50 78 C48 ${72 - s * 4} ${34 + s * 8} ${upperTop + 18} ${26 + (upperTop - 22) * 0.28} ${upperTop} Z`}
            />
          )}
          {/* Falling thread */}
          {s > 0.02 && s < 0.98 && <rect x="49.2" y="80" width="1.6" height={lowerTop - 82} rx="0.8" opacity="0.85" />}
          {/* Lower heap */}
          {s > 0 && (
            <path
              d={`M${28 + (150 - lowerTop) * 0.1} 150 L${72 - (150 - lowerTop) * 0.1} 150 C${64} ${lowerTop + (150 - lowerTop) * 0.4} 54 ${lowerTop + 2} 50 ${lowerTop} C46 ${lowerTop + 2} ${36} ${lowerTop + (150 - lowerTop) * 0.4} ${28 + (150 - lowerTop) * 0.1} 150 Z`}
            />
          )}
        </g>
      )}
    </svg>
  );
}
