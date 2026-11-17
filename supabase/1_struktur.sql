-- ============================================================
-- QRION CRM: setup database lengkap (tabel relasional, RLS, data dummy, akun login)
-- Dibuat otomatis oleh scripts/gen-sql.mjs. Jalankan SEKALI di Supabase SQL Editor.
-- PERINGATAN: skrip ini MENGHAPUS lalu membuat ulang semua tabel CRM.
-- ============================================================
create extension if not exists pgcrypto;
drop table if exists public.records cascade;
drop table if exists public.notes cascade;
drop table if exists public.audit_log cascade;
drop table if exists public.attendance cascade;
drop table if exists public.branding_assets cascade;
drop table if exists public.letter_templates cascade;
drop table if exists public.mou cascade;
drop table if exists public.letters cascade;
drop table if exists public.expenses cascade;
drop table if exists public.payment_items cascade;
drop table if exists public.payments cascade;
drop table if exists public.invoice_items cascade;
drop table if exists public.invoices cascade;
drop table if exists public.lead_logs cascade;
drop table if exists public.lead_products cascade;
drop table if exists public.leads cascade;
drop table if exists public.project_logs cascade;
drop table if exists public.project_milestones cascade;
drop table if exists public.project_assignees cascade;
drop table if exists public.projects cascade;
drop table if exists public.issue_messages cascade;
drop table if exists public.issues cascade;
drop table if exists public.school_logs cascade;
drop table if exists public.school_contacts cascade;
drop table if exists public.school_products cascade;
drop table if exists public.schools cascade;
drop table if exists public.team_members cascade;
drop table if exists public.user_roles cascade;
drop table if exists public.accounts cascade;
drop table if exists public.app_settings cascade;
drop table if exists public.products cascade;
drop table if exists public.people cascade;
drop table if exists public.role_access cascade;
drop table if exists public.app_roles cascade;

-- Tabel master
create table if not exists public.app_roles (key text primary key, name text not null, home text not null default 'ringkasan', pos int not null default 0, created_at timestamptz not null default now());
create table if not exists public.role_access (role_key text not null references public.app_roles(key) on update cascade on delete cascade, module text not null, level int not null default 0, pos int not null default 0, primary key (role_key, module));
create table if not exists public.people (ref text primary key, nama text, is_am boolean not null default false, is_programmer boolean not null default false, created_at timestamptz not null default now());
create table if not exists public.products (id text primary key, name text not null, pos int not null default 0);
create table if not exists public.app_settings (key text primary key, data jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now());


create table if not exists public.accounts (
  username text primary key,
  nama text not null default '',
  role_key text references public.app_roles(key) on update cascade on delete restrict,
  aktif boolean not null default true,
  dibuat timestamptz,
  am text references public.people(ref) on update cascade on delete set null,
  extra jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  user_ref text primary key,
  role_key text references public.app_roles(key) on update cascade on delete restrict,
  extra jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id text primary key,
  joined_at timestamptz,
  extra jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.schools (
  id text primary key,
  name text not null default '',
  city text,
  jenjang text,
  status text not null default 'onboarding',
  am text references public.people(ref) on update cascade on delete set null,
  students integer,
  contract_start date,
  contract_end date,
  pic_name text,
  pic_phone text,
  address text,
  next_action text,
  next_date date,
  notes text,
  contoh boolean,
  created_at timestamptz,
  created_by text references public.people(ref) on update cascade on delete set null,
  extra jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.school_products (
  id bigint generated always as identity primary key,
  school_id text not null references public.schools(id) on update cascade on delete cascade,
  pos int not null default 0,
  product_id text references public.products(id) on update cascade on delete set null,
  mrr numeric not null default 0,
  extra jsonb
);
create index if not exists school_products_school_id_idx on public.school_products(school_id);

create table if not exists public.school_contacts (
  id bigint generated always as identity primary key,
  school_id text not null references public.schools(id) on update cascade on delete cascade,
  pos int not null default 0,
  name text,
  title text,
  phone text,
  extra jsonb
);
create index if not exists school_contacts_school_id_idx on public.school_contacts(school_id);

create table if not exists public.school_logs (
  id bigint generated always as identity primary key,
  school_id text not null references public.schools(id) on update cascade on delete cascade,
  pos int not null default 0,
  at timestamptz,
  by_ref text references public.people(ref) on update cascade on delete set null,
  type text,
  text text,
  extra jsonb
);
create index if not exists school_logs_school_id_idx on public.school_logs(school_id);

create table if not exists public.issues (
  id text primary key,
  subject text not null default '',
  description text,
  status text not null default 'Open',
  urgency text not null default 'Medium',
  category text,
  school_id text references public.schools(id) on update cascade on delete set null,
  product_id text references public.products(id) on update cascade on delete set null,
  assignee text references public.people(ref) on update cascade on delete set null,
  am text references public.people(ref) on update cascade on delete set null,
  reporter text,
  created_by text references public.people(ref) on update cascade on delete set null,
  created_at timestamptz,
  reported_date date,
  sla_deadline timestamptz,
  first_response_at timestamptz,
  closed_at timestamptz,
  sla_breached boolean,
  reopen_count integer,
  paused_minutes numeric,
  paused_at timestamptz,
  csat_score integer,
  csat_comment text,
  tx_amount numeric,
  attachments jsonb,
  contoh boolean,
  extra jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.issue_messages (
  id bigint generated always as identity primary key,
  issue_id text not null references public.issues(id) on update cascade on delete cascade,
  pos int not null default 0,
  at timestamptz,
  by_ref text references public.people(ref) on update cascade on delete set null,
  kind text,
  body text,
  files jsonb,
  extra jsonb
);
create index if not exists issue_messages_issue_id_idx on public.issue_messages(issue_id);

create table if not exists public.projects (
  id text primary key,
  name text not null default '',
  school_id text references public.schools(id) on update cascade on delete set null,
  status text not null default 'perencanaan',
  type text,
  priority text,
  start_date date,
  end_date date,
  assignee text references public.people(ref) on update cascade on delete set null,
  pm text references public.people(ref) on update cascade on delete set null,
  notes text,
  contoh boolean,
  created_at timestamptz,
  created_by text references public.people(ref) on update cascade on delete set null,
  extra jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.project_assignees (
  id bigint generated always as identity primary key,
  project_id text not null references public.projects(id) on update cascade on delete cascade,
  pos int not null default 0,
  person text references public.people(ref) on update cascade on delete set null,
  extra jsonb
);
create index if not exists project_assignees_project_id_idx on public.project_assignees(project_id);

create table if not exists public.project_milestones (
  id bigint generated always as identity primary key,
  project_id text not null references public.projects(id) on update cascade on delete cascade,
  pos int not null default 0,
  title text,
  due date,
  status text,
  who text references public.people(ref) on update cascade on delete set null,
  extra jsonb
);
create index if not exists project_milestones_project_id_idx on public.project_milestones(project_id);

create table if not exists public.project_logs (
  id bigint generated always as identity primary key,
  project_id text not null references public.projects(id) on update cascade on delete cascade,
  pos int not null default 0,
  at timestamptz,
  by_ref text references public.people(ref) on update cascade on delete set null,
  text text,
  extra jsonb
);
create index if not exists project_logs_project_id_idx on public.project_logs(project_id);

create table if not exists public.leads (
  id text primary key,
  name text not null default '',
  stage text not null default 'baru',
  est_mrr numeric,
  source text,
  am text references public.people(ref) on update cascade on delete set null,
  city text,
  contact text,
  phone text,
  next_date date,
  next_action text,
  close_date date,
  lost_reason text,
  notes text,
  contoh boolean,
  created_at timestamptz,
  created_by text references public.people(ref) on update cascade on delete set null,
  school_id text references public.schools(id) on update cascade on delete set null,
  extra jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_products (
  id bigint generated always as identity primary key,
  lead_id text not null references public.leads(id) on update cascade on delete cascade,
  pos int not null default 0,
  product_id text references public.products(id) on update cascade on delete set null,
  extra jsonb
);
create index if not exists lead_products_lead_id_idx on public.lead_products(lead_id);

create table if not exists public.lead_logs (
  id bigint generated always as identity primary key,
  lead_id text not null references public.leads(id) on update cascade on delete cascade,
  pos int not null default 0,
  at timestamptz,
  by_ref text references public.people(ref) on update cascade on delete set null,
  type text,
  text text,
  extra jsonb
);
create index if not exists lead_logs_lead_id_idx on public.lead_logs(lead_id);

create table if not exists public.invoices (
  id text primary key,
  no text,
  school_id text references public.schools(id) on update cascade on delete set null,
  untuk text,
  alamat_untuk text,
  tanggal date,
  jatuh_tempo date,
  status text not null default 'draft',
  ppn numeric,
  diskon numeric,
  paid_at date,
  catatan text,
  contoh boolean,
  created_at timestamptz,
  created_by text references public.people(ref) on update cascade on delete set null,
  extra jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.invoice_items (
  id bigint generated always as identity primary key,
  invoice_id text not null references public.invoices(id) on update cascade on delete cascade,
  pos int not null default 0,
  nama text,
  qty numeric,
  harga numeric,
  extra jsonb
);
create index if not exists invoice_items_invoice_id_idx on public.invoice_items(invoice_id);

create table if not exists public.payments (
  id text primary key,
  school_id text references public.schools(id) on update cascade on delete set null,
  tipe text not null default 'langganan',
  tanggal date,
  total numeric not null default 0,
  catatan text,
  bukti text,
  invoice_id text references public.invoices(id) on update cascade on delete set null,
  contoh boolean,
  created_at timestamptz,
  created_by text references public.people(ref) on update cascade on delete set null,
  extra jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_items (
  id bigint generated always as identity primary key,
  payment_id text not null references public.payments(id) on update cascade on delete cascade,
  pos int not null default 0,
  jenis text,
  nama text,
  bulan text[],
  nominal numeric,
  qty numeric,
  extra jsonb
);
create index if not exists payment_items_payment_id_idx on public.payment_items(payment_id);

create table if not exists public.expenses (
  id text primary key,
  tanggal date,
  kategori text,
  deskripsi text,
  jumlah numeric not null default 0,
  vendor text,
  rutin boolean,
  bukti text,
  catatan text,
  created_at timestamptz,
  created_by text references public.people(ref) on update cascade on delete set null,
  extra jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.letters (
  id text primary key,
  pihak text,
  school_id text references public.schools(id) on update cascade on delete set null,
  perihal text,
  nomor text,
  kode text,
  arah text,
  tanggal date,
  status text,
  lampiran jsonb,
  lampiran_ket text,
  catatan text,
  created_at timestamptz,
  created_by text references public.people(ref) on update cascade on delete set null,
  extra jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.mou (
  id text primary key,
  untuk text,
  school_id text references public.schools(id) on update cascade on delete set null,
  judul text,
  nomor text,
  status text,
  tanggal_ttd date,
  mulai date,
  berakhir date,
  lampiran jsonb,
  lampiran_ket text,
  catatan text,
  created_at timestamptz,
  created_by text references public.people(ref) on update cascade on delete set null,
  extra jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.letter_templates (
  id text primary key,
  menu text,
  nama text,
  kode text,
  link text,
  ket text,
  files jsonb,
  dibuat timestamptz,
  diubah timestamptz,
  extra jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.branding_assets (
  id text primary key,
  judul text,
  kategori text,
  product_id text references public.products(id) on update cascade on delete set null,
  deskripsi text,
  tautan text,
  files jsonb,
  dibuat timestamptz,
  contoh boolean,
  extra jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.attendance (
  id text primary key,
  tanggal date,
  uid text references public.people(ref) on update cascade on delete set null,
  nama text,
  status text,
  masuk timestamptz,
  pulang timestamptz,
  catatan text,
  cat text,
  extra jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_log (
  id text primary key,
  t timestamptz,
  by_name text,
  menu text,
  aksi text,
  extra jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.notes (
  id text primary key,
  owner text not null references public.accounts(username) on update cascade on delete cascade,
  teks text,
  dibuat timestamptz,
  diubah timestamptz,
  extra jsonb,
  updated_at timestamptz not null default now()
);

-- ===== Fungsi bantu hak akses =====
create or replace function public.qrion_user() returns text language sql stable as $$
  select split_part(coalesce(auth.jwt() ->> 'email', ''), '@', 1) $$;
create or replace function public.qrion_role() returns text language sql stable security definer set search_path = public as $$
  select a.role_key from public.accounts a where a.username = public.qrion_user() and a.aktif $$;


-- ===== Hak akses baris (RLS) =====
alter table public.app_roles enable row level security;
create policy app_roles_sel on public.app_roles for select to authenticated using (public.qrion_role() is not null);
create policy app_roles_ins on public.app_roles for insert to authenticated with check (public.qrion_role() = 'admin');
create policy app_roles_upd on public.app_roles for update to authenticated using (public.qrion_role() = 'admin') with check (public.qrion_role() = 'admin');
create policy app_roles_del on public.app_roles for delete to authenticated using (public.qrion_role() = 'admin');
alter table public.role_access enable row level security;
create policy role_access_sel on public.role_access for select to authenticated using (public.qrion_role() is not null);
create policy role_access_ins on public.role_access for insert to authenticated with check (public.qrion_role() = 'admin');
create policy role_access_upd on public.role_access for update to authenticated using (public.qrion_role() = 'admin') with check (public.qrion_role() = 'admin');
create policy role_access_del on public.role_access for delete to authenticated using (public.qrion_role() = 'admin');
alter table public.people enable row level security;
create policy people_sel on public.people for select to authenticated using (public.qrion_role() is not null);
create policy people_ins on public.people for insert to authenticated with check (public.qrion_role() is not null);
create policy people_upd on public.people for update to authenticated using (public.qrion_role() is not null) with check (public.qrion_role() is not null);
create policy people_del on public.people for delete to authenticated using (public.qrion_role() is not null);
alter table public.products enable row level security;
create policy products_sel on public.products for select to authenticated using (public.qrion_role() is not null);
create policy products_ins on public.products for insert to authenticated with check (public.qrion_role() = 'admin');
create policy products_upd on public.products for update to authenticated using (public.qrion_role() = 'admin') with check (public.qrion_role() = 'admin');
create policy products_del on public.products for delete to authenticated using (public.qrion_role() = 'admin');
alter table public.app_settings enable row level security;
create policy app_settings_sel on public.app_settings for select to authenticated using (public.qrion_role() is not null);
create policy app_settings_ins on public.app_settings for insert to authenticated with check (public.qrion_role() = 'admin');
create policy app_settings_upd on public.app_settings for update to authenticated using (public.qrion_role() = 'admin') with check (public.qrion_role() = 'admin');
create policy app_settings_del on public.app_settings for delete to authenticated using (public.qrion_role() = 'admin');
alter table public.accounts enable row level security;
create policy accounts_sel on public.accounts for select to authenticated using (public.qrion_role() is not null);
create policy accounts_ins on public.accounts for insert to authenticated with check (public.qrion_role() = 'admin');
create policy accounts_upd on public.accounts for update to authenticated using (public.qrion_role() = 'admin') with check (public.qrion_role() = 'admin');
create policy accounts_del on public.accounts for delete to authenticated using (public.qrion_role() = 'admin');
alter table public.user_roles enable row level security;
create policy user_roles_sel on public.user_roles for select to authenticated using (public.qrion_role() is not null);
create policy user_roles_ins on public.user_roles for insert to authenticated with check (public.qrion_role() = 'admin');
create policy user_roles_upd on public.user_roles for update to authenticated using (public.qrion_role() = 'admin') with check (public.qrion_role() = 'admin');
create policy user_roles_del on public.user_roles for delete to authenticated using (public.qrion_role() = 'admin');
alter table public.team_members enable row level security;
create policy team_members_sel on public.team_members for select to authenticated using (public.qrion_role() is not null);
create policy team_members_ins on public.team_members for insert to authenticated with check (public.qrion_role() is not null);
create policy team_members_upd on public.team_members for update to authenticated using (public.qrion_role() is not null) with check (public.qrion_role() is not null);
create policy team_members_del on public.team_members for delete to authenticated using (public.qrion_role() is not null);
alter table public.schools enable row level security;
create policy schools_sel on public.schools for select to authenticated using (public.qrion_role() is not null);
create policy schools_ins on public.schools for insert to authenticated with check (public.qrion_role() is not null);
create policy schools_upd on public.schools for update to authenticated using (public.qrion_role() is not null) with check (public.qrion_role() is not null);
create policy schools_del on public.schools for delete to authenticated using (public.qrion_role() is not null);
alter table public.school_products enable row level security;
create policy school_products_sel on public.school_products for select to authenticated using (public.qrion_role() is not null);
create policy school_products_ins on public.school_products for insert to authenticated with check (public.qrion_role() is not null);
create policy school_products_upd on public.school_products for update to authenticated using (public.qrion_role() is not null) with check (public.qrion_role() is not null);
create policy school_products_del on public.school_products for delete to authenticated using (public.qrion_role() is not null);
alter table public.school_contacts enable row level security;
create policy school_contacts_sel on public.school_contacts for select to authenticated using (public.qrion_role() is not null);
create policy school_contacts_ins on public.school_contacts for insert to authenticated with check (public.qrion_role() is not null);
create policy school_contacts_upd on public.school_contacts for update to authenticated using (public.qrion_role() is not null) with check (public.qrion_role() is not null);
create policy school_contacts_del on public.school_contacts for delete to authenticated using (public.qrion_role() is not null);
alter table public.school_logs enable row level security;
create policy school_logs_sel on public.school_logs for select to authenticated using (public.qrion_role() is not null);
create policy school_logs_ins on public.school_logs for insert to authenticated with check (public.qrion_role() is not null);
create policy school_logs_upd on public.school_logs for update to authenticated using (public.qrion_role() is not null) with check (public.qrion_role() is not null);
create policy school_logs_del on public.school_logs for delete to authenticated using (public.qrion_role() is not null);
alter table public.issues enable row level security;
create policy issues_sel on public.issues for select to authenticated using (public.qrion_role() is not null);
create policy issues_ins on public.issues for insert to authenticated with check (public.qrion_role() is not null);
create policy issues_upd on public.issues for update to authenticated using (public.qrion_role() is not null) with check (public.qrion_role() is not null);
create policy issues_del on public.issues for delete to authenticated using (public.qrion_role() is not null);
alter table public.issue_messages enable row level security;
create policy issue_messages_sel on public.issue_messages for select to authenticated using (public.qrion_role() is not null);
create policy issue_messages_ins on public.issue_messages for insert to authenticated with check (public.qrion_role() is not null);
create policy issue_messages_upd on public.issue_messages for update to authenticated using (public.qrion_role() is not null) with check (public.qrion_role() is not null);
create policy issue_messages_del on public.issue_messages for delete to authenticated using (public.qrion_role() is not null);
alter table public.projects enable row level security;
create policy projects_sel on public.projects for select to authenticated using (public.qrion_role() is not null);
create policy projects_ins on public.projects for insert to authenticated with check (public.qrion_role() is not null);
create policy projects_upd on public.projects for update to authenticated using (public.qrion_role() is not null) with check (public.qrion_role() is not null);
create policy projects_del on public.projects for delete to authenticated using (public.qrion_role() is not null);
alter table public.project_assignees enable row level security;
create policy project_assignees_sel on public.project_assignees for select to authenticated using (public.qrion_role() is not null);
create policy project_assignees_ins on public.project_assignees for insert to authenticated with check (public.qrion_role() is not null);
create policy project_assignees_upd on public.project_assignees for update to authenticated using (public.qrion_role() is not null) with check (public.qrion_role() is not null);
create policy project_assignees_del on public.project_assignees for delete to authenticated using (public.qrion_role() is not null);
alter table public.project_milestones enable row level security;
create policy project_milestones_sel on public.project_milestones for select to authenticated using (public.qrion_role() is not null);
create policy project_milestones_ins on public.project_milestones for insert to authenticated with check (public.qrion_role() is not null);
create policy project_milestones_upd on public.project_milestones for update to authenticated using (public.qrion_role() is not null) with check (public.qrion_role() is not null);
create policy project_milestones_del on public.project_milestones for delete to authenticated using (public.qrion_role() is not null);
alter table public.project_logs enable row level security;
create policy project_logs_sel on public.project_logs for select to authenticated using (public.qrion_role() is not null);
create policy project_logs_ins on public.project_logs for insert to authenticated with check (public.qrion_role() is not null);
create policy project_logs_upd on public.project_logs for update to authenticated using (public.qrion_role() is not null) with check (public.qrion_role() is not null);
create policy project_logs_del on public.project_logs for delete to authenticated using (public.qrion_role() is not null);
alter table public.leads enable row level security;
create policy leads_sel on public.leads for select to authenticated using (public.qrion_role() is not null);
create policy leads_ins on public.leads for insert to authenticated with check (public.qrion_role() is not null);
create policy leads_upd on public.leads for update to authenticated using (public.qrion_role() is not null) with check (public.qrion_role() is not null);
create policy leads_del on public.leads for delete to authenticated using (public.qrion_role() is not null);
alter table public.lead_products enable row level security;
create policy lead_products_sel on public.lead_products for select to authenticated using (public.qrion_role() is not null);
create policy lead_products_ins on public.lead_products for insert to authenticated with check (public.qrion_role() is not null);
create policy lead_products_upd on public.lead_products for update to authenticated using (public.qrion_role() is not null) with check (public.qrion_role() is not null);
create policy lead_products_del on public.lead_products for delete to authenticated using (public.qrion_role() is not null);
alter table public.lead_logs enable row level security;
create policy lead_logs_sel on public.lead_logs for select to authenticated using (public.qrion_role() is not null);
create policy lead_logs_ins on public.lead_logs for insert to authenticated with check (public.qrion_role() is not null);
create policy lead_logs_upd on public.lead_logs for update to authenticated using (public.qrion_role() is not null) with check (public.qrion_role() is not null);
create policy lead_logs_del on public.lead_logs for delete to authenticated using (public.qrion_role() is not null);
alter table public.invoices enable row level security;
create policy invoices_sel on public.invoices for select to authenticated using (public.qrion_role() is not null);
create policy invoices_ins on public.invoices for insert to authenticated with check (public.qrion_role() is not null);
create policy invoices_upd on public.invoices for update to authenticated using (public.qrion_role() is not null) with check (public.qrion_role() is not null);
create policy invoices_del on public.invoices for delete to authenticated using (public.qrion_role() is not null);
alter table public.invoice_items enable row level security;
create policy invoice_items_sel on public.invoice_items for select to authenticated using (public.qrion_role() is not null);
create policy invoice_items_ins on public.invoice_items for insert to authenticated with check (public.qrion_role() is not null);
create policy invoice_items_upd on public.invoice_items for update to authenticated using (public.qrion_role() is not null) with check (public.qrion_role() is not null);
create policy invoice_items_del on public.invoice_items for delete to authenticated using (public.qrion_role() is not null);
alter table public.payments enable row level security;
create policy payments_sel on public.payments for select to authenticated using (public.qrion_role() is not null);
create policy payments_ins on public.payments for insert to authenticated with check (public.qrion_role() is not null);
create policy payments_upd on public.payments for update to authenticated using (public.qrion_role() is not null) with check (public.qrion_role() is not null);
create policy payments_del on public.payments for delete to authenticated using (public.qrion_role() is not null);
alter table public.payment_items enable row level security;
create policy payment_items_sel on public.payment_items for select to authenticated using (public.qrion_role() is not null);
create policy payment_items_ins on public.payment_items for insert to authenticated with check (public.qrion_role() is not null);
create policy payment_items_upd on public.payment_items for update to authenticated using (public.qrion_role() is not null) with check (public.qrion_role() is not null);
create policy payment_items_del on public.payment_items for delete to authenticated using (public.qrion_role() is not null);
alter table public.expenses enable row level security;
create policy expenses_sel on public.expenses for select to authenticated using (public.qrion_role() is not null);
create policy expenses_ins on public.expenses for insert to authenticated with check (public.qrion_role() is not null);
create policy expenses_upd on public.expenses for update to authenticated using (public.qrion_role() is not null) with check (public.qrion_role() is not null);
create policy expenses_del on public.expenses for delete to authenticated using (public.qrion_role() is not null);
alter table public.letters enable row level security;
create policy letters_sel on public.letters for select to authenticated using (public.qrion_role() is not null);
create policy letters_ins on public.letters for insert to authenticated with check (public.qrion_role() is not null);
create policy letters_upd on public.letters for update to authenticated using (public.qrion_role() is not null) with check (public.qrion_role() is not null);
create policy letters_del on public.letters for delete to authenticated using (public.qrion_role() is not null);
alter table public.mou enable row level security;
create policy mou_sel on public.mou for select to authenticated using (public.qrion_role() is not null);
create policy mou_ins on public.mou for insert to authenticated with check (public.qrion_role() is not null);
create policy mou_upd on public.mou for update to authenticated using (public.qrion_role() is not null) with check (public.qrion_role() is not null);
create policy mou_del on public.mou for delete to authenticated using (public.qrion_role() is not null);
alter table public.letter_templates enable row level security;
create policy letter_templates_sel on public.letter_templates for select to authenticated using (public.qrion_role() is not null);
create policy letter_templates_ins on public.letter_templates for insert to authenticated with check (public.qrion_role() is not null);
create policy letter_templates_upd on public.letter_templates for update to authenticated using (public.qrion_role() is not null) with check (public.qrion_role() is not null);
create policy letter_templates_del on public.letter_templates for delete to authenticated using (public.qrion_role() is not null);
alter table public.branding_assets enable row level security;
create policy branding_assets_sel on public.branding_assets for select to authenticated using (public.qrion_role() is not null);
create policy branding_assets_ins on public.branding_assets for insert to authenticated with check (public.qrion_role() is not null);
create policy branding_assets_upd on public.branding_assets for update to authenticated using (public.qrion_role() is not null) with check (public.qrion_role() is not null);
create policy branding_assets_del on public.branding_assets for delete to authenticated using (public.qrion_role() is not null);
alter table public.attendance enable row level security;
create policy attendance_sel on public.attendance for select to authenticated using (public.qrion_role() is not null);
create policy attendance_ins on public.attendance for insert to authenticated with check (public.qrion_role() is not null);
create policy attendance_upd on public.attendance for update to authenticated using (public.qrion_role() is not null) with check (public.qrion_role() is not null);
create policy attendance_del on public.attendance for delete to authenticated using (public.qrion_role() is not null);
alter table public.audit_log enable row level security;
create policy audit_log_sel on public.audit_log for select to authenticated using (public.qrion_role() = 'admin');
create policy audit_log_ins on public.audit_log for insert to authenticated with check (public.qrion_role() is not null);
create policy audit_log_upd on public.audit_log for update to authenticated using (public.qrion_role() is not null) with check (public.qrion_role() is not null);
create policy audit_log_del on public.audit_log for delete to authenticated using (public.qrion_role() is not null);
alter table public.notes enable row level security;
create policy notes_sel on public.notes for select to authenticated using (owner = public.qrion_user());
create policy notes_ins on public.notes for insert to authenticated with check (owner = public.qrion_user());
create policy notes_upd on public.notes for update to authenticated using (owner = public.qrion_user()) with check (owner = public.qrion_user());
create policy notes_del on public.notes for delete to authenticated using (owner = public.qrion_user());

-- ===== Kelola akun login dari dalam CRM (hanya super admin) =====
create or replace function public.qrion_set_password(uname text, pw text)
returns void language plpgsql security definer set search_path = public, auth, extensions as $$
declare uid uuid; em text := lower(trim(uname)) || '@qrion.local';
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
  delete from auth.users where email = lower(trim(uname)) || '@qrion.local';
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
do $$ begin alter publication supabase_realtime add table public.app_roles; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.role_access; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.people; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.products; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.app_settings; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.accounts; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.user_roles; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.team_members; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.schools; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.school_products; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.school_contacts; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.school_logs; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.issues; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.issue_messages; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.projects; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.project_assignees; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.project_milestones; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.project_logs; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.leads; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.lead_products; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.lead_logs; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.invoices; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.invoice_items; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.payments; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.payment_items; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.expenses; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.letters; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.mou; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.letter_templates; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.branding_assets; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.attendance; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.audit_log; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.notes; exception when duplicate_object then null; end $$;
