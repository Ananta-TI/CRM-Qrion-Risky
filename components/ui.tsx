"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import { useDrawer } from "./Drawer";

export function Pill({ t, c }: { t: ReactNode; c?: string }) {
  return <span className={"pill " + (c || "")}>{t}</span>;
}

/** Panel dengan judul dan tautan "Semua ..." (sama dengan pn() di prototipe). */
export function Panel({ title, link, linkLabel, children }: { title: ReactNode; link?: string; linkLabel?: string; children: ReactNode }) {
  return (
    <section className="panel">
      <header>
        <h2>{title}</h2>
        {link ? <Link href={"/" + link}>{linkLabel}</Link> : null}
      </header>
      {children}
    </section>
  );
}

export function Rows({ children, empty, count }: { children: ReactNode; empty: string; count: number }) {
  return count ? <div className="rows">{children}</div> : <div className="empty">{empty}</div>;
}

/** Baris klik yang membuka panel detail (drawer). */
export function RowItem({ kind, id, title, sub, right }: { kind: string; id: string; title: ReactNode; sub: ReactNode; right?: ReactNode }) {
  const { open } = useDrawer();
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

export function Bars({ items }: { items: { label: ReactNode; value: number; text: ReactNode }[] }) {
  const mx = Math.max(1, ...items.map((x) => x.value));
  return (
    <div className="bars">
      {items.map((x, i) => (
        <div className="bar" key={i}>
          <span>{x.label}</span>
          <div className="track">
            <i style={{ width: (x.value / mx) * 100 + "%" }} />
          </div>
          <strong>{x.text}</strong>
        </div>
      ))}
    </div>
  );
}
