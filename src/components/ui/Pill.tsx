"use client";
import type { ReactNode } from "react";

/** Label status kecil (mis. "Aktif", "Terlambat"). Warna mengikuti kelas tone: good, warn, crit, info. */
export function Pill({ t, c }: { t: ReactNode; c?: string }) {
  return <span className={"pill " + (c || "")}>{t}</span>;
}
