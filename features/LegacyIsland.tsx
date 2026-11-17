"use client";
import { useEffect } from "react";
import { QR, bootLegacy, legacyApi, syncSim } from "@/lib/legacy/bridge";
import { useSession } from "@/lib/session";

/** Menampung modul yang dirender oleh mesin modul. Elemen #legacy-island diisi oleh mesin, bukan React. */
export default function LegacyIsland({ view }: { view: string }) {
  const { sim } = useSession();
  useEffect(() => {
    let off = false;
    const sp = new URLSearchParams(window.location.search);
    const q = sp.get("q");
    const o = sp.get("o") || (sp.get("t") ? "isu:" + sp.get("t") : "");
    QR.view = view;
    bootLegacy().then(() => {
      if (off) return;
      const api = legacyApi();
      api.go();
      syncSim(sim ? sim.v : "");
      if (q) api.search(q);
      if (o) {
        const [k, id] = String(o).split(/:(.+)/);
        if (k && id) api.openDrawer(k, id);
      }
    });
    return () => {
      off = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);
  return (
    <>
      <div id="legacy-island" suppressHydrationWarning>
        <div className="head">
          <div>
            <p>Memuat data…</p>
          </div>
        </div>
      </div>
      <div id="lscrim" className="scrim" hidden />
      <aside id="ldrawer" className="drawer" hidden aria-label="Detail" />
      <div id="lmodal" className="modal" hidden />
    </>
  );
}
