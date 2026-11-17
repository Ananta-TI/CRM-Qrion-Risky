# QRION CRM (Next.js + Tailwind)

Port dari prototipe HTML QRION CRM ke Next.js 16 (App Router, TypeScript) dan Tailwind CSS 4.
Data memakai JSON dummy di `data/` (disimpan ke localStorage browser), sehingga tidak butuh database dulu.

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build produksi
```

Login demo (semua password `qrion123`): `risky` (super admin), `ceo`, `pindy` dan `dila` (Account Manager), `cs`, `ridho` dan `randy` (programmer).

## Struktur

- `app/globals.css` — desain Apple-style dari prototipe, dipindah apa adanya (lapis `components`, sehingga utilitas Tailwind bisa menimpa).
- `lib/core.ts` — konstanta dan logika murni (SLA, triase, kontrak, hak akses default).
- `lib/db.ts` — lapisan data. Ganti isinya dengan API/DB saat produksi, antarmukanya tetap.
- `lib/session.tsx`, `lib/access.ts`, `lib/auth.ts` — login, peran, hak akses.
- `data/*.json` — data dummy. Token seperti `@d-3` (3 hari lalu) diubah jadi tanggal nyata saat pertama dimuat.
- `features/` — satu folder per modul; `features/ViewRouter.tsx` memetakan menu ke komponen.

Reset data demo: hapus localStorage `qrion-next-db-v1` di browser.

## Database (Supabase)

Struktur tabel relasional ada di `lib/dbmap.mjs` (sumber tunggal). Untuk membuat database dari nol:

1. Jalankan `supabase/1_struktur.sql` lalu `supabase/2_data.sql` di Supabase SQL Editor (atau `setup_all.sql` sekaligus). Skrip ini menghapus dan membuat ulang tabel CRM.
2. Isi `.env.local` dengan URL dan publishable key project (lihat `.env.example`).
3. Login: `risky` / `qrion123` (akun lain: ceo, pm, cs, tika, pindy, dila, nadia, ridho, randy, bima, semuanya `qrion123`).

Mengubah data dummy: edit `scripts/make_data.py`, jalankan `python3 scripts/make_data.py` lalu `node scripts/gen-sql.mjs`.
