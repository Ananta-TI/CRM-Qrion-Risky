"use client";
import { createContext, useCallback, useContext, type ReactNode } from "react";
import { useRouter } from "next/navigation";

/** Modul tujuan saat sebuah baris diklik. Tiket memakai parameter `t`, modul lain `o`. */
const ROUTES: Record<string, string> = { isu: "isu", sekolah: "sekolah", project: "project", pipeline: "pipeline" };

const RowNavCtx = createContext<(kind: string, id: string) => void>(() => {});

/** Membuka detail sebuah baris: pindah ke modulnya lalu minta panel detail dibuka. */
export const useRowNav = () => useContext(RowNavCtx);

export function RowNavProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const open = useCallback(
    (kind: string, id: string) => {
      const view = ROUTES[kind] || kind;
      const query = kind === "isu" ? "t=" + encodeURIComponent(id) : "o=" + encodeURIComponent(kind + ":" + id);
      router.push("/" + view + "?" + query);
    },
    [router],
  );
  return <RowNavCtx.Provider value={open}>{children}</RowNavCtx.Provider>;
}
