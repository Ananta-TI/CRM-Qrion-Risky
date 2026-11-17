"use client";
import LegacyIsland from "./LegacyIsland";
import Ringkasan from "./ringkasan/Ringkasan";

/** Peta modul -> komponen. Modul yang belum dipindahkan menampilkan placeholder. */
const REGISTRY: Record<string, React.ComponentType> = { ringkasan: Ringkasan };

export default function ViewRouter({ view }: { view: string }) {
  const View = REGISTRY[view];
  if (View) return <View />;
  return <LegacyIsland view={view} />;
}
