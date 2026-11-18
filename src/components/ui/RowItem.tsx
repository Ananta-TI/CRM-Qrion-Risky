"use client";
import type { ReactNode } from "react";
import { useRowNav } from "./RowNav";

/** Baris klik yang membuka panel detail modul terkait. */
export function RowItem({ kind, id, title, sub, right }: { kind: string; id: string; title: ReactNode; sub: ReactNode; right?: ReactNode }) {
  const open = useRowNav();
  return (
    <button className="rowi" onClick={() => open(kind, id)}>
      <span>
        <span className="t">{title}</span>
        <small>{sub}</small>
      </span>
      {right}
    </button>
  );
}
