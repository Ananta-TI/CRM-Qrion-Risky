// Membuat supabase/setup_all.sql: tabel relasional + RLS + data dummy + akun login.
// Jalankan: node scripts/gen-sql.mjs   (SEED_PASSWORD=... untuk mengganti sandi awal)
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { ENT, ddl, docOps, entOf, settingsOps, ALL_TABLES, ADMIN_ONLY } from "../src/lib/data/dbmap.mjs";

const PASSWORD = process.env.SEED_PASSWORD || "qrion123";
const DOMAIN = "qrion.local";
const pad = (n) => String(n).padStart(2, "0");
const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
function tok(v, now = new Date()) {
  let m = /^@d([+-]\d+)$/.exec(v); if (m) return isoDate(new Date(now.getTime() + +m[1] * 864e5));
  m = /^@m([+-]\d+)$/.exec(v); if (m) { const d = new Date(now.getFullYear(), now.getMonth() + +m[1], 1); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`; }
  m = /^@n(-?\d+)m(?:\+(\d+)m)?$/.exec(v); if (m) return new Date(now.getTime() + +m[1] * 6e4 + (m[2] ? +m[2] * 6e4 : 0)).toISOString();
  m = /^@t([+-]\d+)d@(\d\d):(\d\d)(?:\+(\d+)m)?$/.exec(v);
  if (m) { const day = isoDate(new Date(now.getTime() + +m[1] * 864e5)); return new Date(new Date(`${day}T${m[2]}:${m[3]}:00Z`).getTime() + (m[4] ? +m[4] * 6e4 : 0)).toISOString(); }
  return v;
}
const res = (x) => typeof x === "string" ? (x.startsWith("@") ? tok(x) : x) : Array.isArray(x) ? x.map(res) : x && typeof x === "object" ? Object.fromEntries(Object.entries(x).map(([k, v]) => [k.replace(/@d([+-]\d+)/g, (_m, n) => tok("@d" + n)), res(v)])) : x;
const load = (f) => res(JSON.parse(readFileSync(`data/${f}.json`, "utf8")));

/* ---------- literal SQL ---------- */
const q = (s) => "'" + String(s).replace(/'/g, "''") + "'";
function lit(v, arr) {
  if (v === null || v === undefined) return "null";
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "true" : "false";
  if (Array.isArray(v) && arr) return v.length ? `array[${v.map(q).join(",")}]::text[]` : "'{}'::text[]";
  if (typeof v === "object" || Array.isArray(v)) return q(JSON.stringify(v)) + "::jsonb";
  return q(v);
}
const TEXT_ARRAYS = new Set(["bulan"]);
function insertSql(table, rows, conflict) {
  if (!rows.length) return "";
  const cols = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  const vals = rows.map((r) => "(" + cols.map((c) => lit(r[c], TEXT_ARRAYS.has(c))).join(",") + ")").join(",\n");
  const upd = conflict ? cols.filter((c) => c !== conflict && c !== "ref").map((c) => `${c}=excluded.${c}`).join(", ") : "";
  const tail = conflict ? (upd ? `\non conflict (${conflict}) do update set ${upd}` : `\non conflict (${conflict}) do nothing`) : "";
  return `insert into public.${table} (${cols.join(",")}) values\n${vals}${tail};\n`;
}
function opSql(op) {
  switch (op.kind) {
    case "people": return op.refs.length ? `insert into public.people(ref) values ${op.refs.map((r) => `(${q(r)})`).join(",")} on conflict do nothing;\n` : "";
    case "personName": return `update public.people set nama=${q(op.nama)} where ref=${q(op.ref)};\n`;
    case "flag": return op.refs.length ? `update public.people set ${op.flag}=true where ref in (${op.refs.map(q).join(",")});\n` : "";
    case "upsert": return insertSql(op.table, op.rows, op.conflict);
    case "replace": return insertSql(op.table, op.rows, null);
    case "syncSet": return insertSql(op.table, op.rows, op.pk);
    default: return "";
  }
}

/* ---------- konteks validasi referensi ---------- */
const settings = load("settings");
const schools = load("schools");
const invoices = load("invoices");
const ctx = {
  exists: (t, id) => t === "schools" ? !!schools[id] : t === "invoices" ? !!invoices[id] : t === "products" ? settings.products.items.some((p) => p.id === id) : t === "app_roles" ? id === "admin" || !!settings.access.roles[id] : true,
  schoolByName: (n) => (Object.entries(schools).find(([, d]) => d.name.toLowerCase() === String(n).toLowerCase()) || [])[0] || null,
};

/* ---------- RLS ---------- */
function policies() {
  const out = [];
  const adminOnly = new Set(ADMIN_ONLY);
  const tables = [];
  for (const t of ["app_roles", "role_access", "people", "products", "app_settings"]) tables.push({ t, admin: adminOnly.has(t) });
  for (const e of ENT) {
    tables.push({ t: e.table, admin: !!e.admin, adminRead: !!e.adminRead, own: !!e.own });
    for (const c of e.children || []) tables.push({ t: c.table, admin: !!e.admin });
  }
  for (const { t, admin, adminRead, own } of tables) {
    out.push(`alter table public.${t} enable row level security;`);
    const sel = own ? "owner = public.qrion_user()" : adminRead ? "public.qrion_role() = 'admin'" : "public.qrion_role() is not null";
    out.push(`create policy ${t}_sel on public.${t} for select to authenticated using (${sel});`);
    const wr = own ? "owner = public.qrion_user()" : admin ? "public.qrion_role() = 'admin'" : "public.qrion_role() is not null";
    out.push(`create policy ${t}_ins on public.${t} for insert to authenticated with check (${wr});`);
    out.push(`create policy ${t}_upd on public.${t} for update to authenticated using (${wr}) with check (${wr});`);
    out.push(`create policy ${t}_del on public.${t} for delete to authenticated using (${wr});`);
  }
  return out.join("\n");
}

/* ---------- rakit ---------- */
const parts = [];
parts.push(`-- ============================================================
-- QRION CRM: setup database lengkap (tabel relasional, RLS, data dummy, akun login)
-- Dibuat otomatis oleh scripts/gen-sql.mjs. Jalankan SEKALI di Supabase SQL Editor.
-- PERINGATAN: skrip ini MENGHAPUS lalu membuat ulang semua tabel CRM.
-- ============================================================
create extension if not exists pgcrypto;
drop table if exists public.records cascade;
${ALL_TABLES().slice().reverse().map((t) => `drop table if exists public.${t} cascade;`).join("\n")}
`);
parts.push(ddl());
parts.push(`
-- ===== Fungsi bantu hak akses =====
create or replace function public.qrion_user() returns text language sql stable as $$
  select split_part(coalesce(auth.jwt() ->> 'email', ''), '@', 1) $$;
create or replace function public.qrion_role() returns text language sql stable security definer set search_path = public as $$
  select a.role_key from public.accounts a where a.username = public.qrion_user() and a.aktif $$;
`);
parts.push(`insert into public.app_roles(key,name,home,pos) values ('admin','Super Admin','ringkasan',-1) on conflict do nothing;\n`);
parts.push("-- ===== DATA =====\n");

// urutan: pengaturan (produk, peran), akun, lalu entitas sesuai ENT. Operasi digabung per tabel agar berkas ringkas.
const all = [];
for (const id of ["products", "access"]) all.push(...settingsOps(id, settings[id]));
const acc = load("accounts");
for (const [id, d] of Object.entries(acc)) { const { salt, iter, hash, ...rest } = d; all.push(...docOps("accounts", id, rest, ctx)); }
for (const id of ["ams", "people", "absen", "invoice"]) all.push(...settingsOps(id, settings[id]));
for (const e of ENT) {
  if (["accounts", "roles"].includes(e.col) || e.own) continue;
  const docs = e.col === "invoices" ? invoices : e.col === "schools" ? schools : load(e.col);
  for (const [id, d] of Object.entries(docs)) all.push(...docOps(e.col, id, d, ctx));
}
const notes = load("catatan");
for (const [u, docs] of Object.entries(notes)) for (const [id, d] of Object.entries(docs)) all.push(...docOps("data/users/" + u, id, d, { ...ctx, owner: u }));
const grouped = new Map();
for (const op of all) {
  const key = op.kind === "people" ? "people" : op.kind === "flag" ? "flag|" + op.flag : op.kind === "personName" ? "pn" : [op.kind, op.table, op.conflict || op.pk || ""].join("|");
  const g = grouped.get(key);
  if (!g) grouped.set(key, op.kind === "people" ? { ...op, refs: [...op.refs] } : op.kind === "personName" ? { kind: "pns", list: [op] } : op.kind === "flag" ? { ...op, refs: [...op.refs] } : { ...op, rows: [...(op.rows || [])] });
  else if (op.kind === "people" || op.kind === "flag") g.refs.push(...op.refs);
  else if (op.kind === "personName") g.list.push(op);
  else g.rows.push(...op.rows);
}
let data = "";
for (const g of grouped.values()) {
  if (g.kind === "people") g.refs = [...new Set(g.refs)];
  if (g.kind === "flag") g.refs = [...new Set(g.refs)];
  data += g.kind === "pns" ? g.list.map(opSql).join("") : opSql(g);
}
parts.push(data);

parts.push(`
-- ===== Akun login (username@${DOMAIN}, sandi awal: ${PASSWORD}) =====
${Object.keys(acc).map((u) => {
  const em = q(`${u}@${DOMAIN}`);
  return `do $$ declare uid uuid := gen_random_uuid(); begin
 if not exists (select 1 from auth.users where email=${em}) then
  insert into auth.users(instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at,confirmation_token,recovery_token,email_change,email_change_token_new)
  values('00000000-0000-0000-0000-000000000000',uid,'authenticated','authenticated',${em},crypt(${q(PASSWORD)},gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'','','','');
  insert into auth.identities(id,user_id,provider_id,identity_data,provider,last_sign_in_at,created_at,updated_at)
  values(gen_random_uuid(),uid,uid::text,jsonb_build_object('sub',uid::text,'email',${em},'email_verified',true),'email',now(),now(),now());
 else
  update auth.users set encrypted_password=crypt(${q(PASSWORD)},gen_salt('bf')) where email=${em};
 end if; end $$;`;
}).join("\n")}
`);
parts.push(`
-- ===== Hak akses baris (RLS) =====
${policies()}

-- ===== Kelola akun login dari dalam CRM (hanya super admin) =====
create or replace function public.qrion_set_password(uname text, pw text)
returns void language plpgsql security definer set search_path = public, auth, extensions as $$
declare uid uuid; em text := lower(trim(uname)) || '@${DOMAIN}';
begin
  if public.qrion_role() is distinct from 'admin' then raise exception 'Hanya super admin yang boleh mengatur sandi.'; end if;
  if length(coalesce(pw,'')) < 10 then raise exception 'Sandi minimal 10 karakter.'; end if;
  select id into uid from auth.users where email = em;
  if uid is null then
    uid := gen_random_uuid();
    insert into auth.users(instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at,confirmation_token,recovery_token,email_change,email_change_token_new)
    values('00000000-0000-0000-0000-000000000000',uid,'authenticated','authenticated',em,crypt(pw,gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'','','','');
    insert into auth.identities(id,user_id,provider_id,identity_data,provider,last_sign_in_at,created_at,updated_at)
    values(gen_random_uuid(),uid,uid::text,jsonb_build_object('sub',uid::text,'email',em,'email_verified',true),'email',now(),now(),now());
  else
    update auth.users set encrypted_password = crypt(pw,gen_salt('bf')), updated_at = now() where id = uid;
  end if;
end $$;
create or replace function public.qrion_drop_user(uname text)
returns void language plpgsql security definer set search_path = public, auth, extensions as $$
begin
  if public.qrion_role() is distinct from 'admin' then raise exception 'Hanya super admin.'; end if;
  delete from auth.users where email = lower(trim(uname)) || '@${DOMAIN}';
end $$;
revoke all on function public.qrion_set_password(text,text) from public, anon;
revoke all on function public.qrion_drop_user(text) from public, anon;
grant execute on function public.qrion_set_password(text,text) to authenticated;
grant execute on function public.qrion_drop_user(text) to authenticated;

-- ===== Penyimpanan file =====
insert into storage.buckets (id, name, public) values ('assets', 'assets', true) on conflict (id) do nothing;
drop policy if exists assets_read on storage.objects;
drop policy if exists assets_insert on storage.objects;
create policy assets_read on storage.objects for select using (bucket_id = 'assets');
create policy assets_insert on storage.objects for insert to authenticated with check (bucket_id = 'assets' and public.qrion_role() is not null);

-- ===== Realtime =====
${ALL_TABLES().map((t) => `do $$ begin alter publication supabase_realtime add table public.${t}; exception when duplicate_object then null; end $$;`).join("\n")}
`);
mkdirSync("supabase", { recursive: true });
const struktur = [parts[0], parts[1], parts[2], parts[7]].join("\n");
const isi = ["-- QRION CRM, bagian 2: data dummy dan akun login (jalankan SETELAH 1_struktur.sql)\n", parts[3], parts[4], parts[5], parts[6]].join("\n");
writeFileSync("supabase/1_struktur.sql", struktur);
writeFileSync("supabase/2_data.sql", isi);
writeFileSync("supabase/setup_all.sql", struktur + "\n" + isi);
console.log("Dibuat supabase/setup_all.sql —", Object.keys(acc).length, "akun, tabel:", ALL_TABLES().length);
