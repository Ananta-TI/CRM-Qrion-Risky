"use client";
import { useCallback } from "react";
import { useSession } from "@/lib/auth/session";

/** Nama tampilan untuk id pengguna: akun login ("a:id"), nama programmer/AM biasa, atau kosong. */
export function useNameOf() {
  const { accounts, acct } = useSession();
  return useCallback(
    (id?: string | null) => {
      if (!id) return "Belum ditugaskan";
      if (String(id).slice(0, 2) === "a:") {
        const a = accounts.find((x) => x.id === String(id).slice(2));
        return a ? a.nama || a.id : "@" + String(id).slice(2);
      }
      if (acct && id === "a:" + acct.id) return "Saya";
      return id;
    },
    [accounts, acct],
  );
}
