import type { ReactNode } from "react";

/** Daftar baris; tampilkan pesan kosong bila tidak ada isi. */
export function Rows({ children, empty, count }: { children: ReactNode; empty: string; count: number }) {
  return count ? <div className="rows">{children}</div> : <div className="empty">{empty}</div>;
}
