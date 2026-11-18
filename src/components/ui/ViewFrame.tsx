import type { ReactNode } from "react";

/**
 * Kerangka halaman modul: header seragam, banner, toolbar, lalu badan halaman.
 * Markup kelasnya sama dengan yang dihasilkan mesin legacy (`runtime.ts`) agar
 * semua modul punya header yang identik.
 */
export default function ViewFrame({
  title,
  sub,
  action,
  bar,
  banner,
  children,
}: {
  title: string;
  sub?: string;
  action?: ReactNode;
  bar?: ReactNode;
  banner?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <header className="page-head">
        <div className="page-head-main">
          <h1>{title}</h1>
          <p>{sub || ""}</p>
        </div>
        {action ? <div className="page-head-actions">{action}</div> : null}
      </header>
      {banner}
      {bar ? <div className="toolbar">{bar}</div> : null}
      <div id="vbody">{children}</div>
    </>
  );
}
