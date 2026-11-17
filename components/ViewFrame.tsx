import type { ReactNode } from "react";

/** Kerangka halaman modul: judul, subjudul, aksi, toolbar, dan badan (sama dengan struktur DOM prototipe). */
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
      <div className="head">
        <div>
          <h1>{title}</h1>
          <p>{sub || ""}</p>
        </div>
        {action}
      </div>
      {banner}
      {bar ? <div className="toolbar">{bar}</div> : null}
      <div id="vbody">{children}</div>
    </>
  );
}
