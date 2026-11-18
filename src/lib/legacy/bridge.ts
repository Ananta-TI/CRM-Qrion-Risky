"use client";
/* Jembatan antara mesin modul (gaya Firestore) dan lapisan data/auth Next.js. */
import { db } from "@/lib/data/db";
import { supabase } from "@/lib/auth/supabase";

type QR = {
  acct: Record<string, any> | null;
  view: string;
  toast: (t: string, bad?: boolean) => void;
  logout: () => void;
  setSim: (v: string) => void;
  nav: (h: string) => void;
  remote: boolean;
  setPassword: (u: string, pw: string) => Promise<void>;
  dropUser: (u: string) => Promise<void>;
};
export const QR: QR = { acct: null, view: "ringkasan", toast: () => {}, logout: () => {}, setSim: () => {},
  nav: () => {},
  remote: !!supabase,
  setPassword: async (uname, pw) => {
    if (!supabase) return;
    const { error } = await supabase.rpc("qrion_set_password", { uname, pw });
    if (error) throw new Error(/function .* does not exist|schema cache/i.test(error.message) ? "Fungsi akun belum dipasang. Jalankan ulang supabase/setup_all.sql." : error.message);
  },
  dropUser: async (uname) => {
    if (!supabase) return;
    const { error } = await supabase.rpc("qrion_drop_user", { uname });
    if (error) throw new Error(error.message);
  },
};

const strip = (d: any) => {
  const { id, ...rest } = d;
  return rest;
};
const split = (path: string) => {
  const i = path.lastIndexOf("/");
  return [path.slice(0, i), path.slice(i + 1)] as const;
};
const listSnap = (col: string, order?: [string, string], lim?: number) => {
  let l = db.list(col).slice();
  if (order) {
    const [f, dir] = order;
    l.sort((a: any, b: any) => (a[f] > b[f] ? 1 : a[f] < b[f] ? -1 : 0) * (dir === "desc" ? -1 : 1));
  }
  if (lim) l = l.slice(0, lim);
  return { docs: l.map((d) => ({ id: d.id, exists: true, data: () => strip(d) })), size: l.length };
};
function watch(col: string, emit: () => void) {
  let last = db.list(col);
  emit();
  return db.subscribe(() => {
    const n = db.list(col);
    if (n !== last) {
      last = n;
      emit();
    }
  });
}
function colRef(col: string, order?: [string, string], lim?: number): any {
  return {
    doc: (id?: string) => docRef(col, id || db.rid()),
    orderBy: (f: string, dir = "asc") => colRef(col, [f, dir], lim),
    limit: (n: number) => colRef(col, order, n),
    onSnapshot: (ok: (s: any) => void) => watch(col, () => ok(listSnap(col, order, lim))),
    get: async () => listSnap(col, order, lim),
  };
}
function docRef(col: string, id: string): any {
  const snap = () => {
    const d = db.get(col, id);
    return { id, exists: !!d, data: () => (d ? strip(d) : undefined) };
  };
  return {
    id,
    set: async (data: any) => void db.set(col, id, data),
    update: async (patch: any) => {
      if (!db.get(col, id)) throw Object.assign(new Error("Data tidak ditemukan."), { code: "not-found" });
      db.update(col, id, patch);
    },
    delete: async () => void db.remove(col, id),
    get: async () => snap(),
    onSnapshot: (ok: (s: any) => void) => {
      let last = JSON.stringify(db.get(col, id) || null);
      ok(snap());
      return db.subscribe(() => {
        const n = JSON.stringify(db.get(col, id) || null);
        if (n !== last) {
          last = n;
          ok(snap());
        }
      });
    },
  };
}
const fsDb = {
  collection: (p: string) => colRef(p),
  doc: (p: string) => {
    const [c, i] = split(p);
    return docRef(c, i);
  },
};

const toBlob = (data: any, type?: string) => (data instanceof Blob ? data : new Blob([data], { type: type || "application/octet-stream" }));
const downloads = {
  async save({ filename, data }: { filename: string; data: any }) {
    const blob = toBlob(data, /\.csv$/i.test(filename) ? "text/csv;charset=utf-8" : undefined);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  },
};
const assets = {
  async upload(f: File) {
    if (supabase) {
      const path = `${(QR.acct && QR.acct.id) || "x"}/${Date.now()}-${f.name.replace(/[^\w.\-]+/g, "_")}`;
      const { error } = await supabase.storage.from("assets").upload(path, f, { contentType: f.type || undefined });
      if (error) throw error;
      const { data } = supabase.storage.from("assets").getPublicUrl(path);
      return { id: path, url: data.publicUrl, contentType: f.type, sizeBytes: f.size };
    }
    const url: string = await new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.onerror = () => rej(r.error);
      r.readAsDataURL(f);
    });
    return { id: "l" + Date.now(), url, contentType: f.type, sizeBytes: f.size };
  },
};
const user = {
  id: async () => (QR.acct ? QR.acct.id : null),
  isOwner: async () => !!QR.acct && QR.acct.role === "admin",
  can: async () => true,
  profiles: async () => ({}),
};

let booting: Promise<void> | null = null;
/** Pasang shim `window.claude` lalu jalankan mesin modul sekali per muatan halaman. */
export function bootLegacy(): Promise<void> {
  if (booting) return booting;
  (window as any).__QR = QR;
  (window as any).claude = { use: async (n: string) => ({ db: fsDb, user, downloads, assets } as any)[n] };
  db.onError((m) => QR.toast(m, true));
  booting = import("./runtime").then((m) => {
    m.default();
    return new Promise<void>((resolve) => {
      let n = 0;
      const t = setInterval(() => {
        const api = (window as any).__QR_API;
        if ((api && api.ready()) || ++n > 100) {
          clearInterval(t);
          resolve();
        }
      }, 50);
    });
  });
  return booting;
}
export const legacyApi = () => (window as any).__QR_API as {
  go: () => void;
  setSim: (v: string) => void;
  rerender: () => void;
  openDrawer: (k: string, id: string) => void;
  simV: () => string;
  search: (q: string) => void;
};
export const legacyBooted = () => !!booting;
export function syncSim(want: string) {
  if (!booting) return;
  const api = (window as any).__QR_API;
  if (api && api.simV() !== want) api.setSim(want);
}
/** Minta mesin legacy menggambar ulang (mis. setelah akun/sesi berubah). */
export function refreshLegacy() {
  if (!booting) return;
  const api = (window as any).__QR_API;
  if (api) api.rerender();
}
