"use client";
/* Penyimpanan ke Supabase dengan tabel relasional (lihat lib/dbmap.mjs). */
import type { SupabaseClient } from "@supabase/supabase-js";
import { ENT, VIRTUAL, ALL_TABLES, docOps, entOf, rowsToDocs, settingsOps } from "./dbmap.mjs";

export type Store = Record<string, Record<string, Record<string, any>>>;
type Op = Record<string, any>;

const PAGE = 1000;
async function fetchAll(sb: SupabaseClient, table: string): Promise<any[]> {
  const out: any[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await sb.from(table).select("*").range(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    out.push(...(data || []));
    if (!data || data.length < PAGE) break;
  }
  return out;
}
const q = (v: string) => '"' + String(v).replace(/"/g, '\\"') + '"';

/** Tabel -> koleksi yang perlu dimuat ulang saat tabel itu berubah. */
export function colsOfTable(table: string): string[] {
  for (const e of ENT as any[]) if (e.table === table || (e.children || []).some((c: any) => c.table === table)) return [e.col === "data/users/*" ? "notes" : e.col];
  if (["products", "people", "app_roles", "role_access", "app_settings"].includes(table)) return ["settings", ...(table === "people" ? ["accounts"] : [])];
  return [];
}

async function loadSettings(sb: SupabaseClient): Promise<Record<string, any>> {
  const [roles, access, people, products, kv] = await Promise.all(["app_roles", "role_access", "people", "products", "app_settings"].map((t) => fetchAll(sb, t)));
  const st: Record<string, any> = {};
  st.products = { items: products.sort((a, b) => a.pos - b.pos).map((p) => ({ id: p.id, name: p.name })) };
  st.ams = { items: people.filter((p) => p.is_am).map((p) => p.ref) };
  st.people = { items: people.filter((p) => p.is_programmer).map((p) => p.ref) };
  const rs: Record<string, any> = {};
  roles
    .filter((r) => r.key !== "admin")
    .sort((a, b) => a.pos - b.pos)
    .forEach((r) => {
      rs[r.key] = { name: r.name, home: r.home, access: {} };
    });
  access.forEach((a) => {
    if (rs[a.role_key]) rs[a.role_key].access[a.module] = a.level;
  });
  if (Object.keys(rs).length) st.access = { roles: rs };
  kv.forEach((r) => (st[r.key] = r.data));
  return st;
}

export async function loadCol(sb: SupabaseClient, col: string): Promise<Record<string, Record<string, any>>> {
  if (col === "settings") return (await loadSettings(sb)) as any;
  if (col === "notes") {
    const ent: any = ENT.find((e: any) => e.own);
    const rows = await fetchAll(sb, ent.table);
    const docs = rowsToDocs(ent, rows, {});
    const out: Record<string, any> = {};
    for (const [id, d] of Object.entries<any>(docs)) {
      const { __owner, ...rest } = d;
      (out["data/users/" + __owner] = out["data/users/" + __owner] || {})[id] = rest;
    }
    return out;
  }
  const ent: any = entOf(col);
  const rows = await fetchAll(sb, ent.table);
  const kids: Record<string, any[]> = {};
  for (const ch of ent.children || []) kids[ch.table] = await fetchAll(sb, ch.table);
  return rowsToDocs(ent, rows, kids) as any;
}

/** Muat seluruh data ke bentuk Store (col -> id -> dokumen). */
export async function loadAll(sb: SupabaseClient): Promise<Store> {
  const store: Store = {};
  const cols = (ENT as any[]).filter((e) => !e.own).map((e) => e.col);
  const parts = await Promise.all([...cols.map((c) => loadCol(sb, c).then((d) => [c, d] as const)), loadCol(sb, "notes").then((d) => ["notes", d] as const), loadCol(sb, "settings").then((d) => ["settings", d] as const)]);
  for (const [c, d] of parts) {
    if (c === "notes") Object.assign(store, d);
    else store[c] = d as any;
  }
  return store;
}

async function run(sb0: SupabaseClient, op: Op) {
  const sb: any = sb0;
  const fail = (e: any) => {
    if (e) throw new Error(e.message || String(e));
  };
  if (op.kind === "people") {
    if (!op.refs.length) return;
    fail((await sb.from("people").upsert(op.refs.map((ref: string) => ({ ref })), { onConflict: "ref", ignoreDuplicates: true })).error);
  } else if (op.kind === "personName") {
    fail((await sb.from("people").update({ nama: op.nama }).eq("ref", op.ref)).error);
  } else if (op.kind === "flag") {
    if (op.refs.length) fail((await sb.from("people").update({ [op.flag]: true }).in("ref", op.refs)).error);
    let r: any = sb.from("people").update({ [op.flag]: false }).eq(op.flag, true);
    if (op.refs.length) r = r.not("ref", "in", `(${op.refs.map(q).join(",")})`);
    fail((await r).error);
  } else if (op.kind === "upsert") {
    fail((await sb.from(op.table).upsert(op.rows, { onConflict: op.conflict })).error);
  } else if (op.kind === "replace") {
    fail((await sb.from(op.table).delete().eq(op.fk, op.parent)).error);
    if (op.rows.length) fail((await sb.from(op.table).insert(op.rows)).error);
  } else if (op.kind === "syncSet") {
    if (op.rows.length) fail((await sb.from(op.table).upsert(op.rows, { onConflict: op.pk })).error);
    let r: any = sb.from(op.table).delete();
    r = op.keep.length ? r.not(op.pk, "in", `(${op.keep.map(q).join(",")})`) : r.neq(op.pk, "\u0000");
    fail((await r).error);
  } else if (op.kind === "delete") {
    fail((await sb.from(op.table).delete().eq(op.pk, op.id)).error);
  }
}

export type Ctx = { exists: (t: string, id: string) => boolean; schoolByName: (n: string) => string | null; owner?: string };

export function opsFor(col: string, id: string, doc: any, ctx: Ctx): Op[] {
  if (col === "settings") return VIRTUAL.includes(id) ? settingsOps(id, doc) : [{ kind: "upsert", table: "app_settings", conflict: "key", rows: [{ key: id, data: doc }] }];
  const own = /^data\/users\/(.+)$/.exec(col);
  if (own) return docOps(col, id, doc, { ...ctx, owner: own[1] });
  return docOps(col, id, doc, ctx);
}
export function deleteOps(col: string, id: string): Op[] {
  if (col === "settings") return [];
  const ent: any = entOf(col);
  return ent ? [{ kind: "delete", table: ent.table, pk: ent.pk, id }] : [];
}

let chain: Promise<void> = Promise.resolve();
let pending = 0;
export const busy = () => pending > 0;
/** Jalankan operasi berurutan (agar urutan foreign key terjaga). */
export function enqueue(sb: SupabaseClient, ops: Op[], onError: (m: string) => void) {
  pending++;
  chain = chain
    .then(async () => {
      for (const op of ops) await run(sb, op);
    })
    .catch((e) => onError(friendly(e)))
    .finally(() => {
      pending--;
    });
  return chain;
}
function friendly(e: any): string {
  const m = String((e && e.message) || e);
  if (/row-level security|permission denied/i.test(m)) return "Gagal menyimpan: peran Anda tidak punya izin untuk data ini.";
  if (/violates foreign key.*app_roles|still referenced/i.test(m) && /role/i.test(m)) return "Peran masih dipakai akun. Pindahkan akunnya ke peran lain dulu.";
  if (/violates foreign key/i.test(m)) return "Gagal menyimpan: data merujuk ke data lain yang tidak ada lagi.";
  if (/does not exist|schema cache/i.test(m)) return "Tabel belum lengkap. Jalankan ulang supabase/setup_all.sql di SQL Editor.";
  return "Gagal menyimpan: " + m;
}

export const TABLES: string[] = ALL_TABLES();
