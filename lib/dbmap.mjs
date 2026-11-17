/* Pemetaan dokumen CRM <-> tabel relasional Supabase.
   Satu sumber kebenaran: dipakai oleh generator SQL (scripts/gen-sql.mjs) dan oleh klien (lib/remote.ts). */

const PG = { text: "text", int: "integer", numeric: "numeric", bool: "boolean", date: "date", ts: "timestamptz", tl: "text[]", j: "jsonb" };

/* Kolom: [kunciDokumen, kolom, tipe, opsiSQL?]. Tipe "ref:<tabel>" = foreign key ke tabel itu. Kunci boleh bertitik (csat.score). */
export const ENT = [
  {
    col: "accounts", table: "accounts", pk: "username", admin: true,
    cols: [["nama", "nama", "text", "not null default ''"], ["role", "role_key", "ref:app_roles"], ["aktif", "aktif", "bool", "not null default true"], ["dibuat", "dibuat", "ts"], ["am", "am", "ref:people"]],
  },
  { col: "roles", table: "user_roles", pk: "user_ref", admin: true, cols: [["role", "role_key", "ref:app_roles"]] },
  { col: "team", table: "team_members", pk: "id", cols: [["joinedAt", "joined_at", "ts"]] },
  {
    col: "schools", table: "schools", pk: "id",
    cols: [["name", "name", "text", "not null default ''"], ["city", "city", "text"], ["jenjang", "jenjang", "text"], ["status", "status", "text", "not null default 'onboarding'"], ["am", "am", "ref:people"], ["students", "students", "int"], ["contractStart", "contract_start", "date"], ["contractEnd", "contract_end", "date"], ["picName", "pic_name", "text"], ["picPhone", "pic_phone", "text"], ["address", "address", "text"], ["nextAction", "next_action", "text"], ["nextDate", "next_date", "date"], ["notes", "notes", "text"], ["contoh", "contoh", "bool"], ["createdAt", "created_at", "ts"], ["createdBy", "created_by", "ref:people"]],
    children: [
      { key: "products", table: "school_products", fk: "school_id", cols: [["productId", "product_id", "ref:products"], ["mrr", "mrr", "numeric", "not null default 0"]] },
      { key: "contacts", table: "school_contacts", fk: "school_id", cols: [["name", "name", "text"], ["title", "title", "text"], ["phone", "phone", "text"]] },
      { key: "log", table: "school_logs", fk: "school_id", cols: [["at", "at", "ts"], ["by", "by_ref", "ref:people"], ["type", "type", "text"], ["text", "text", "text"]] },
    ],
  },
  {
    col: "issues", table: "issues", pk: "id",
    cols: [["subject", "subject", "text", "not null default ''"], ["description", "description", "text"], ["status", "status", "text", "not null default 'Open'"], ["urgency", "urgency", "text", "not null default 'Medium'"], ["category", "category", "text"], ["schoolId", "school_id", "ref:schools"], ["productId", "product_id", "ref:products"], ["assignee", "assignee", "ref:people"], ["am", "am", "ref:people"], ["reporter", "reporter", "text"], ["createdBy", "created_by", "ref:people"], ["createdAt", "created_at", "ts"], ["reportedDate", "reported_date", "date"], ["slaDeadline", "sla_deadline", "ts"], ["firstResponseAt", "first_response_at", "ts"], ["closedAt", "closed_at", "ts"], ["slaBreached", "sla_breached", "bool"], ["reopenCount", "reopen_count", "int"], ["pausedMinutes", "paused_minutes", "numeric"], ["pausedAt", "paused_at", "ts"], ["csat.score", "csat_score", "int"], ["csat.comment", "csat_comment", "text"], ["txAmount", "tx_amount", "numeric"], ["attachments", "attachments", "j"], ["contoh", "contoh", "bool"]],
    children: [{ key: "messages", table: "issue_messages", fk: "issue_id", cols: [["at", "at", "ts"], ["by", "by_ref", "ref:people"], ["kind", "kind", "text"], ["body", "body", "text"], ["files", "files", "j"]] }],
  },
  {
    col: "projects", table: "projects", pk: "id",
    cols: [["name", "name", "text", "not null default ''"], ["schoolId", "school_id", "ref:schools"], ["status", "status", "text", "not null default 'perencanaan'"], ["type", "type", "text"], ["priority", "priority", "text"], ["start", "start_date", "date"], ["end", "end_date", "date"], ["assignee", "assignee", "ref:people"], ["pm", "pm", "ref:people"], ["notes", "notes", "text"], ["contoh", "contoh", "bool"], ["createdAt", "created_at", "ts"], ["createdBy", "created_by", "ref:people"]],
    children: [
      { key: "assignees", table: "project_assignees", fk: "project_id", scalar: true, cols: [["", "person", "ref:people"]] },
      { key: "milestones", table: "project_milestones", fk: "project_id", cols: [["title", "title", "text"], ["due", "due", "date"], ["status", "status", "text"], ["who", "who", "ref:people"]] },
      { key: "log", table: "project_logs", fk: "project_id", cols: [["at", "at", "ts"], ["by", "by_ref", "ref:people"], ["text", "text", "text"]] },
    ],
  },
  {
    col: "leads", table: "leads", pk: "id",
    cols: [["name", "name", "text", "not null default ''"], ["stage", "stage", "text", "not null default 'baru'"], ["estMrr", "est_mrr", "numeric"], ["source", "source", "text"], ["am", "am", "ref:people"], ["city", "city", "text"], ["contact", "contact", "text"], ["phone", "phone", "text"], ["nextDate", "next_date", "date"], ["nextAction", "next_action", "text"], ["closeDate", "close_date", "date"], ["lostReason", "lost_reason", "text"], ["notes", "notes", "text"], ["contoh", "contoh", "bool"], ["createdAt", "created_at", "ts"], ["createdBy", "created_by", "ref:people"], ["schoolId", "school_id", "ref:schools"]],
    children: [
      { key: "products", table: "lead_products", fk: "lead_id", scalar: true, cols: [["", "product_id", "ref:products"]] },
      { key: "log", table: "lead_logs", fk: "lead_id", cols: [["at", "at", "ts"], ["by", "by_ref", "ref:people"], ["type", "type", "text"], ["text", "text", "text"]] },
    ],
  },
  {
    col: "invoices", table: "invoices", pk: "id", after: ["schools"],
    cols: [["no", "no", "text"], ["schoolId", "school_id", "ref:schools"], ["untuk", "untuk", "text"], ["alamatUntuk", "alamat_untuk", "text"], ["tanggal", "tanggal", "date"], ["jatuhTempo", "jatuh_tempo", "date"], ["status", "status", "text", "not null default 'draft'"], ["ppn", "ppn", "numeric"], ["diskon", "diskon", "numeric"], ["paidAt", "paid_at", "date"], ["catatan", "catatan", "text"], ["contoh", "contoh", "bool"], ["createdAt", "created_at", "ts"], ["createdBy", "created_by", "ref:people"]],
    children: [{ key: "items", table: "invoice_items", fk: "invoice_id", cols: [["nama", "nama", "text"], ["qty", "qty", "numeric"], ["harga", "harga", "numeric"]] }],
    byName: { field: "untuk", to: "schoolId" },
  },
  {
    col: "pembayaran", table: "payments", pk: "id",
    cols: [["mitraId", "school_id", "ref:schools"], ["tipe", "tipe", "text", "not null default 'langganan'"], ["tanggal", "tanggal", "date"], ["total", "total", "numeric", "not null default 0"], ["catatan", "catatan", "text"], ["bukti", "bukti", "text"], ["invoiceId", "invoice_id", "ref:invoices"], ["contoh", "contoh", "bool"], ["createdAt", "created_at", "ts"], ["createdBy", "created_by", "ref:people"]],
    children: [{ key: "items", table: "payment_items", fk: "payment_id", cols: [["jenis", "jenis", "text"], ["nama", "nama", "text"], ["bulan", "bulan", "tl"], ["nominal", "nominal", "numeric"], ["qty", "qty", "numeric"]] }],
  },
  {
    col: "pengeluaran", table: "expenses", pk: "id",
    cols: [["tanggal", "tanggal", "date"], ["kategori", "kategori", "text"], ["deskripsi", "deskripsi", "text"], ["jumlah", "jumlah", "numeric", "not null default 0"], ["vendor", "vendor", "text"], ["rutin", "rutin", "bool"], ["bukti", "bukti", "text"], ["catatan", "catatan", "text"], ["createdAt", "created_at", "ts"], ["createdBy", "created_by", "ref:people"]],
  },
  {
    col: "surat", table: "letters", pk: "id",
    cols: [["pihak", "pihak", "text"], ["schoolId", "school_id", "ref:schools"], ["perihal", "perihal", "text"], ["nomor", "nomor", "text"], ["kode", "kode", "text"], ["arah", "arah", "text"], ["tanggal", "tanggal", "date"], ["status", "status", "text"], ["lampiran", "lampiran", "j"], ["lampiranKet", "lampiran_ket", "text"], ["catatan", "catatan", "text"], ["createdAt", "created_at", "ts"], ["createdBy", "created_by", "ref:people"]],
    byName: { field: "pihak", to: "schoolId" },
  },
  {
    col: "mou", table: "mou", pk: "id",
    cols: [["untuk", "untuk", "text"], ["schoolId", "school_id", "ref:schools"], ["judul", "judul", "text"], ["nomor", "nomor", "text"], ["status", "status", "text"], ["tanggalTtd", "tanggal_ttd", "date"], ["mulai", "mulai", "date"], ["berakhir", "berakhir", "date"], ["lampiran", "lampiran", "j"], ["lampiranKet", "lampiran_ket", "text"], ["catatan", "catatan", "text"], ["createdAt", "created_at", "ts"], ["createdBy", "created_by", "ref:people"]],
    byName: { field: "untuk", to: "schoolId" },
  },
  {
    col: "suratTpl", table: "letter_templates", pk: "id",
    cols: [["menu", "menu", "text"], ["nama", "nama", "text"], ["kode", "kode", "text"], ["link", "link", "text"], ["ket", "ket", "text"], ["files", "files", "j"], ["dibuat", "dibuat", "ts"], ["diubah", "diubah", "ts"]],
  },
  {
    col: "branding", table: "branding_assets", pk: "id",
    cols: [["judul", "judul", "text"], ["kategori", "kategori", "text"], ["produk", "product_id", "ref:products"], ["deskripsi", "deskripsi", "text"], ["tautan", "tautan", "text"], ["files", "files", "j"], ["dibuat", "dibuat", "ts"], ["contoh", "contoh", "bool"]],
  },
  {
    col: "absensi", table: "attendance", pk: "id",
    cols: [["tanggal", "tanggal", "date"], ["uid", "uid", "ref:people"], ["nama", "nama", "text"], ["status", "status", "text"], ["masuk", "masuk", "ts"], ["pulang", "pulang", "ts"], ["catatan", "catatan", "text"], ["cat", "cat", "text"]],
  },
  { col: "audit", table: "audit_log", pk: "id", adminRead: true, cols: [["t", "t", "ts"], ["by", "by_name", "text"], ["menu", "menu", "text"], ["aksi", "aksi", "text"]] },
  {
    col: "data/users/*", table: "notes", pk: "id", own: true,
    cols: [["teks", "teks", "text"], ["dibuat", "dibuat", "ts"], ["diubah", "diubah", "ts"]],
  },
];

export const entOf = (col) => ENT.find((e) => e.col === col) || (/^data\/users\/.+/.test(col) ? ENT.find((e) => e.own) : null);
export const VIRTUAL = ["products", "ams", "people", "access", "absen", "invoice"]; // dokumen settings/*

/* ---------- util ---------- */
const getp = (o, k) => k.split(".").reduce((a, p) => (a == null ? undefined : a[p]), o);
const setp = (o, k, v) => {
  const ps = k.split(".");
  let c = o;
  ps.slice(0, -1).forEach((p) => (c = c[p] = c[p] || {}));
  c[ps[ps.length - 1]] = v;
};
const isoTs = (v) => {
  if (v == null || v === "") return null;
  const d = new Date(v);
  return isNaN(d) ? null : d.toISOString();
};
const conv = (type, v, ctx) => {
  if (v === undefined || v === null || v === "") return null;
  if (type === "text") return String(v);
  if (type === "int") return Number.isFinite(+v) ? Math.round(+v) : null;
  if (type === "numeric") return Number.isFinite(+v) ? +v : null;
  if (type === "bool") return !!v;
  if (type === "date") return /^\d{4}-\d{2}-\d{2}/.test(String(v)) ? String(v).slice(0, 10) : null;
  if (type === "ts") return isoTs(v);
  if (type === "tl") return Array.isArray(v) ? v.map(String) : null;
  if (type === "j") return v;
  if (type.startsWith("ref:")) {
    const t = type.slice(4),
      s = String(v);
    if (t === "people") return s;
    if (ctx && ctx.exists && !ctx.exists(t, s)) return null;
    return s;
  }
  return v;
};
const fromDb = (type, v) => {
  if (v === null || v === undefined) return undefined;
  if (type === "ts") return new Date(v).toISOString();
  if (type === "numeric" || type === "int") return +v;
  return v;
};

/* people yang harus ada sebelum baris yang merujuknya ditulis */
function toRow(spec, doc, ctx, people, skipKeys) {
  const row = {};
  const used = new Set(skipKeys || []);
  for (const [dk, column, type] of spec) {
    const v = conv(type, getp(doc, dk), ctx);
    row[column] = v;
    if (type === "ref:people" && v) people.add(v);
    used.add(dk.split(".")[0]);
  }
  const extra = {};
  for (const k of Object.keys(doc)) if (!used.has(k) && k !== "id" && doc[k] !== undefined) extra[k] = doc[k];
  row.extra = Object.keys(extra).length ? extra : null;
  return row;
}
function fromRowGeneric(spec, row) {
  const d = {};
  for (const [dk, column, type] of spec) {
    const v = fromDb(type, row[column]);
    if (v !== undefined) setp(d, dk, v);
  }
  if (row.extra) Object.assign(d, row.extra);
  return d;
}

/* ---------- dokumen -> operasi tulis ---------- */
export function docOps(col, id, docIn, ctx) {
  const ent = entOf(col);
  if (!ent) throw new Error("Koleksi tidak dikenal: " + col);
  const doc = JSON.parse(JSON.stringify(docIn));
  const people = new Set();
  if (ent.byName && !doc[ent.byName.to] && doc[ent.byName.field] && ctx && ctx.schoolByName) {
    const sid = ctx.schoolByName(doc[ent.byName.field]);
    if (sid) doc[ent.byName.to] = sid;
  }
  const childKeys = (ent.children || []).map((c) => c.key);
  const row = toRow(ent.cols, doc, ctx, people, childKeys);
  if (ent.col === "accounts") people.add("a:" + id);
  row[ent.pk] = id;
  if (ent.own) row.owner = ctx && ctx.owner;
  const ops = [];
  if (people.size) ops.push({ kind: "people", refs: [...people] });
  if (ent.col === "accounts") {
    ops.push({ kind: "personName", ref: "a:" + id, nama: doc.nama || id });
  }
  ops.push({ kind: "upsert", table: ent.table, conflict: ent.pk, rows: [row] });
  for (const ch of ent.children || []) {
    const arr = Array.isArray(doc[ch.key]) ? doc[ch.key] : [];
    const rows = [];
    const ppl = new Set();
    arr.forEach((it, i) => {
      let r;
      if (ch.scalar) {
        r = { [ch.cols[0][1]]: conv(ch.cols[0][2], it, ctx), extra: null };
        if (ch.cols[0][2] === "ref:people" && r[ch.cols[0][1]]) ppl.add(r[ch.cols[0][1]]);
        if (r[ch.cols[0][1]] == null) return;
      } else {
        r = toRow(ch.cols, it || {}, ctx, ppl);
        // baris anak yang rujukan utamanya (mis. produk) sudah tidak ada: lewati
        const lost = ch.cols.some(([dk, column, type]) => type.startsWith("ref:") && type !== "ref:people" && getp(it || {}, dk) && r[column] == null);
        if (lost) return;
      }
      r[ch.fk] = id;
      r.pos = i;
      rows.push(r);
    });
    if (ppl.size) ops.push({ kind: "people", refs: [...ppl] });
    ops.push({ kind: "replace", table: ch.table, fk: ch.fk, parent: id, rows });
  }
  return ops;
}

/* ---------- baris tabel -> dokumen ---------- */
export function rowsToDocs(ent, rows, childRows) {
  const out = {};
  for (const row of rows) {
    const id = row[ent.pk];
    const d = fromRowGeneric(ent.cols, row);
    if (ent.own) d.__owner = row.owner;
    for (const ch of ent.children || []) {
      const mine = (childRows[ch.table] || []).filter((r) => r[ch.fk] === id).sort((a, b) => a.pos - b.pos);
      d[ch.key] = ch.scalar ? mine.map((r) => r[ch.cols[0][1]]) : mine.map((r) => fromRowGeneric(ch.cols, r));
    }
    out[id] = d;
  }
  return out;
}

/* ---------- dokumen settings/* (virtual) ---------- */
export function settingsOps(id, doc) {
  if (id === "products") {
    const items = (doc.items || []).filter((p) => p && p.id && p.name);
    return [{ kind: "syncSet", table: "products", pk: "id", keep: items.map((p) => p.id), rows: items.map((p, i) => ({ id: p.id, name: p.name, pos: i })) }];
  }
  if (id === "ams" || id === "people") {
    const flag = id === "ams" ? "is_am" : "is_programmer";
    const items = [...new Set((doc.items || []).map(String).filter(Boolean))];
    return [{ kind: "people", refs: items }, { kind: "flag", flag, refs: items }];
  }
  if (id === "access") {
    const roles = doc.roles || {};
    const ops = [{ kind: "syncSet", table: "app_roles", pk: "key", keep: ["admin", ...Object.keys(roles)], rows: Object.keys(roles).map((k, i) => ({ key: k, name: roles[k].name || k, home: roles[k].home || "ringkasan", pos: i })) }];
    for (const k of Object.keys(roles)) {
      const acc = roles[k].access || {};
      ops.push({ kind: "replace", table: "role_access", fk: "role_key", parent: k, rows: Object.keys(acc).map((m) => ({ role_key: k, module: m, level: +acc[m] || 0, pos: 0 })) });
    }
    return ops;
  }
  return [{ kind: "upsert", table: "app_settings", conflict: "key", rows: [{ key: id, data: doc }] }];
}

/* ---------- DDL ---------- */
const sqlType = (t) => (t.startsWith("ref:") ? "text" : PG[t]);
const qi = (s) => '"' + s + '"';

export function ddl() {
  const out = [];
  const colSql = (cols) =>
    cols
      .map(([, c, t, o]) => {
        if (t.startsWith("ref:")) {
          const tt = t.slice(4);
          const pk = tt === "app_roles" ? "key" : tt === "people" ? "ref" : "id";
          return `  ${c} text references public.${tt}(${pk}) on update cascade on delete ${tt === "app_roles" ? "restrict" : "set null"}${o ? " " + o : ""}`;
        }
        return `  ${c} ${sqlType(t)}${o ? " " + o : ""}`;
      })
      .join(",\n");
  out.push(`-- Tabel master
create table if not exists public.app_roles (key text primary key, name text not null, home text not null default 'ringkasan', pos int not null default 0, created_at timestamptz not null default now());
create table if not exists public.role_access (role_key text not null references public.app_roles(key) on update cascade on delete cascade, module text not null, level int not null default 0, pos int not null default 0, primary key (role_key, module));
create table if not exists public.people (ref text primary key, nama text, is_am boolean not null default false, is_programmer boolean not null default false, created_at timestamptz not null default now());
create table if not exists public.products (id text primary key, name text not null, pos int not null default 0);
create table if not exists public.app_settings (key text primary key, data jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now());
`);
  for (const e of ENT) {
    const cols = colSql(e.cols);
    const own = e.own ? `  owner text not null references public.accounts(username) on update cascade on delete cascade,\n` : "";
    out.push(`create table if not exists public.${e.table} (\n  ${e.pk} text primary key,\n${own}${cols},\n  extra jsonb,\n  updated_at timestamptz not null default now()\n);`);
    for (const ch of e.children || []) {
      const cc = ch.scalar ? colSql(ch.cols) : colSql(ch.cols);
      out.push(`create table if not exists public.${ch.table} (\n  id bigint generated always as identity primary key,\n  ${ch.fk} text not null references public.${e.table}(${e.pk}) on update cascade on delete cascade,\n  pos int not null default 0,\n${cc},\n  extra jsonb\n);\ncreate index if not exists ${ch.table}_${ch.fk}_idx on public.${ch.table}(${ch.fk});`);
    }
  }
  return out.join("\n\n");
}

export const ALL_TABLES = () => ["app_roles", "role_access", "people", "products", "app_settings", ...ENT.flatMap((e) => [e.table, ...(e.children || []).map((c) => c.table)])];
export const ADMIN_ONLY = ["accounts", "user_roles", "app_roles", "role_access", "app_settings", "products"];
export const PERSON_FLAGS = ["is_am", "is_programmer"];
