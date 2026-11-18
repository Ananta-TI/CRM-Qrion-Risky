"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { db, remoteMode, useCollection, type Doc } from "@/lib/data/db";
import { supabase, emailOf, usernameOf } from "./supabase";
import { ITER, normU, pbk, unb64 } from "./auth";
import { DEF_ACCESS } from "@/lib/core";

type Sim = { v: string; key: string; id: string; label: string } | null;
type Ctx = {
  /** true setelah status sesi diketahui (bukan berarti data sudah selesai dimuat). */
  ready: boolean;
  /** Username dari sesi Supabase. Null pada mode lokal atau saat belum masuk. */
  authName: string | null;
  acct: Doc | null;
  sim: Sim;
  setSim: (v: string) => void;
  login: (u: string, pw: string) => Promise<string>;
  logout: () => Promise<void>;
  accounts: Doc[];
};
const SessionCtx = createContext<Ctx | null>(null);
const TOK = "qrion-acct";

export function SessionProvider({ children }: { children: ReactNode }) {
  const accounts = useCollection("accounts");
  const accessDoc = useCollection("settings").find((d) => d.id === "access");
  const [tok, setTok] = useState<{ u: string; h: string } | null>(null);
  const [ready, setReady] = useState(false);
  const [sim, setSimState] = useState<Sim>(null);
  const [fails, setFails] = useState({ n: 0, until: 0 });
  const [authName, setAuthName] = useState<string | null>(null);

  useEffect(() => {
    if (supabase) {
      let off = false;
      (async () => {
        try {
          // Jangan biarkan refresh menggantung bila jaringan lambat.
          const res: any = await Promise.race([supabase!.auth.getSession(), new Promise((r) => setTimeout(() => r(null), 6000))]);
          const em = res?.data?.session?.user?.email;
          if (off) return;
          if (em) {
            // Sesi ada: tampilkan "memuat data" (bukan form login), lalu muat datanya.
            setAuthName(usernameOf(em));
            setReady(true);
            await db.init();
          } else {
            setReady(true);
          }
        } catch {
          if (!off) setReady(true);
        }
      })();
      const { data: sub } = supabase.auth.onAuthStateChange((ev, session) => {
        if (ev === "SIGNED_OUT") {
          db.clear();
          setAuthName(null);
          setSimState(null);
          return;
        }
        const em = session?.user?.email;
        if (!em) return;
        setAuthName(usernameOf(em));
        // Masuk dari tab lain: pastikan data CRM ikut dimuat.
        if (ev === "SIGNED_IN") void db.init();
      });
      return () => {
        off = true;
        sub.subscription.unsubscribe();
      };
    }
    try {
      setTok(JSON.parse(sessionStorage.getItem(TOK) || "null"));
    } catch {}
    setReady(true);
  }, []);

  const acct = useMemo(() => {
    if (remoteMode) {
      const a = authName ? accounts.find((x) => x.id === authName) : null;
      return a && a.aktif !== false ? a : null;
    }
    if (!tok) return null;
    const a = accounts.find((x) => x.id === tok.u);
    return a && a.aktif !== false && a.hash === tok.h ? a : null;
  }, [tok, accounts, authName]);

  const login = useCallback(
    async (uRaw: string, pw: string) => {
      const now = Date.now();
      if (fails.until > now) return `Terlalu banyak percobaan. Coba lagi dalam ${Math.ceil((fails.until - now) / 1000)} detik.`;
      const u = normU(uRaw);
      if (!u || !pw) return "Isi username dan password.";
      if (supabase) {
        const { error } = await supabase.auth.signInWithPassword({ email: emailOf(u), password: pw });
        if (error) {
          const n = fails.n + 1;
          if (n >= 5) {
            setFails({ n: 0, until: Date.now() + 30000 });
            return "Terlalu banyak percobaan. Tunggu 30 detik.";
          }
          setFails({ n, until: 0 });
          return /invalid login/i.test(error.message) ? "Username atau password salah." : error.message;
        }
        setFails({ n: 0, until: 0 });
        setAuthName(u);
        await db.init();
        if (db.status === "error") {
          const m = db.error;
          await supabase.auth.signOut();
          return m || "Gagal memuat data.";
        }
        const a = db.get("accounts", u) as Doc | null;
        if (!a || a.aktif === false) {
          await supabase.auth.signOut();
          return "Akun tidak aktif atau belum terdaftar di CRM.";
        }
        return "";
      }
      try {
        const a = accounts.find((x) => x.id === u);
        const salt = a && a.salt ? unb64(a.salt) : new Uint8Array(16);
        const h = await pbk(pw, salt, (a && a.iter) || ITER);
        if (a && a.aktif !== false && h === a.hash) {
          setFails({ n: 0, until: 0 });
          const t = { u: a.id, h: a.hash };
          sessionStorage.setItem(TOK, JSON.stringify(t));
          setTok(t);
          return "";
        }
        const n = fails.n + 1;
        if (n >= 5) {
          setFails({ n: 0, until: Date.now() + 30000 });
          return "Terlalu banyak percobaan. Tunggu 30 detik.";
        }
        setFails({ n, until: 0 });
        return "Username atau password salah.";
      } catch (e: any) {
        return e?.message || "Gagal memeriksa sandi.";
      }
    },
    [accounts, fails],
  );

  /** Keluar: cabut sesi server, dengan batas waktu agar tidak menggantung. */
  const logout = useCallback(async () => {
    if (supabase) {
      try {
        await Promise.race([supabase.auth.signOut(), new Promise((r) => setTimeout(r, 4000))]);
      } catch {}
      // Jaring pengaman bila jaringan macet: bersihkan sesi lokal.
      try {
        await supabase.auth.signOut({ scope: "local" });
      } catch {}
      db.clear();
      setAuthName(null);
      setSimState(null);
      return;
    }
    try {
      sessionStorage.removeItem(TOK);
    } catch {}
    setTok(null);
    setSimState(null);
  }, []);

  const setSim = useCallback(
    (v: string) => {
      if (!v) return setSimState(null);
      const [t, x] = v.split(/:(.+)/);
      const acc = (accessDoc && (accessDoc as any).roles) || DEF_ACCESS;
      if (t === "prog") setSimState({ v, key: "programmer", id: x, label: "Programmer " + x });
      else {
        const nm = (acc[x] || {}).name || x;
        setSimState({ v, key: x, id: nm + " (simulasi)", label: nm });
      }
    },
    [accessDoc],
  );

  const value = useMemo(
    () => ({ ready, authName, acct, sim, setSim, login, logout, accounts }),
    [ready, authName, acct, sim, setSim, login, logout, accounts],
  );
  return <SessionCtx.Provider value={value}>{children}</SessionCtx.Provider>;
}
export const useSession = () => {
  const c = useContext(SessionCtx);
  if (!c) throw new Error("SessionProvider belum dipasang");
  return c;
};
