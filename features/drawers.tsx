"use client";
import type { ReactNode } from "react";

/** Isi panel detail menurut jenis. Diisi bertahap saat modul dipindahkan. */
export function renderDrawer(kind: string, id: string, close: () => void): ReactNode {
  return (
    <>
      <div className="dhead">
        <div>
          <h2 style={{ fontSize: 20 }}>Detail {kind}</h2>
          <p style={{ margin: "2px 0 6px", color: "var(--ink2)" }}>{id}</p>
        </div>
        <button className="btn small" onClick={close} aria-label="Tutup">
          Tutup
        </button>
      </div>
      <div className="empty">Panel detail modul ini sedang dipindahkan.</div>
    </>
  );
}
