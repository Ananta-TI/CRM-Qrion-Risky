#!/usr/bin/env python3
"""Membuat data dummy lengkap (data/*.json). Tanggal memakai token relatif agar selalu segar."""
import json, base64, hashlib, os, random
random.seed(7)
OUT = os.path.join(os.path.dirname(__file__), '..', 'data')
D = lambda n: f"@d{n:+d}"
M = lambda n: f"@m{n:+d}"
def T(day, hm, plus=0): return f"@t{day:+d}d@{hm}" + (f"+{plus}m" if plus else "")
def w(name, obj): json.dump(obj, open(os.path.join(OUT, name + '.json'), 'w'), ensure_ascii=False, indent=1)

# ---------- akun ----------
def cred(pw):
    salt = os.urandom(16); h = hashlib.pbkdf2_hmac('sha256', pw.encode(), salt, 600000, 32)
    return {"salt": base64.b64encode(salt).decode(), "iter": 600000, "hash": base64.b64encode(h).decode()}
ACC = [  # username, nama, role, am
 ("risky", "Risky Antonio", "admin", None), ("ceo", "Dewi Anggraini", "ceo", None), ("pm", "Hendra Saputra", "pm", None),
 ("cs", "Sari Wulandari", "cs", None), ("tika", "Tika Rahmawati", "cs", None),
 ("pindy", "Pindy Maharani", "am", "Pindy"), ("dila", "Dila Putri", "am", "Dila"), ("nadia", "Nadia Safitri", "am", "Nadia"),
 ("ridho", "Ridho Pratama", "programmer", None), ("randy", "Randy Wijaya", "programmer", None), ("bima", "Bima Aditya", "programmer", None)]
accounts = {}
c0 = cred("qrion123")
for i, (u, n, r, am) in enumerate(ACC):
    d = {"nama": n, "role": r, "aktif": True, "dibuat": T(-120 + i, "02:00")}
    if am: d["am"] = am
    d.update(cred("qrion123") if i < 3 else c0)  # hash sama untuk akun lain agar cepat dibuat
    accounts[u] = d
w('accounts', accounts)
w('team', {u: {"joinedAt": T(-110, "03:00")} for u, *_ in ACC})
w('roles', {})

# ---------- pengaturan ----------
ACCESS = {
 "pm": {"name": "Project Manager", "home": "project", "access": dict(ringkasan=1, isu=2, project=3, sekolah=1, pembayaran=2, administrasi=2, branding=2, pipeline=1, absen=2, akses=1)},
 "ceo": {"name": "CEO", "home": "ringkasan", "access": dict(ringkasan=1, isu=2, project=2, sekolah=2, pembayaran=2, administrasi=2, branding=2, pipeline=2, absen=1, akses=1)},
 "programmer": {"name": "Programmer", "home": "isu", "access": dict(ringkasan=0, isu=3, isuNo=1, project=2, sekolah=0, pembayaran=0, pipeline=0, akses=1)},
 "cs": {"name": "Customer Service", "home": "isu", "access": dict(ringkasan=0, isu=2, project=0, sekolah=1, pembayaran=0, branding=1, pipeline=0, akses=1)},
 "am": {"name": "Account Manager", "home": "sekolah", "access": dict(ringkasan=0, isu=2, project=0, sekolah=2, pembayaran=0, administrasi=1, branding=1, pipeline=2, akses=1)}}
PRODS = [("p-a", "Oncard"), ("p-b", "Ontuition"), ("p-c", "Ontime"), ("p-d", "Qrion Jurnal"), ("p-e", "Qrion SPMB"), ("p-f", "Onboard")]
w('settings', {
 "products": {"items": [{"id": i, "name": n} for i, n in PRODS]},
 "ams": {"items": ["Pindy", "Dila", "Nadia"]},
 "people": {"items": ["Ridho", "Randy", "Bima"]},
 "access": {"roles": ACCESS},
 "absen": {"jamMasuk": "09:00", "jamPulang": "16:00", "toleransi": 10},
 "invoice": {"nama": "PT Qrion Digital Edukasi", "kontak": "finance@qrion.id | 0761-555-0101", "alamat": "Jl. Soekarno-Hatta No. 88, Pekanbaru, Riau", "rekening": "BCA 1234567890 a.n. PT Qrion Digital Edukasi", "penandatangan": "Dewi Anggraini, CEO"}})

# ---------- sekolah ----------
S = [
 ("m1", "SMA Harapan Nusantara", "Pekanbaru", "SMA", "aktif", "Pindy", 820, -320, 40, "Bu Rina", "081234567890", "Jl. Merdeka No. 1", [("p-a", 3500000), ("p-b", 1200000)], [("Bu Rina", "Kepala Sekolah", "081234567890"), ("Pak Doni", "Operator Oncard", "081277788899")]),
 ("m2", "SD Cahaya Bangsa", "Dumai", "SD", "onboarding", "Dila", 310, -20, 345, "Pak Anton", "081311112222", "Jl. Sudirman No. 12", [("p-a", 800000)], [("Pak Anton", "Kepala Sekolah", "081311112222")]),
 ("m3", "Yayasan Abdi Negara", "Pekanbaru", "Yayasan", "berisiko", "Pindy", 1500, -400, -12, "Bu Lestari", "081322334455", "Jl. Diponegoro No. 7", [], [("Bu Lestari", "Ketua Yayasan", "081322334455")]),
 ("m4", "SMK Teknologi Riau", "Pekanbaru", "SMK", "aktif", "Dila", 640, -200, 165, "Pak Hendri", "081344556677", "Jl. Tuanku Tambusai No. 45", [("p-a", 2100000), ("p-c", 900000)], [("Pak Hendri", "Wakasek Kurikulum", "081344556677"), ("Bu Yuni", "Bendahara", "081366778899")]),
 ("m5", "SMP Bina Insani", "Siak", "SMP", "aktif", "Nadia", 455, -150, 215, "Bu Mega", "081355667788", "Jl. Raja Kecik No. 3", [("p-a", 1600000), ("p-d", 500000)], [("Bu Mega", "Kepala Sekolah", "081355667788")]),
 ("m6", "SMA Negeri 3 Duri", "Bengkalis", "SMA", "aktif", "Nadia", 980, -300, 65, "Pak Samsul", "081366001122", "Jl. Pertamina No. 21", [("p-a", 3000000), ("p-b", 1000000), ("p-c", 750000)], [("Pak Samsul", "Kepala Sekolah", "081366001122"), ("Bu Ratna", "Operator", "081388990011")]),
 ("m7", "SD Islam Al-Furqan", "Pekanbaru", "SD", "aktif", "Pindy", 270, -90, 275, "Bu Aisyah", "081377445566", "Jl. Arifin Ahmad No. 9", [("p-a", 700000)], [("Bu Aisyah", "Kepala Sekolah", "081377445566")]),
 ("m8", "Yayasan Pendidikan Mutiara", "Dumai", "Yayasan", "churn", "Dila", 1100, -500, -70, "Pak Gunawan", "081399887766", "Jl. Datuk Laksamana No. 5", [], [("Pak Gunawan", "Ketua Yayasan", "081399887766")])]
LOGS = {"m1": [(-3, "Kunjungan evaluasi Oncard", "Kunjungan"), (-25, "Perpanjangan kontrak dibahas dengan kepala sekolah", "Rapat"), (-60, "Pelatihan operator kantin selesai", "Kunjungan")],
        "m2": [(-18, "Kick-off onboarding dan pengumpulan data siswa", "Rapat"), (-9, "Data siswa 310 sudah diimpor", "Catatan")],
        "m3": [(-30, "Telepon PIC, belum ada keputusan perpanjangan", "Telepon"), (-45, "Surat penawaran perpanjangan dikirim", "Email")],
        "m4": [(-7, "Demo Ontime ke wakasek, tertarik absensi guru", "Kunjungan"), (-40, "Evaluasi triwulan, puas dengan Oncard", "Rapat")],
        "m5": [(-12, "Qrion Jurnal mulai dipakai kelas 8", "Catatan"), (-35, "WhatsApp tentang jadwal pelatihan guru", "WhatsApp")],
        "m6": [(-5, "Kunjungan rutin, minta tambahan 2 mesin kartu", "Kunjungan"), (-50, "Pembayaran semester genap diterima", "Catatan")],
        "m7": [(-15, "Panduan top up dibagikan ke wali murid", "WhatsApp")],
        "m8": [(-70, "Kontrak berakhir, yayasan memilih berhenti", "Rapat"), (-85, "Keluhan layanan lambat dari yayasan", "Telepon")]}
schools = {}
for sid, nm, city, jj, st, am, stu, cs, ce, pic, ph, addr, prods, cts in S:
    schools[sid] = {"name": nm, "city": city, "jenjang": jj, "status": st, "am": am, "students": stu, "contractStart": D(cs), "contractEnd": D(ce), "picName": pic, "picPhone": ph, "address": addr,
        "products": [{"productId": p, "mrr": m} for p, m in prods], "contacts": [{"name": a, "title": b, "phone": c} for a, b, c in cts],
        "log": [{"at": T(d, "03:00"), "text": t, "type": ty, "by": "a:" + {"Pindy": "pindy", "Dila": "dila", "Nadia": "nadia"}[am]} for d, t, ty in LOGS[sid]], "createdAt": T(cs - 5, "02:00")}
w('schools', schools)
SCN = {s[0]: s[1] for s in S}

# ---------- isu ----------
SLA = {"Critical": 240, "High": 480, "Medium": 1440, "Low": 4320}
PROG = ["a:ridho", "a:randy", "a:bima"]
CREATORS = ["a:cs", "a:tika", "a:pindy", "a:dila", "a:nadia", "a:risky"]
NM = {"a:ridho": "Ridho", "a:randy": "Randy", "a:bima": "Bima"}
ISSUES = [  # subject, desc, school, cat, urg, prod, reporter
 ("Login gagal di aplikasi Oncard", "Operator tidak bisa login sejak pagi, muncul pesan kata sandi salah.", "m1", "Teknis", "High", "p-a", "Pak Doni"),
 ("Saldo kartu Oncard tidak sesuai", "Saldo beberapa kartu berbeda dengan yang tertera di laporan kantin.", "m2", "Transaksi", "Critical", "p-a", "Pak Anton"),
 ("Top up kartu Oncard tidak masuk", "Beberapa wali murid sudah transfer top up kemarin tapi saldo kartu anak belum bertambah.", "m1", "Transaksi", "High", "p-a", "Operator sekolah"),
 ("Siswa tidak bisa login", "Satu siswa kelas 8A tidak bisa masuk ke aplikasi, kata sandi dianggap salah.", "m1", "Akun", "Medium", "p-a", "Operator sekolah"),
 ("Tertagih dua kali (double charge)", "Wali murid melaporkan SPP bulan ini terpotong dua kali dari rekeningnya.", "m2", "Pembayaran", "Critical", "p-a", "Operator sekolah"),
 ("Lupa kata sandi akun", "Guru Matematika lupa kata sandi dan tidak bisa menerima email reset.", "m3", "Akun", "Low", "p-a", "Bu Lestari"),
 ("Impor data siswa gagal", "File impor siswa kelas 7 ditolak dengan pesan format tidak sesuai.", "m2", "Teknis", "High", "p-a", "Pak Anton"),
 ("Kartu Oncard tidak terbaca di mesin", "Tiga kartu tidak terbaca di mesin kantin, lampu merah menyala.", "m4", "Teknis", "Medium", "p-a", "Bu Yuni"),
 ("Absensi guru tidak tercatat", "Sidik jari guru terbaca di mesin tapi tidak muncul di Ontime.", "m4", "Produk", "High", "p-c", "Pak Hendri"),
 ("Nominal tagihan salah", "Tagihan bulan ini lebih besar dari kesepakatan kontrak.", "m6", "Pembayaran", "Medium", "p-a", "Pak Samsul"),
 ("Aplikasi lambat atau error", "Aplikasi sangat lambat saat jam istirahat ketika banyak transaksi.", "m6", "Teknis", "High", "p-a", "Bu Ratna"),
 ("Nilai atau rapor tidak muncul", "Nilai ujian tengah semester belum tampil di Ontuition untuk kelas 9.", "m1", "Produk", "Medium", "p-b", "Pak Doni"),
 ("Permintaan fitur baru", "Sekolah ingin laporan transaksi harian bisa diunduh dalam format Excel.", "m5", "Produk", "Low", "p-a", "Bu Mega"),
 ("Akun terkunci atau dinonaktifkan", "Akun operator terkunci setelah beberapa kali salah memasukkan sandi.", "m5", "Akun", "Medium", "p-d", "Bu Mega"),
 ("Server tidak bisa diakses", "Semua perangkat di sekolah tidak bisa membuka aplikasi sejak 10 menit lalu.", "m6", "Teknis", "Critical", "p-a", "Pak Samsul"),
 ("Data siswa tidak muncul", "Siswa baru kelas 1 belum tampil di daftar siswa Oncard.", "m7", "Teknis", "Medium", "p-a", "Bu Aisyah"),
 ("Pembayaran sudah dilakukan tapi belum terverifikasi", "Transfer SPP sudah dilakukan kemarin tapi status masih belum lunas.", "m7", "Pembayaran", "High", "p-a", "Bu Aisyah"),
 ("Perubahan data sekolah", "Mohon ubah nama bendahara dan nomor telepon PIC di profil sekolah.", "m4", "Lainnya", "Low", "p-a", "Bu Yuni"),
 ("Laporan transaksi harian kosong", "Laporan harian menampilkan nol padahal ada transaksi di kantin.", "m4", "Transaksi", "High", "p-a", "Pak Hendri"),
 ("Kartu hilang minta diblokir", "Orang tua melaporkan kartu anak hilang dan meminta saldo diblokir.", "m1", "Transaksi", "High", "p-a", "Operator sekolah"),
 ("Jadwal pelatihan guru Qrion Jurnal", "Sekolah meminta jadwal pelatihan tambahan untuk guru baru.", "m5", "Lainnya", "Low", "p-d", "Bu Mega"),
 ("Mesin kartu mati total", "Mesin kartu di koperasi tidak menyala setelah mati listrik.", "m6", "Teknis", "High", "p-a", "Bu Ratna"),
 ("Duplikasi data siswa", "Ada dua siswa dengan NIS yang sama setelah impor ulang.", "m2", "Teknis", "Medium", "p-a", "Pak Anton"),
 ("Reset saldo massal salah", "Saldo 12 kartu kelas 6 ter-reset ke nol setelah pembaruan.", "m7", "Transaksi", "Critical", "p-a", "Bu Aisyah")]
plan = [("Open", 2, 1, None, 0), ("In Progress", 6, 1, 0, 3), ("Closed", 9, 2, 0, 5), ("Closed", 8, 3, 0, 5), ("Closed", 14, 1, 1, 4), ("Closed", 5, 4, 2, 4), ("Closed", 20, 2, 1, 4),
        ("In Progress", 3, 2, 2, 1), ("Waiting Validation", 4, 3, 1, 4), ("Closed", 11, 2, 2, 3), ("In Progress", 2, 5, 0, 5), ("Open", 1, 4, None, 0), ("Open", 1, 6, None, 1),
        ("Closed", 18, 3, 2, 1), ("Closed", 26, 1, 0, 3), ("Waiting Validation", 2, 2, 2, 2), ("Closed", 13, 2, 1, 2), ("Closed", 24, 5, 0, 4), ("Closed", 30, 2, 1, 3),
        ("Closed", 35, 3, 0, 2), ("Closed", 40, 4, 2, 1), ("Closed", 45, 2, 0, 5), ("Closed", 50, 1, 1, 0), ("Open", 0, 8, None, 4)]
ISU_SOL = ["Sudah dicek dan diperbaiki, mohon dicoba lagi.", "Penyebabnya konfigurasi yang berubah setelah pembaruan, sudah dikembalikan.", "Data sudah dikoreksi langsung di database dan dicek di QMS.", "Sudah kami proses ulang manual, hasilnya sudah sesuai.", "Perangkat sudah diatur ulang dan berfungsi normal."]
COMM = ["Terima kasih, sudah berfungsi.", "Cepat ditangani, terima kasih.", "Solusi sudah tepat, tapi sempat menunggu agak lama.", "Sangat membantu.", "Masalah selesai dengan baik."]
MINS = {1: 45, 2: 2880, 8: 600, 9: 300, 11: 180, 12: 120, 13: 1500, 16: 900, 24: 25}  # tiket aktif: menit yang lalu (relatif ke saat dibuka)
issues = {}
for n, (it, pl) in enumerate(zip(ISSUES, plan), 1):
    subj, desc, sch, cat, urg, prod, rep = it
    st, ago, hr, ai, ci = pl
    asg = PROG[ai] if ai is not None else None
    creator = CREATORS[ci]
    hh = f"{hr + 2:02d}:00"
    sla = SLA[urg]
    mins = MINS.get(n)
    if mins: ago = mins // 1440
    at = (lambda plus=0: f"@n-{mins}m" + (f"+{plus}m" if plus else "")) if mins else (lambda plus=0: T(-ago, hh, plus))
    d = {"subject": subj, "description": desc, "schoolId": sch, "category": cat, "urgency": urg, "productId": prod, "status": st, "reporter": rep, "createdBy": creator,
         "createdAt": at(), "reportedDate": D(-ago), "slaDeadline": at(sla), "slaBreached": False, "reopenCount": 0, "pausedMinutes": 0, "pausedAt": None, "csat": None, "closedAt": None, "firstResponseAt": None,
         "messages": [{"at": at(), "by": creator, "kind": "text", "body": desc}]}
    am = {"m1": "Pindy", "m2": "Dila", "m3": "Pindy", "m4": "Dila", "m5": "Nadia", "m6": "Nadia", "m7": "Pindy"}[sch]
    d["am"] = am
    if asg:
        d["assignee"] = asg
        fr = random.choice([15, 20, 35, 55, 90])
        if mins: fr = max(3, min(fr, mins // 4))
        d["firstResponseAt"] = at(fr)
        d["messages"].append({"at": at(fr), "by": asg, "kind": "system", "body": f"Ditugaskan ke {NM[asg]}"})
        if st != "Open":
            d["messages"].append({"at": at(fr + 1), "by": asg, "kind": "system", "body": "Status: Open → In Progress"})
            d["messages"].append({"at": at(fr + max(2, (mins or 60) // 6)), "by": asg, "kind": "text", "body": "Sedang kami periksa, mohon tunggu kabar berikutnya."})
        if st in ("Waiting Validation", "Closed"):
            sol = ISU_SOL[n % len(ISU_SOL)]
            end = fr + random.choice([120, 200, 300, 420]) if urg != "Low" else fr + 900
            if mins: end = max(fr + 10, mins - 5)
            d["messages"].append({"at": at(end - 1), "by": asg, "kind": "text", "body": sol})
            if st == "Waiting Validation":
                d["messages"].append({"at": at(end), "by": asg, "kind": "system", "body": "Status: In Progress → Waiting Validation"})
            else:
                d["messages"].append({"at": at(end), "by": asg, "kind": "system", "body": "Status: In Progress → Closed"})
                d["closedAt"] = at(end)
                d["slaBreached"] = end > sla
                d["csat"] = {"score": [5, 5, 4, 4, 5, 3, 4][n % 7], "comment": COMM[n % 5]}
    issues[f"i{n}"] = d
issues["i2"]["status"] = "In Progress"
w('issues', issues)

# ---------- project ----------
def ms(*a): return [{"title": t, "due": D(dd), "status": s, "who": who} for t, dd, s, who in a]
PRJ = {
 "pr1": {"name": "Implementasi Oncard SMA Harapan", "schoolId": "m1", "status": "berjalan", "type": "Implementasi", "priority": "tinggi", "start": D(-20), "end": D(10), "assignee": "Ridho", "pm": "a:pm", "assignees": ["Ridho", "Randy"],
   "milestones": ms(("Instalasi mesin kartu", 2, "dikerjakan", "Ridho"), ("Pelatihan operator", 6, "belum", "Randy"), ("Survei kebutuhan", -12, "selesai", "Ridho")), "log": [{"at": T(-8, "04:00"), "by": "a:pm", "text": "Survei kebutuhan selesai"}], "notes": "Pemasangan 6 mesin kartu di kantin dan koperasi."},
 "pr2": {"name": "Onboarding SD Cahaya Bangsa", "schoolId": "m2", "status": "berjalan", "type": "Implementasi", "priority": "sedang", "start": D(-18), "end": D(20), "assignee": "Randy", "pm": "a:pm", "assignees": ["Randy"],
   "milestones": ms(("Impor data siswa", -9, "selesai", "Randy"), ("Pembagian kartu", 5, "dikerjakan", "Randy"), ("Pelatihan guru", 14, "belum", "Randy")), "log": [{"at": T(-9, "05:00"), "by": "a:pm", "text": "Data 310 siswa berhasil diimpor"}], "notes": "Onboarding Oncard dari nol."},
 "pr3": {"name": "Integrasi Ontime SMK Teknologi Riau", "schoolId": "m4", "status": "perencanaan", "type": "Implementasi", "priority": "sedang", "start": D(5), "end": D(40), "assignee": "Ridho", "pm": "a:pm", "assignees": ["Ridho", "Bima"],
   "milestones": ms(("Survei mesin sidik jari", 8, "belum", "Ridho"), ("Konfigurasi jam kerja guru", 20, "belum", "Bima")), "log": [], "notes": "Absensi guru dengan sidik jari."},
 "pr4": {"name": "Pembaruan modul laporan transaksi", "schoolId": None, "status": "berjalan", "type": "IT Produk", "priority": "tinggi", "start": D(-14), "end": D(7), "assignee": "Bima", "pm": "a:pm", "assignees": ["Bima", "Randy"],
   "milestones": ms(("Rancang ulang laporan harian", -7, "selesai", "Bima"), ("Ekspor Excel", 2, "dikerjakan", "Randy"), ("Uji di 3 sekolah", 6, "belum", "Bima")), "log": [{"at": T(-3, "06:00"), "by": "a:bima", "text": "Ekspor Excel tahap uji"}], "notes": "Menjawab permintaan fitur dari beberapa sekolah."},
 "pr5": {"name": "Perbaikan stabilitas server saat jam sibuk", "schoolId": None, "status": "tertahan", "type": "IT Produk", "priority": "kritis", "start": D(-25), "end": D(-2), "assignee": "Ridho", "pm": "a:pm", "assignees": ["Ridho"],
   "milestones": ms(("Analisis beban", -18, "selesai", "Ridho"), ("Tambah kapasitas server", -5, "belum", "Ridho")), "log": [{"at": T(-4, "04:00"), "by": "a:pm", "text": "Menunggu persetujuan anggaran server"}], "notes": "Tertahan menunggu anggaran."},
 "pr6": {"name": "Kampanye pendaftaran siswa baru (SPMB)", "schoolId": None, "status": "selesai", "type": "Bisnis", "priority": "sedang", "start": D(-60), "end": D(-20), "assignee": "Randy", "pm": "a:ceo", "assignees": ["Randy"],
   "milestones": ms(("Materi promosi", -50, "selesai", "Randy"), ("Webinar SPMB", -30, "selesai", "Randy")), "log": [{"at": T(-20, "05:00"), "by": "a:ceo", "text": "Kampanye selesai, 4 leads baru"}], "notes": "Kampanye Qrion SPMB."}}
for p in PRJ.values():
    if p["schoolId"] is None: p.pop("schoolId")
w('projects', PRJ)

# ---------- leads ----------
LD = [("l1", "SMP Tunas Harapan", "proposal", 2000000, "Daftar akun QMS", "Dila", "Siak", "Bu Mega", "0811111222", 2, "Kirim penawaran", ["p-a"]),
 ("l2", "SMA Plus Mandiri", "demo", 3200000, "Website (Live Preview)", "Pindy", "Pekanbaru", "Pak Rudi", "0812222333", 3, "Jadwalkan demo Oncard", ["p-a", "p-b"]),
 ("l3", "SD Negeri 12 Dumai", "kontak", 700000, "Chat WA QRION", "Dila", "Dumai", "Bu Wati", "0813333444", 1, "Kirim brosur", ["p-a"]),
 ("l4", "Yayasan Al-Hikmah", "negosiasi", 5200000, "Leads Offline", "Nadia", "Bengkalis", "Ustaz Farhan", "0814444555", 4, "Revisi harga paket", ["p-a", "p-b", "p-c"]),
 ("l5", "SMK Bina Karya", "baru", 1800000, "Website (Live Preview)", "Nadia", "Duri", "Pak Edi", "0815555666", 2, "Telepon pertama", ["p-a"]),
 ("l6", "SMP Islam Ar-Raudah", "menang", 1500000, "Daftar akun QMS", "Pindy", "Pekanbaru", "Bu Nurul", "0816666777", None, None, ["p-a", "p-d"]),
 ("l7", "SD Mutiara Bunda", "kalah", 900000, "Chat WA QRION", "Dila", "Dumai", "Bu Reni", "0817777888", None, None, ["p-a"]),
 ("l8", "SMA Taruna Bangsa", "proposal", 4100000, "Leads Offline", "Pindy", "Pekanbaru", "Pak Wahyu", "0818888999", 5, "Presentasi ke komite", ["p-a", "p-b"]),
 ("l9", "Yayasan Nurul Ilmi", "demo", 2600000, "Website (Live Preview)", "Nadia", "Siak", "Bu Salma", "0819999000", 6, "Demo Qrion Jurnal", ["p-a", "p-d"])]
leads = {}
for lid, nm, st, mrr, src, am, city, ct, ph, nd, na, pr in LD:
    d = {"name": nm, "stage": st, "estMrr": mrr, "source": src, "am": am, "city": city, "contact": ct, "phone": ph, "products": pr, "createdAt": T(-30, "03:00"),
         "log": [{"at": T(-15, "04:00"), "type": "Telepon", "text": f"Telepon {ct}, tertarik mencoba"}, {"at": T(-6, "05:00"), "type": "WhatsApp", "text": "Kirim materi pengenalan"}]}
    if nd: d["nextDate"] = D(nd); d["nextAction"] = na; d["closeDate"] = D(nd + 20)
    if st == "menang": d["log"].append({"at": T(-3, "06:00"), "type": "Catatan", "text": "Kontrak ditandatangani"})
    if st == "kalah": d["lostReason"] = "Memilih vendor lain dengan harga lebih murah"
    leads[lid] = d
w('leads', leads)

# ---------- pembayaran / invoice ----------
def item(j, n, bl, nom): return {"jenis": j, "nama": n, "bulan": [M(b) for b in bl], "nominal": nom}
PAY = {
 "p1": ("m1", "langganan", -40, [item("langganan", "Oncard", [-3, -2], 3500000), item("langganan", "Ontuition", [-3, -2], 1200000), item("tambahan", "Kartu Oncard", [-3], 100000)]),
 "p2": ("m1", "langganan", -10, [item("langganan", "Oncard", [-1, 0], 3500000), item("langganan", "Ontuition", [-1, 0], 1200000)]),
 "p3": ("m4", "langganan", -35, [item("langganan", "Oncard", [-3, -2, -1], 2100000), item("langganan", "Ontime", [-3, -2, -1], 900000)]),
 "p4": ("m4", "langganan", -4, [item("langganan", "Oncard", [0], 2100000), item("langganan", "Ontime", [0], 900000)]),
 "p5": ("m5", "langganan", -28, [item("langganan", "Oncard", [-2, -1], 1600000), item("langganan", "Qrion Jurnal", [-2, -1], 500000)]),
 "p6": ("m6", "langganan", -20, [item("langganan", "Oncard", [-2, -1, 0], 3000000), item("langganan", "Ontuition", [-2, -1, 0], 1000000), item("langganan", "Ontime", [-2, -1, 0], 750000)]),
 "p7": ("m7", "langganan", -15, [item("langganan", "Oncard", [-1, 0], 700000)]),
 "p8": ("m2", "langganan", -12, [item("langganan", "Oncard", [0], 800000)]),
 "p9": ("m3", "langganan", -75, [item("langganan", "Oncard", [-4, -3], 1800000)]),
 "p10": ("m6", "langganan", -50, [item("tambahan", "Mesin kartu tambahan (2 unit)", [-2], 4500000)])}
pay = {}
for k, (mid, tp, ago, items) in PAY.items():
    pay[k] = {"mitraId": mid, "tipe": tp, "tanggal": D(ago), "total": sum(i["nominal"] * max(1, len(i["bulan"])) for i in items), "items": items, "catatan": "", "bukti": "", "createdAt": T(ago, "04:00"), "createdBy": "a:risky"}
pay["p11"] = {"mitraId": "m1", "tipe": "topup", "tanggal": D(-6), "total": 15000000, "items": [], "catatan": "Top up saldo kartu siswa kelas X-XI", "bukti": "", "createdAt": T(-6, "04:00"), "createdBy": "a:risky"}
pay["p12"] = {"mitraId": "m6", "tipe": "transaksi", "tanggal": D(-2), "total": 8250000, "items": [], "catatan": "Transaksi kantin minggu ini", "bukti": "", "createdAt": T(-2, "04:00"), "createdBy": "a:risky"}
w('pembayaran', pay)
def inv(no, mid, ago, due, st, its, paid=None, ppn=0, dsk=0):
    d = {"no": no, "untuk": SCN[mid], "alamatUntuk": next(s[11] for s in S if s[0] == mid), "tanggal": D(ago), "jatuhTempo": D(due), "status": st, "items": [{"nama": a, "qty": b, "harga": c} for a, b, c in its], "ppn": ppn, "diskon": dsk, "createdAt": T(ago, "03:00"), "createdBy": "a:risky"}
    if paid is not None: d["paidAt"] = D(paid)
    return d
w('invoices', {
 "v1": inv("INV/2026/11/001", "m1", -30, -4, "terbit", [("Langganan Oncard", 2, 500000)]),
 "v2": inv("INV/2026/10/007", "m4", -45, -30, "lunas", [("Langganan Oncard", 3, 2100000), ("Langganan Ontime", 3, 900000)], paid=-33, ppn=11),
 "v3": inv("INV/2026/11/004", "m6", -12, 3, "terbit", [("Langganan Oncard", 1, 3000000), ("Langganan Ontuition", 1, 1000000)], ppn=11),
 "v4": inv("INV/2026/11/006", "m2", -5, 9, "draft", [("Biaya onboarding", 1, 2500000)]),
 "v5": inv("INV/2026/09/002", "m3", -70, -55, "batal", [("Langganan Oncard", 2, 1800000)])})

# ---------- uang keluar ----------
EXP = [("Server dan hosting", "Server produksi", 2500000, "Biznet", True, 0), ("Gaji dan honor", "Gaji tim November", 38000000, "", True, -1),
 ("Software dan langganan", "Langganan Google Workspace", 1450000, "Google", True, -3), ("Marketing dan iklan", "Iklan Meta untuk SPMB", 3200000, "Meta", False, -5),
 ("Operasional kantor", "Sewa kantor", 6500000, "", True, -2), ("Transport dan perjalanan", "Kunjungan sekolah Duri", 1850000, "", False, -8),
 ("Pelatihan dan acara", "Webinar dan konsumsi", 2100000, "", False, -14), ("Peralatan", "Mesin kartu cadangan 3 unit", 5400000, "Supplier Mesin Kartu", False, -17),
 ("Pajak dan legal", "Konsultasi legal kontrak", 2500000, "Kantor Hukum Riau", False, -22), ("Server dan hosting", "Server produksi bulan lalu", 2500000, "Biznet", True, -31),
 ("Gaji dan honor", "Gaji tim Oktober", 38000000, "", True, -32), ("Komisi dan insentif", "Insentif AM kuartal 3", 4500000, "", False, -40),
 ("Software dan langganan", "Lisensi desain", 900000, "Adobe", True, -33), ("Lainnya", "Perlengkapan kantor", 650000, "", False, -26)]
w('pengeluaran', {f"e{i}": {"tanggal": D(ago), "kategori": k, "deskripsi": ds, "jumlah": j, "vendor": v, "rutin": r, "bukti": "", "catatan": "", "createdAt": T(ago, "05:00"), "createdBy": "a:risky"} for i, (k, ds, j, v, r, ago) in enumerate(EXP, 1)})

# ---------- administrasi ----------
w('surat', {
 "s1": {"pihak": "SMA Harapan Nusantara", "perihal": "Pemberitahuan Disbursement", "nomor": "001/SPB-QRION/XI/2026", "kode": "SPB", "arah": "keluar", "tanggal": D(-8), "status": "terkirim", "createdBy": "a:risky", "createdAt": T(-8, "03:00")},
 "s2": {"pihak": "SMK Teknologi Riau", "perihal": "Permohonan Penawaran Ontime", "nomor": "014/SM/X/2026", "kode": "SM", "arah": "masuk", "tanggal": D(-16), "status": "diterima", "createdBy": "a:pindy", "createdAt": T(-16, "03:00")},
 "s3": {"pihak": "SMA Negeri 3 Duri", "perihal": "Konfirmasi Penambahan Mesin Kartu", "nomor": "002/SPB-QRION/XI/2026", "kode": "SPB", "arah": "keluar", "tanggal": D(-4), "status": "terkirim", "createdBy": "a:nadia", "createdAt": T(-4, "03:00")},
 "s4": {"pihak": "Yayasan Abdi Negara", "perihal": "Pemberitahuan Kontrak Berakhir", "nomor": "003/SPB-QRION/XI/2026", "kode": "SPB", "arah": "keluar", "tanggal": D(-11), "status": "terkirim", "createdBy": "a:pindy", "createdAt": T(-11, "03:00")},
 "s5": {"pihak": "SD Islam Al-Furqan", "perihal": "Surat Balasan Permintaan Pelatihan", "nomor": "021/SM/X/2026", "kode": "SM", "arah": "masuk", "tanggal": D(-25), "status": "diterima", "createdBy": "a:pindy", "createdAt": T(-25, "03:00")},
 "s6": {"pihak": "SMP Bina Insani", "perihal": "Undangan Pelatihan Qrion Jurnal", "nomor": "004/UND-QRION/XI/2026", "kode": "UND", "arah": "keluar", "tanggal": D(-2), "status": "draft", "createdBy": "a:nadia", "createdAt": T(-2, "03:00")}})
w('mou', {
 "u1": {"untuk": "SMA Harapan Nusantara", "judul": "MoU Kerjasama", "nomor": "001/SKS", "status": "aktif", "berakhir": D(20), "tanggalTtd": D(-300), "createdBy": "a:risky", "createdAt": T(-300, "03:00")},
 "u2": {"untuk": "SMK Teknologi Riau", "judul": "Perjanjian Kerjasama Oncard dan Ontime", "nomor": "007/PKS", "status": "aktif", "berakhir": D(165), "tanggalTtd": D(-200), "createdBy": "a:risky", "createdAt": T(-200, "03:00")},
 "u3": {"untuk": "SMA Negeri 3 Duri", "judul": "Perjanjian Kerjasama Paket Lengkap", "nomor": "009/PKS", "status": "aktif", "berakhir": D(65), "tanggalTtd": D(-300), "createdBy": "a:risky", "createdAt": T(-300, "03:00")},
 "u4": {"untuk": "Yayasan Pendidikan Mutiara", "judul": "MoU Kerjasama (berakhir)", "nomor": "002/SKS", "status": "berakhir", "berakhir": D(-70), "tanggalTtd": D(-500), "createdBy": "a:risky", "createdAt": T(-500, "03:00")}})
w('suratTpl', {
 "t1": {"nama": "Template Surat Pemberitahuan", "kode": "SPB", "link": "", "ket": "Contoh", "menu": "surat", "dibuat": T(-60, "03:00"), "diubah": T(-60, "03:00")},
 "t2": {"nama": "Template Surat Undangan", "kode": "UND", "link": "", "ket": "Undangan pelatihan atau rapat", "menu": "surat", "dibuat": T(-55, "03:00"), "diubah": T(-55, "03:00")},
 "t3": {"nama": "Template Perjanjian Kerjasama", "kode": "PKS", "link": "", "ket": "Draf standar PKS", "menu": "mou", "dibuat": T(-50, "03:00"), "diubah": T(-50, "03:00")}})
w('branding', {f"b{i}": {"judul": j, "kategori": k, "produk": p, "deskripsi": d, "tautan": "", "files": [], "dibuat": T(-40 + i, "03:00")} for i, (j, k, p, d) in enumerate([
 ("Logo QRION", "Logo", "", "Logo utama"), ("Brosur Oncard", "Brosur", "p-a", "Brosur penawaran kartu pintar"), ("Poster Ontuition", "Poster", "p-b", "Poster pendaftaran bimbel"),
 ("Deck Presentasi Perusahaan", "Presentasi", "", "Slide profil QRION untuk sekolah"), ("Panduan Top Up Wali Murid", "Panduan", "p-a", "Cara top up saldo kartu"),
 ("Banner Webinar SPMB", "Banner", "p-e", "Banner kampanye SPMB"), ("Template Postingan Instagram", "Media sosial", "", "Template konten bulanan")], 1)})

# ---------- absensi & audit & catatan ----------
att = {}
people = [("risky", "Risky Antonio"), ("ceo", "Dewi Anggraini"), ("pm", "Hendra Saputra"), ("cs", "Sari Wulandari"), ("tika", "Tika Rahmawati"), ("pindy", "Pindy Maharani"), ("dila", "Dila Putri"), ("nadia", "Nadia Safitri"), ("ridho", "Ridho Pratama"), ("randy", "Randy Wijaya"), ("bima", "Bima Aditya")]
NOTE = {0: "Rapat sekolah", 1: "Kunjungan sekolah", 2: "Kerja dari rumah"}
for ago in range(0, 11):
    if ago in (1, 2, 8, 9):  # akhir pekan kira-kira (ditebak dari data statis); tetap isi sebagian
        pass
    for i, (u, nm) in enumerate(people):
        r = random.random()
        if ago > 0 and r < 0.07: st = "izin"
        elif ago > 0 and r < 0.10: st = "sakit"
        else: st = "hadir"
        key = f"@d{-ago:+d}_a_{u}"
        base = 2 + (i % 3)  # 09:xx-11:xx WIB ~ 02-04 UTC
        d = {"tanggal": D(-ago), "uid": "a:" + u, "nama": nm, "status": st}
        if st == "hadir":
            mm = random.choice([0, 5, 12, 25, 40])
            d["masuk"] = T(-ago, f"{1 + (i % 2):02d}:{mm:02d}") if mm < 60 else T(-ago, "02:00")
            if ago > 0: d["pulang"] = T(-ago, f"{9 + (i % 2):02d}:{random.choice([0, 10, 30]):02d}")
            elif i % 3 == 0: d["pulang"] = None
            if random.random() < 0.15: d["catatan"] = NOTE[i % 3]
        else:
            d["catatan"] = "Keperluan keluarga" if st == "izin" else "Flu"
        att[key] = d
w('absensi', att)
w('audit', {f"a{i}": {"t": T(ago, "03:00"), "by": by, "menu": menu, "aksi": aksi} for i, (ago, by, menu, aksi) in enumerate([
 (-1, "Risky Antonio (@risky)", "Mitra Sekolah", "AM diubah: SMA Harapan Nusantara"), (-1, "Sari Wulandari (@cs)", "Isu", "Tiket dibuat: Server tidak bisa diakses"), (-2, "Ridho Pratama (@ridho)", "Isu", "Status tiket diperbarui"),
 (-3, "Pindy Maharani (@pindy)", "Pipeline Leads", "Dipindahkan ke Negosiasi"), (-4, "Hendra Saputra (@pm)", "Project", "Status project diperbarui"), (-5, "Risky Antonio (@risky)", "Pembayaran Mitra", "Pembayaran dicatat"),
 (-6, "Dewi Anggraini (@ceo)", "Administrasi", "Nomor surat dibuat"), (-8, "Risky Antonio (@risky)", "Pengaturan", "Akun @bima dibuat"), (-9, "Nadia Safitri (@nadia)", "Mitra Sekolah", "Aktivitas ditambahkan"),
 (-12, "Risky Antonio (@risky)", "Pengaturan", "Hak akses tersimpan")], 1)})
NOTES = {
 "risky": [("Prioritas minggu ini\n- Tutup tiket Critical\n- Review anggaran server\n- Follow up SMA Plus Mandiri", -1), ("Ide fitur\nNotifikasi WhatsApp otomatis saat tiket berubah status", -6)],
 "ceo": [("Target kuartal\nMRR Rp 20 jt dan 12 sekolah mitra aktif", -3)],
 "pm": [("Rapat mingguan\nBahas progres Implementasi Oncard dan Ontime SMK", -1), ("Risiko\nAnggaran server belum disetujui", -4)],
 "cs": [("Skrip balasan cepat\nTerima kasih sudah menghubungi QRION, tiket Anda sudah kami catat.", -2)],
 "pindy": [("Kunjungan\nSMA Harapan: bahas perpanjangan kontrak, bawa penawaran", -2)],
 "dila": [("Follow up\nSD Cahaya Bangsa menunggu jadwal pelatihan", -1)],
 "nadia": [("Rencana\nDemo Qrion Jurnal ke Yayasan Nurul Ilmi", -2)],
 "ridho": [("Debug\nCek log gateway pembayaran untuk tiket top up", -1)], "randy": [("Catatan\nImpor data siswa SD Cahaya perlu validasi NIS", -2)], "bima": [("Todo\nSelesaikan ekspor Excel laporan harian", -1)]}
w('catatan', {u: {f"n_{u}_{i}": {"teks": t, "dibuat": T(ago, "03:00"), "diubah": T(ago, "03:00")} for i, (t, ago) in enumerate(ns, 1)} for u, ns in NOTES.items()})
print("ok")
