"use client";

import { useEffect, useState } from "react";
import { daysSince1464, formatInt } from "@/lib/time";

/** The one figure on the sheet that is still moving: days since the Salbuch entry. */
export function FmLiveDays() {
  const [days, setDays] = useState<string | null>(null);
  useEffect(() => setDays(formatInt(daysSince1464())), []);
  return <span className="tabular-nums">{days ?? "—"}</span>;
}
