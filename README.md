# QRION CRM (Next.js + Tailwind)

Port dari prototipe HTML QRION CRM ke Next.js 16 (App Router, TypeScript) dan Tailwind CSS 4.
Data bisa memakai Supabase (produksi) atau JSON dummy di `data/` yang disimpan ke `localStorage` (mode lokal tanpa env).

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build produksi
npm run lint     # pemeriksaan ESLint
```

Login demo (semua password `qrion123`): `risky` (super admin), `ceo`, `pm`, `cs`, `pindy`/`dila`/`nadia` (Account Manager), `ridho`/`randy`/`bima` (programmer).

## Struktur

```text
src/
├─ app/                     Routing Next.js (App Router)
│  ├─ layout.tsx            <html>, font, provider global
│  ├─ page.tsx              "/" → arahkan ke menu awal sesuai peran
│  └─ (crm)/[view]/page.tsx Satu halaman per menu (generateStaticParams)
├─ components/
│  ├─ layout/               Shell (rail + navigasi), Gate (login), Providers
│  └─ ui/                   Komponen dasar: Pill, Panel, Rows, RowItem, Bars,
│                           RowNav, Toast, ViewFrame
├─ features/
│  ├─ ViewRouter.tsx        Peta menu → komponen
│  ├─ LegacyIsland.tsx      Wadah untuk modul yang masih dirender mesin lama
│  └─ ringkasan/            Modul Ringkasan (React)
├─ lib/
│  ├─ core.ts               Logika murni: SLA, triase, kontrak, format, konstanta
│  ├─ names.ts              Nama tampilan pengguna
│  ├─ auth/                 session, access (hak akses), auth (PBKDF2), supabase
│  ├─ data/                 db (lokal/Supabase), remote, dbmap, tokens
│  └─ legacy/               bridge (shim window.claude) + runtime (mesin modul)
└─ styles/
   ├─ index.css             Titik masuk; urutan impor menentukan kaskade
   ├─ tokens.css            Warna, skala jarak/radius/tipografi
   ├─ base.css              Reset ringan, tipografi, kontrol formulir
   ├─ layout.css            Kerangka aplikasi (rail, main, header)
   ├─ components.css        Panel, tombol, tabel, lencana, dialog, toast
   ├─ views.css             Gaya per modul (tiket, pembayaran, pipeline, dst.)
   └─ responsive.css        Semua media query
```

Folder lain di root: `data/` (seed JSON), `supabase/` (SQL), `scripts/` (generator data & SQL), `public/` (aset statis).

## Tema dan skala desain

- **Selalu mode terang.** `color-scheme: light` dipasang di `html`, jadi kontrol bawaan browser juga terang walau OS memakai mode gelap.
- Skala ukuran mengikuti **rasio emas (φ ≈ 1.618)**: jarak `8 · 13 · 21 · 34 · 55`, radius `8 · 13 · 21 · 34`, tipografi `11 · 13 · 15 · 17 · 21 · 26 · 34 · 55`. Nilai ini hanya didefinisikan di `src/styles/tokens.css`; komponen memakai variabelnya (`--s3`, `--r`, `--fs-h1`, dst.).
- Lebar baris teks panjang dibatasi ±62 karakter agar mudah dibaca.
- Ubah warna atau skala di `tokens.css`; jangan menulis nilai px baru di komponen bila token yang sesuai sudah ada.

Reset data demo (mode lokal): hapus localStorage `qrion-next-db-v2` di browser.

## Database (Supabase)

Struktur tabel relasional ada di `src/lib/data/dbmap.mjs` (sumber tunggal, dipakai klien dan generator SQL).

1. Jalankan `supabase/setup_all.sql` di Supabase SQL Editor (atau `1_struktur.sql` lalu `2_data.sql`). **Skrip ini menghapus dan membuat ulang tabel CRM.**
2. Buat `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```

3. Restart `npm run dev`, lalu login memakai akun dari tabel `accounts`.

Tanpa kedua variabel itu, aplikasi otomatis memakai mode lokal (data JSON + `localStorage`).

Mengubah data dummy: edit `scripts/make_data.py`, jalankan `python scripts/make_data.py`, lalu `node scripts/gen-sql.mjs`.
