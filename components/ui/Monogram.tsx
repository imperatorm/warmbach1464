/**
 * W// — die offizielle, eingetragene Wortmarke (DPMA Reg.-Nr. 30 2026 207 672),
 * as the two supplied vector files: a black W for light grounds
 * (public/warmbach_wy_logo_b.svg) and a white W for dark grounds
 * (public/warmbach_wy_logo_w.svg). The slashes are gold in both.
 *
 * `on` names the ground the mark sits on and is required, so the variant is
 * always a decision at the call site — never a default that happens to be
 * invisible on the page it lands on.
 */
export function Monogram({
  className = "",
  on,
}: {
  className?: string;
  /** The background behind the mark: "light" gets the black W, "dark" the white W. */
  on: "light" | "dark";
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={on === "light" ? "/warmbach_wy_logo_b.svg" : "/warmbach_wy_logo_w.svg"}
      alt="1464 by W"
      width={293}
      height={331}
      draggable={false}
      className={`${className} select-none object-contain`}
    />
  );
}
