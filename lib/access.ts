"use client";
import { useMemo } from "react";
import { useCollection } from "./db";
import { useSession } from "./session";
import { DEF_ACCESS, VIEWS } from "./core";

export type AccessMap = Record<string, { name: string; home: string; access: Record<string, number> }>;

/** Hak akses pengguna saat ini (mengikuti aturan prototipe: admin = akses penuh, peran lain dari matriks). */
export function useAccess() {
  const { acct, sim } = useSession();
  const settings = useCollection("settings");
  const ACC: AccessMap = useMemo(() => {
    const d: any = settings.find((s) => s.id === "access");
    return (d && d.roles) || (DEF_ACCESS as AccessMap);
  }, [settings]);
  return useMemo(() => {
    const own = !!acct && acct.role === "admin" && !sim;
    const roleKey: string | null = sim ? sim.key : acct ? acct.role : null;
    const role = own ? "admin" : roleKey && ACC[roleKey] ? roleKey : null;
    const lvl = (v: string) => (own ? 9 : role ? +(ACC[role].access[v] || 0) : 0);
    const can = (k: string) => lvl(k) >= 2;
    const allowed = (v: string) => (v === "keluar" ? own : v === "catatan" || v === "absen" ? true : v === "tim" ? own : lvl(v) >= 1);
    const roleName = (k: string | null) => (k === "admin" ? "Super Admin" : (k && ACC[k]?.name) || "Peran belum ditentukan");
    const homeView = () => {
      const h = (roleKey && ACC[roleKey]?.home) || (own ? "ringkasan" : null);
      if (h && allowed(h)) return h;
      const f = VIEWS.find((v: any) => allowed(v[0]));
      return f ? f[0] : null;
    };
    return {
      ACC,
      own,
      role,
      roleKey,
      lvl,
      can,
      allowed,
      roleName,
      homeView,
      canNew: () => can("isu") && (own || !(role && +ACC[role].access.isuNo)),
      canHandle: () => lvl("isu") >= 3,
      canPlan: () => lvl("project") >= 3,
      isAdmin: own,
    };
  }, [acct, sim, ACC]);
}
