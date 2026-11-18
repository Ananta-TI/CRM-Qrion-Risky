import Link from "next/link";
import type { ReactNode } from "react";

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
