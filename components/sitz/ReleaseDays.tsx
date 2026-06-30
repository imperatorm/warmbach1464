"use client";

import { useEffect, useState } from "react";
import { daysUntil } from "@/lib/founders/release";
import { formatInt } from "@/lib/time";

/**
 * Days-until-release, computed on the client so a statically prerendered page
 * does not freeze the count at build time (mirrors ReleaseTimeline). Shows "—"
 * until hydration, then the live value.
 */
export function ReleaseDays({ targetISO }: { targetISO: string }) {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    setDays(daysUntil(targetISO));
  }, [targetISO]);
  return <>{days === null ? "—" : `${formatInt(days)} Tage`}</>;
}
