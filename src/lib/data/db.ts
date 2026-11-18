"use client";
/* Lapisan data. Saat ini memakai JSON dummy + localStorage.
   Untuk produksi, ganti isi fungsi di file ini dengan pemanggilan API/DB; antarmuka (collection, get, set, update, remove) tetap. */
import { useSyncExternalStore } from "react";
import { resolveAll } from "./tokens";
import { supabase } from "@/lib/auth/supabase";
import { loadAll, loadCol, opsFor, deleteOps, enqueue, busy, colsOfTable, TABLES, type Ctx } from "./remote";
import accounts from "@data/accounts.json";
import absensi from "@data/absensi.json";
import audit from "@data/audit.json";
import branding from "@data/branding.json";
import catatan from "@data/catatan.json";
import invoices from "@data/invoices.json";
import issues from "@data/issues.json";
import leads from "@data/leads.json";
import mou from "@data/mou.json";
import pembayaran from "@data/pembayaran.json";
import pengeluaran from "@data/pengeluaran.json";
import projects from "@data/projects.json";
import roles from "@data/roles.json";
import schools from "@data/schools.json";
import settings from "@data/settings.json";
import surat from "@data/surat.json";
import suratTpl from "@data/suratTpl.json";
import team from "@data/team.json";

export type Doc = Record<string, any> & { id: string };
type Store = Record<string, Record<string, Record<string, any>>>;

const SEED: Store = { accounts, absensi, audit, branding, invoices, issues, leads, mou, pembayaran, pengeluaran, projects, roles, schools, settings, surat, suratTpl, team } as any;
const CATATAN: Record<string, any> = catatan as any;
const KEY = "qrion-next-db-v2";
const EMPTY: Doc[] = [];

let store: Store | null = null;
export const remoteMode = !!supabase;
let status: "idle" | "loading" | "ready" | "error" = "idle";
let lastError = "";
let channel: any = null;
const errListeners = new Set<(m: string) => void>();
const fail = (m: string) => {
  lastError = m;
  errListeners.forEach((f) => f(m));
};
const listeners = new Set<() => void>();
function mkCtx(): Ctx {
  const s = () => store || {};
  return {
    exists: (t, id) => {
      if (t === "schools" || t === "invoices") return !!(s()[t] || {})[id];
      if (t === "products") return (((s().settings || {}).products || {}).items || []).some((p: any) => p.id === id);
      if (t === "app_roles") return id === "admin" || !!((((s().settings || {}).access || {}).roles || {})[id]);
      return true;
    },
    schoolByName: (n) => {
      const e = Object.entries(s().schools || {}).find(([, d]) => String((d as any).name || "").trim().toLowerCase() === String(n || "").trim().toLowerCase());
      return e ? e[0] : null;
    },
  };
}
function save(col: string, id: string, doc: any) {
  if (!supabase) return;
  let ops;
  try {
    ops = opsFor(col, id, doc, mkCtx());
  } catch (e: any) {
    fail("Gagal menyimpan: " + (e?.message || e));
    return;
  }
  enqueue(supabase, ops, (m) => {
    fail(m);
    reloadCols([col === "settings" || /^data\/users\//.test(col) ? col : col, "settings"]);
  });
}
const reloadTimer: { t: any } = { t: null };
const pendingCols = new Set<string>();
function reloadCols(cols: string[]) {
  cols.forEach((c) => pendingCols.add(c));
  clearTimeout(reloadTimer.t);
  reloadTimer.t = setTimeout(async () => {
    if (busy()) return reloadCols([]);
    const cs = [...pendingCols];
    pendingCols.clear();
    if (!supabase) return;
    try {
      for (const c of cs) {
        const d = await loadCol(supabase, c);
        const s = load();
        if (c === "notes") {
          Object.keys(s).filter((k) => k.startsWith("data/users/")).forEach((k) => delete s[k]);
          Object.assign(s, d);
        } else s[c] = d as any;
        Object.keys(c === "notes" ? s : { [c]: 1 }).forEach((k) => bump(k));
      }
    } catch {}
  }, 700);
}
const cache = new Map<string, { v: number; list: Doc[] }>();
const versions = new Map<string, number>();

function load(): Store {
  if (store) return store;
  if (remoteMode) {
    store = {};
    return store;
  }
  let s: Store | null = null;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) s = JSON.parse(raw);
  } catch {}
  if (!s) {
    s = resolveAll(JSON.parse(JSON.stringify(SEED))) as Store;
    const n = resolveAll(JSON.parse(JSON.stringify(CATATAN))) as Record<string, any>;
    for (const u of Object.keys(n)) s["data/users/" + u] = n[u];
  }
  store = s;
  return store;
}
function persist() {
  if (remoteMode) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {}
}
function bump(col: string) {
  versions.set(col, (versions.get(col) || 0) + 1);
  listeners.forEach((l) => l());
}

function notifyAll() {
  Object.keys(store || {}).forEach((c) => versions.set(c, (versions.get(c) || 0) + 1));
  ["accounts", "settings", "roles", "issues", "projects", "schools", "leads"].forEach((c) => versions.set(c, (versions.get(c) || 0) + 1));
  listeners.forEach((l) => l());
}

export const db = {
  list(col: string): Doc[] {
    const v = versions.get(col) || 0;
    const c = cache.get(col);
    if (c && c.v === v) return c.list;
    const list = Object.entries(load()[col] || {}).map(([id, d]) => ({ id, ...d }) as Doc);
    cache.set(col, { v, list });
    return list;
  },
  get(col: string, id: string): Doc | undefined {
    const d = (load()[col] || {})[id];
    return d ? ({ id, ...d } as Doc) : undefined;
  },
  rid() {
    return "d" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  },
  set(col: string, id: string, data: Record<string, any>) {
    const s = load();
    const { id: _ignore, ...rest } = data;
    (s[col] = s[col] || {})[id] = JSON.parse(JSON.stringify(rest));
    persist();
    bump(col);
    save(col, id, s[col][id]);
    return id;
  },
  add(col: string, data: Record<string, any>) {
    return db.set(col, db.rid(), data);
  },
  update(col: string, id: string, patch: Record<string, any>) {
    const s = load();
    const cur = (s[col] || {})[id];
    if (!cur) throw new Error("not-found");
    const { id: _ignore, ...rest } = patch;
    s[col][id] = { ...cur, ...JSON.parse(JSON.stringify(rest)) };
    persist();
    bump(col);
    save(col, id, s[col][id]);
  },
  remove(col: string, id: string) {
    const s = load();
    if (s[col]) delete s[col][id];
    persist();
    bump(col);
    if (supabase) enqueue(supabase, deleteOps(col, id), (m) => { fail(m); reloadCols([col]); });
  },
  reset() {
    try {
      localStorage.removeItem(KEY);
    } catch {}
    store = null;
    cache.clear();
    versions.forEach((_, k) => versions.set(k, (versions.get(k) || 0) + 1));
    listeners.forEach((l) => l());
  },
  /** Mode Supabase: muat semua data setelah login, lalu ikuti perubahan realtime. */
  async init() {
    if (!supabase || status === "loading" || status === "ready") return;
    status = "loading";
    lastError = "";
    notifyAll();
    try {
      store = await loadAll(supabase);
    } catch (e: any) {
      status = "error";
      fail(/does not exist|schema cache|Could not find/i.test(String(e?.message)) ? "Tabel belum lengkap. Jalankan supabase/setup_all.sql di Supabase SQL Editor." : "Gagal memuat data: " + (e?.message || e));
      notifyAll();
      return;
    }
    status = "ready";
    let ch: any = supabase.channel("qrion-all");
    for (const t of TABLES) ch = ch.on("postgres_changes", { event: "*", schema: "public", table: t }, () => reloadCols(colsOfTable(t)));
    channel = ch.subscribe();
    notifyAll();
  },
  /** Kosongkan data lokal saat keluar. */
  clear() {
    if (channel && supabase) supabase.removeChannel(channel);
    channel = null;
    if (remoteMode) {
      store = {};
      status = "idle";
      notifyAll();
    }
  },
  get status() {
    return remoteMode ? status : "ready";
  },
  get error() {
    return lastError;
  },
  onError(f: (m: string) => void) {
    errListeners.add(f);
    return () => errListeners.delete(f);
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

/** Hook koleksi: daftar dokumen, otomatis tersegarkan saat data berubah. */
export function useCollection<T = Doc>(col: string): (T & { id: string })[] {
  return useSyncExternalStore(
    db.subscribe,
    () => (typeof window === "undefined" ? EMPTY : db.list(col)),
    () => EMPTY,
  ) as (T & { id: string })[];
}
/** Hook satu dokumen pengaturan, mis. settings/products. */
export function useSetting<T = any>(id: string): T | undefined {
  const all = useCollection("settings");
  return all.find((d) => d.id === id) as T | undefined;
}
