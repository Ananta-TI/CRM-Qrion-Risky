-- QRION CRM, bagian 2: data dummy dan akun login (jalankan SETELAH 1_struktur.sql)

insert into public.app_roles(key,name,home,pos) values ('admin','Super Admin','ringkasan',-1) on conflict do nothing;

-- ===== DATA =====

insert into public.products (id,name,pos) values
('p-a','Oncard',0),
('p-b','Ontuition',1),
('p-c','Ontime',2),
('p-d','Qrion Jurnal',3),
('p-e','Qrion SPMB',4),
('p-f','Onboard',5)
on conflict (id) do update set name=excluded.name, pos=excluded.pos;
insert into public.app_roles (key,name,home,pos) values
('pm','Project Manager','project',0),
('ceo','CEO','ringkasan',1),
('programmer','Programmer','isu',2),
('cs','Customer Service','isu',3),
('am','Account Manager','sekolah',4)
on conflict (key) do update set name=excluded.name, home=excluded.home, pos=excluded.pos;
insert into public.role_access (role_key,module,level,pos) values
('pm','ringkasan',1,0),
('pm','isu',2,0),
('pm','project',3,0),
('pm','sekolah',1,0),
('pm','pembayaran',2,0),
('pm','administrasi',2,0),
('pm','branding',2,0),
('pm','pipeline',1,0),
('pm','absen',2,0),
('pm','akses',1,0),
('ceo','ringkasan',1,0),
('ceo','isu',2,0),
('ceo','project',2,0),
('ceo','sekolah',2,0),
('ceo','pembayaran',2,0),
('ceo','administrasi',2,0),
('ceo','branding',2,0),
('ceo','pipeline',2,0),
('ceo','absen',1,0),
('ceo','akses',1,0),
('programmer','ringkasan',0,0),
('programmer','isu',3,0),
('programmer','isuNo',1,0),
('programmer','project',2,0),
('programmer','sekolah',0,0),
('programmer','pembayaran',0,0),
('programmer','pipeline',0,0),
('programmer','akses',1,0),
('cs','ringkasan',0,0),
('cs','isu',2,0),
('cs','project',0,0),
('cs','sekolah',1,0),
('cs','pembayaran',0,0),
('cs','branding',1,0),
('cs','pipeline',0,0),
('cs','akses',1,0),
('am','ringkasan',0,0),
('am','isu',2,0),
('am','project',0,0),
('am','sekolah',2,0),
('am','pembayaran',0,0),
('am','administrasi',1,0),
('am','branding',1,0),
('am','pipeline',2,0),
('am','akses',1,0);
insert into public.people(ref) values ('a:risky'),('a:ceo'),('a:pm'),('a:cs'),('a:tika'),('Pindy'),('a:pindy'),('Dila'),('a:dila'),('Nadia'),('a:nadia'),('a:ridho'),('a:randy'),('a:bima'),('Ridho'),('Randy'),('Bima') on conflict do nothing;
update public.people set nama='Risky Antonio' where ref='a:risky';
update public.people set nama='Dewi Anggraini' where ref='a:ceo';
update public.people set nama='Hendra Saputra' where ref='a:pm';
update public.people set nama='Sari Wulandari' where ref='a:cs';
update public.people set nama='Tika Rahmawati' where ref='a:tika';
update public.people set nama='Pindy Maharani' where ref='a:pindy';
update public.people set nama='Dila Putri' where ref='a:dila';
update public.people set nama='Nadia Safitri' where ref='a:nadia';
update public.people set nama='Ridho Pratama' where ref='a:ridho';
update public.people set nama='Randy Wijaya' where ref='a:randy';
update public.people set nama='Bima Aditya' where ref='a:bima';
insert into public.accounts (nama,role_key,aktif,dibuat,am,extra,username) values
('Risky Antonio','admin',true,'2026-07-20T02:00:00.000Z',null,null,'risky'),
('Dewi Anggraini','ceo',true,'2026-07-21T02:00:00.000Z',null,null,'ceo'),
('Hendra Saputra','pm',true,'2026-07-22T02:00:00.000Z',null,null,'pm'),
('Sari Wulandari','cs',true,'2026-07-23T02:00:00.000Z',null,null,'cs'),
('Tika Rahmawati','cs',true,'2026-07-24T02:00:00.000Z',null,null,'tika'),
('Pindy Maharani','am',true,'2026-07-25T02:00:00.000Z','Pindy',null,'pindy'),
('Dila Putri','am',true,'2026-07-26T02:00:00.000Z','Dila',null,'dila'),
('Nadia Safitri','am',true,'2026-07-27T02:00:00.000Z','Nadia',null,'nadia'),
('Ridho Pratama','programmer',true,'2026-07-28T02:00:00.000Z',null,null,'ridho'),
('Randy Wijaya','programmer',true,'2026-07-29T02:00:00.000Z',null,null,'randy'),
('Bima Aditya','programmer',true,'2026-07-30T02:00:00.000Z',null,null,'bima')
on conflict (username) do update set nama=excluded.nama, role_key=excluded.role_key, aktif=excluded.aktif, dibuat=excluded.dibuat, am=excluded.am, extra=excluded.extra;
update public.people set is_am=true where ref in ('Pindy','Dila','Nadia');
update public.people set is_programmer=true where ref in ('Ridho','Randy','Bima');
insert into public.app_settings (key,data) values
('absen','{"jamMasuk":"09:00","jamPulang":"16:00","toleransi":10}'::jsonb),
('invoice','{"nama":"PT Qrion Digital Edukasi","kontak":"finance@qrion.id | 0761-555-0101","alamat":"Jl. Soekarno-Hatta No. 88, Pekanbaru, Riau","rekening":"BCA 1234567890 a.n. PT Qrion Digital Edukasi","penandatangan":"Dewi Anggraini, CEO"}'::jsonb)
on conflict (key) do update set data=excluded.data;
insert into public.team_members (joined_at,extra,id) values
('2026-07-30T03:00:00.000Z',null,'risky'),
('2026-07-30T03:00:00.000Z',null,'ceo'),
('2026-07-30T03:00:00.000Z',null,'pm'),
('2026-07-30T03:00:00.000Z',null,'cs'),
('2026-07-30T03:00:00.000Z',null,'tika'),
('2026-07-30T03:00:00.000Z',null,'pindy'),
('2026-07-30T03:00:00.000Z',null,'dila'),
('2026-07-30T03:00:00.000Z',null,'nadia'),
('2026-07-30T03:00:00.000Z',null,'ridho'),
('2026-07-30T03:00:00.000Z',null,'randy'),
('2026-07-30T03:00:00.000Z',null,'bima')
on conflict (id) do update set joined_at=excluded.joined_at, extra=excluded.extra;
insert into public.schools (name,city,jenjang,status,am,students,contract_start,contract_end,pic_name,pic_phone,address,next_action,next_date,notes,contoh,created_at,created_by,extra,id) values
('SMA Harapan Nusantara','Pekanbaru','SMA','aktif','Pindy',820,'2026-01-01','2026-12-27','Bu Rina','081234567890','Jl. Merdeka No. 1',null,null,null,null,'2025-12-27T02:00:00.000Z',null,null,'m1'),
('SD Cahaya Bangsa','Dumai','SD','onboarding','Dila',310,'2026-10-28','2027-10-28','Pak Anton','081311112222','Jl. Sudirman No. 12',null,null,null,null,'2026-10-23T02:00:00.000Z',null,null,'m2'),
('Yayasan Abdi Negara','Pekanbaru','Yayasan','berisiko','Pindy',1500,'2025-10-13','2026-11-05','Bu Lestari','081322334455','Jl. Diponegoro No. 7',null,null,null,null,'2025-10-08T02:00:00.000Z',null,null,'m3'),
('SMK Teknologi Riau','Pekanbaru','SMK','aktif','Dila',640,'2026-05-01','2027-05-01','Pak Hendri','081344556677','Jl. Tuanku Tambusai No. 45',null,null,null,null,'2026-04-26T02:00:00.000Z',null,null,'m4'),
('SMP Bina Insani','Siak','SMP','aktif','Nadia',455,'2026-06-20','2027-06-20','Bu Mega','081355667788','Jl. Raja Kecik No. 3',null,null,null,null,'2026-06-15T02:00:00.000Z',null,null,'m5'),
('SMA Negeri 3 Duri','Bengkalis','SMA','aktif','Nadia',980,'2026-01-21','2027-01-21','Pak Samsul','081366001122','Jl. Pertamina No. 21',null,null,null,null,'2026-01-16T02:00:00.000Z',null,null,'m6'),
('SD Islam Al-Furqan','Pekanbaru','SD','aktif','Pindy',270,'2026-08-19','2027-08-19','Bu Aisyah','081377445566','Jl. Arifin Ahmad No. 9',null,null,null,null,'2026-08-14T02:00:00.000Z',null,null,'m7'),
('Yayasan Pendidikan Mutiara','Dumai','Yayasan','churn','Dila',1100,'2025-07-05','2026-09-08','Pak Gunawan','081399887766','Jl. Datuk Laksamana No. 5',null,null,null,null,'2025-06-30T02:00:00.000Z',null,null,'m8')
on conflict (id) do update set name=excluded.name, city=excluded.city, jenjang=excluded.jenjang, status=excluded.status, am=excluded.am, students=excluded.students, contract_start=excluded.contract_start, contract_end=excluded.contract_end, pic_name=excluded.pic_name, pic_phone=excluded.pic_phone, address=excluded.address, next_action=excluded.next_action, next_date=excluded.next_date, notes=excluded.notes, contoh=excluded.contoh, created_at=excluded.created_at, created_by=excluded.created_by, extra=excluded.extra;
insert into public.school_products (product_id,mrr,extra,school_id,pos) values
('p-a',3500000,null,'m1',0),
('p-b',1200000,null,'m1',1),
('p-a',800000,null,'m2',0),
('p-a',2100000,null,'m4',0),
('p-c',900000,null,'m4',1),
('p-a',1600000,null,'m5',0),
('p-d',500000,null,'m5',1),
('p-a',3000000,null,'m6',0),
('p-b',1000000,null,'m6',1),
('p-c',750000,null,'m6',2),
('p-a',700000,null,'m7',0);
insert into public.school_contacts (name,title,phone,extra,school_id,pos) values
('Bu Rina','Kepala Sekolah','081234567890',null,'m1',0),
('Pak Doni','Operator Oncard','081277788899',null,'m1',1),
('Pak Anton','Kepala Sekolah','081311112222',null,'m2',0),
('Bu Lestari','Ketua Yayasan','081322334455',null,'m3',0),
('Pak Hendri','Wakasek Kurikulum','081344556677',null,'m4',0),
('Bu Yuni','Bendahara','081366778899',null,'m4',1),
('Bu Mega','Kepala Sekolah','081355667788',null,'m5',0),
('Pak Samsul','Kepala Sekolah','081366001122',null,'m6',0),
('Bu Ratna','Operator','081388990011',null,'m6',1),
('Bu Aisyah','Kepala Sekolah','081377445566',null,'m7',0),
('Pak Gunawan','Ketua Yayasan','081399887766',null,'m8',0);
insert into public.school_logs (at,by_ref,type,text,extra,school_id,pos) values
('2026-11-14T03:00:00.000Z','a:pindy','Kunjungan','Kunjungan evaluasi Oncard',null,'m1',0),
('2026-10-23T03:00:00.000Z','a:pindy','Rapat','Perpanjangan kontrak dibahas dengan kepala sekolah',null,'m1',1),
('2026-09-18T03:00:00.000Z','a:pindy','Kunjungan','Pelatihan operator kantin selesai',null,'m1',2),
('2026-10-30T03:00:00.000Z','a:dila','Rapat','Kick-off onboarding dan pengumpulan data siswa',null,'m2',0),
('2026-11-08T03:00:00.000Z','a:dila','Catatan','Data siswa 310 sudah diimpor',null,'m2',1),
('2026-10-18T03:00:00.000Z','a:pindy','Telepon','Telepon PIC, belum ada keputusan perpanjangan',null,'m3',0),
('2026-10-03T03:00:00.000Z','a:pindy','Email','Surat penawaran perpanjangan dikirim',null,'m3',1),
('2026-11-10T03:00:00.000Z','a:dila','Kunjungan','Demo Ontime ke wakasek, tertarik absensi guru',null,'m4',0),
('2026-10-08T03:00:00.000Z','a:dila','Rapat','Evaluasi triwulan, puas dengan Oncard',null,'m4',1),
('2026-11-05T03:00:00.000Z','a:nadia','Catatan','Qrion Jurnal mulai dipakai kelas 8',null,'m5',0),
('2026-10-13T03:00:00.000Z','a:nadia','WhatsApp','WhatsApp tentang jadwal pelatihan guru',null,'m5',1),
('2026-11-12T03:00:00.000Z','a:nadia','Kunjungan','Kunjungan rutin, minta tambahan 2 mesin kartu',null,'m6',0),
('2026-09-28T03:00:00.000Z','a:nadia','Catatan','Pembayaran semester genap diterima',null,'m6',1),
('2026-11-02T03:00:00.000Z','a:pindy','WhatsApp','Panduan top up dibagikan ke wali murid',null,'m7',0),
('2026-09-08T03:00:00.000Z','a:dila','Rapat','Kontrak berakhir, yayasan memilih berhenti',null,'m8',0),
('2026-08-24T03:00:00.000Z','a:dila','Telepon','Keluhan layanan lambat dari yayasan',null,'m8',1);
insert into public.issues (subject,description,status,urgency,category,school_id,product_id,assignee,am,reporter,created_by,created_at,reported_date,sla_deadline,first_response_at,closed_at,sla_breached,reopen_count,paused_minutes,paused_at,csat_score,csat_comment,tx_amount,attachments,contoh,extra,id) values
('Login gagal di aplikasi Oncard','Operator tidak bisa login sejak pagi, muncul pesan kata sandi salah.','Open','High','Teknis','m1','p-a',null,'Pindy','Pak Doni','a:cs','2026-11-17T08:04:00.167Z','2026-11-17','2026-11-17T16:04:00.167Z',null,null,false,0,0,null,null,null,null,null,null,null,'i1'),
('Saldo kartu Oncard tidak sesuai','Saldo beberapa kartu berbeda dengan yang tertera di laporan kantin.','In Progress','Critical','Transaksi','m2','p-a','a:ridho','Dila','Pak Anton','a:dila','2026-11-15T08:49:00.167Z','2026-11-15','2026-11-15T12:49:00.167Z','2026-11-15T09:24:00.167Z',null,false,0,0,null,null,null,null,null,null,null,'i2'),
('Top up kartu Oncard tidak masuk','Beberapa wali murid sudah transfer top up kemarin tapi saldo kartu anak belum bertambah.','Closed','High','Transaksi','m1','p-a','a:ridho','Pindy','Operator sekolah','a:risky','2026-11-08T04:00:00.000Z','2026-11-08','2026-11-08T12:00:00.000Z','2026-11-08T04:20:00.000Z','2026-11-08T11:20:00.000Z',false,0,0,null,4,'Sangat membantu.',null,null,null,null,'i3'),
('Siswa tidak bisa login','Satu siswa kelas 8A tidak bisa masuk ke aplikasi, kata sandi dianggap salah.','Closed','Medium','Akun','m1','p-a','a:ridho','Pindy','Operator sekolah','a:risky','2026-11-09T05:00:00.000Z','2026-11-09','2026-11-10T05:00:00.000Z','2026-11-09T05:15:00.000Z','2026-11-09T07:15:00.000Z',false,0,0,null,5,'Masalah selesai dengan baik.',null,null,null,null,'i4'),
('Tertagih dua kali (double charge)','Wali murid melaporkan SPP bulan ini terpotong dua kali dari rekeningnya.','Closed','Critical','Pembayaran','m2','p-a','a:randy','Dila','Operator sekolah','a:nadia','2026-11-03T03:00:00.000Z','2026-11-03','2026-11-03T07:00:00.000Z','2026-11-03T04:30:00.000Z','2026-11-03T06:30:00.000Z',false,0,0,null,3,'Terima kasih, sudah berfungsi.',null,null,null,null,'i5'),
('Lupa kata sandi akun','Guru Matematika lupa kata sandi dan tidak bisa menerima email reset.','Closed','Low','Akun','m3','p-a','a:bima','Pindy','Bu Lestari','a:nadia','2026-11-12T06:00:00.000Z','2026-11-12','2026-11-15T06:00:00.000Z','2026-11-12T06:35:00.000Z','2026-11-12T21:35:00.000Z',false,0,0,null,4,'Cepat ditangani, terima kasih.',null,null,null,null,'i6'),
('Impor data siswa gagal','File impor siswa kelas 7 ditolak dengan pesan format tidak sesuai.','Closed','High','Teknis','m2','p-a','a:randy','Dila','Pak Anton','a:nadia','2026-10-28T04:00:00.000Z','2026-10-28','2026-10-28T12:00:00.000Z','2026-10-28T05:30:00.000Z','2026-10-28T07:30:00.000Z',false,0,0,null,5,'Solusi sudah tepat, tapi sempat menunggu agak lama.',null,null,null,null,'i7'),
('Kartu Oncard tidak terbaca di mesin','Tiga kartu tidak terbaca di mesin kantin, lampu merah menyala.','In Progress','Medium','Teknis','m4','p-a','a:bima','Dila','Bu Yuni','a:tika','2026-11-16T22:49:00.168Z','2026-11-17','2026-11-17T22:49:00.168Z','2026-11-17T00:19:00.168Z',null,false,0,0,null,null,null,null,null,null,null,'i8'),
('Absensi guru tidak tercatat','Sidik jari guru terbaca di mesin tapi tidak muncul di Ontime.','Waiting Validation','High','Produk','m4','p-c','a:randy','Dila','Pak Hendri','a:nadia','2026-11-17T03:49:00.168Z','2026-11-17','2026-11-17T11:49:00.168Z','2026-11-17T04:09:00.168Z',null,false,0,0,null,null,null,null,null,null,null,'i9'),
('Nominal tagihan salah','Tagihan bulan ini lebih besar dari kesepakatan kontrak.','Closed','Medium','Pembayaran','m6','p-a','a:bima','Nadia','Pak Samsul','a:dila','2026-11-06T04:00:00.000Z','2026-11-06','2026-11-07T04:00:00.000Z','2026-11-06T04:15:00.000Z','2026-11-06T11:15:00.000Z',false,0,0,null,4,'Terima kasih, sudah berfungsi.',null,null,null,null,'i10'),
('Aplikasi lambat atau error','Aplikasi sangat lambat saat jam istirahat ketika banyak transaksi.','In Progress','High','Teknis','m6','p-a','a:ridho','Nadia','Bu Ratna','a:risky','2026-11-17T05:49:00.169Z','2026-11-17','2026-11-17T13:49:00.169Z','2026-11-17T06:34:00.169Z',null,false,0,0,null,null,null,null,null,null,null,'i11'),
('Nilai atau rapor tidak muncul','Nilai ujian tengah semester belum tampil di Ontuition untuk kelas 9.','Open','Medium','Produk','m1','p-b',null,'Pindy','Pak Doni','a:cs','2026-11-17T06:49:00.169Z','2026-11-17','2026-11-18T06:49:00.169Z',null,null,false,0,0,null,null,null,null,null,null,null,'i12'),
('Permintaan fitur baru','Sekolah ingin laporan transaksi harian bisa diunduh dalam format Excel.','Open','Low','Produk','m5','p-a',null,'Nadia','Bu Mega','a:tika','2026-11-16T07:49:00.169Z','2026-11-16','2026-11-19T07:49:00.169Z',null,null,false,0,0,null,null,null,null,null,null,null,'i13'),
('Akun terkunci atau dinonaktifkan','Akun operator terkunci setelah beberapa kali salah memasukkan sandi.','Closed','Medium','Akun','m5','p-d','a:bima','Nadia','Bu Mega','a:tika','2026-10-30T05:00:00.000Z','2026-10-30','2026-10-31T05:00:00.000Z','2026-10-30T05:15:00.000Z','2026-10-30T08:35:00.000Z',false,0,0,null,5,'Masalah selesai dengan baik.',null,null,null,null,'i14'),
('Server tidak bisa diakses','Semua perangkat di sekolah tidak bisa membuka aplikasi sejak 10 menit lalu.','Closed','Critical','Teknis','m6','p-a','a:ridho','Nadia','Pak Samsul','a:dila','2026-10-22T03:00:00.000Z','2026-10-22','2026-10-22T07:00:00.000Z','2026-10-22T03:15:00.000Z','2026-10-22T10:15:00.000Z',true,0,0,null,5,'Terima kasih, sudah berfungsi.',null,null,null,null,'i15'),
('Data siswa tidak muncul','Siswa baru kelas 1 belum tampil di daftar siswa Oncard.','Waiting Validation','Medium','Teknis','m7','p-a','a:bima','Pindy','Bu Aisyah','a:pindy','2026-11-16T17:49:00.169Z','2026-11-17','2026-11-17T17:49:00.169Z','2026-11-16T18:04:00.169Z',null,false,0,0,null,null,null,null,null,null,null,'i16'),
('Pembayaran sudah dilakukan tapi belum terverifikasi','Transfer SPP sudah dilakukan kemarin tapi status masih belum lunas.','Closed','High','Pembayaran','m7','p-a','a:randy','Pindy','Bu Aisyah','a:pindy','2026-11-04T04:00:00.000Z','2026-11-04','2026-11-04T12:00:00.000Z','2026-11-04T04:20:00.000Z','2026-11-04T06:20:00.000Z',false,0,0,null,4,'Solusi sudah tepat, tapi sempat menunggu agak lama.',null,null,null,null,'i17'),
('Perubahan data sekolah','Mohon ubah nama bendahara dan nomor telepon PIC di profil sekolah.','Closed','Low','Lainnya','m4','p-a','a:ridho','Dila','Bu Yuni','a:nadia','2026-10-24T07:00:00.000Z','2026-10-24','2026-10-27T07:00:00.000Z','2026-10-24T08:30:00.000Z','2026-10-24T23:30:00.000Z',false,0,0,null,5,'Sangat membantu.',null,null,null,null,'i18'),
('Laporan transaksi harian kosong','Laporan harian menampilkan nol padahal ada transaksi di kantin.','Closed','High','Transaksi','m4','p-a','a:randy','Dila','Pak Hendri','a:dila','2026-10-18T04:00:00.000Z','2026-10-18','2026-10-18T12:00:00.000Z','2026-10-18T05:30:00.000Z','2026-10-18T12:30:00.000Z',true,0,0,null,3,'Masalah selesai dengan baik.',null,null,null,null,'i19'),
('Kartu hilang minta diblokir','Orang tua melaporkan kartu anak hilang dan meminta saldo diblokir.','Closed','High','Transaksi','m1','p-a','a:ridho','Pindy','Operator sekolah','a:pindy','2026-10-13T05:00:00.000Z','2026-10-13','2026-10-13T13:00:00.000Z','2026-10-13T05:15:00.000Z','2026-10-13T08:35:00.000Z',false,0,0,null,4,'Terima kasih, sudah berfungsi.',null,null,null,null,'i20'),
('Jadwal pelatihan guru Qrion Jurnal','Sekolah meminta jadwal pelatihan tambahan untuk guru baru.','Closed','Low','Lainnya','m5','p-d','a:bima','Nadia','Bu Mega','a:tika','2026-10-08T06:00:00.000Z','2026-10-08','2026-10-11T06:00:00.000Z','2026-10-08T06:15:00.000Z','2026-10-08T21:15:00.000Z',false,0,0,null,5,'Cepat ditangani, terima kasih.',null,null,null,null,'i21'),
('Mesin kartu mati total','Mesin kartu di koperasi tidak menyala setelah mati listrik.','Closed','High','Teknis','m6','p-a','a:ridho','Nadia','Bu Ratna','a:risky','2026-10-03T04:00:00.000Z','2026-10-03','2026-10-03T12:00:00.000Z','2026-10-03T05:30:00.000Z','2026-10-03T08:50:00.000Z',false,0,0,null,5,'Solusi sudah tepat, tapi sempat menunggu agak lama.',null,null,null,null,'i22'),
('Duplikasi data siswa','Ada dua siswa dengan NIS yang sama setelah impor ulang.','Closed','Medium','Teknis','m2','p-a','a:randy','Dila','Pak Anton','a:cs','2026-09-28T03:00:00.000Z','2026-09-28','2026-09-29T03:00:00.000Z','2026-09-28T03:35:00.000Z','2026-09-28T10:35:00.000Z',false,0,0,null,4,'Sangat membantu.',null,null,null,null,'i23'),
('Reset saldo massal salah','Saldo 12 kartu kelas 6 ter-reset ke nol setelah pembaruan.','Open','Critical','Transaksi','m7','p-a',null,'Pindy','Bu Aisyah','a:nadia','2026-11-17T08:24:00.170Z','2026-11-17','2026-11-17T12:24:00.170Z',null,null,false,0,0,null,null,null,null,null,null,null,'i24')
on conflict (id) do update set subject=excluded.subject, description=excluded.description, status=excluded.status, urgency=excluded.urgency, category=excluded.category, school_id=excluded.school_id, product_id=excluded.product_id, assignee=excluded.assignee, am=excluded.am, reporter=excluded.reporter, created_by=excluded.created_by, created_at=excluded.created_at, reported_date=excluded.reported_date, sla_deadline=excluded.sla_deadline, first_response_at=excluded.first_response_at, closed_at=excluded.closed_at, sla_breached=excluded.sla_breached, reopen_count=excluded.reopen_count, paused_minutes=excluded.paused_minutes, paused_at=excluded.paused_at, csat_score=excluded.csat_score, csat_comment=excluded.csat_comment, tx_amount=excluded.tx_amount, attachments=excluded.attachments, contoh=excluded.contoh, extra=excluded.extra;
insert into public.issue_messages (at,by_ref,kind,body,files,extra,issue_id,pos) values
('2026-11-17T08:04:00.167Z','a:cs','text','Operator tidak bisa login sejak pagi, muncul pesan kata sandi salah.',null,null,'i1',0),
('2026-11-15T08:49:00.167Z','a:dila','text','Saldo beberapa kartu berbeda dengan yang tertera di laporan kantin.',null,null,'i2',0),
('2026-11-15T09:24:00.167Z','a:ridho','system','Ditugaskan ke Ridho',null,null,'i2',1),
('2026-11-15T09:25:00.167Z','a:ridho','system','Status: Open → In Progress',null,null,'i2',2),
('2026-11-15T17:24:00.167Z','a:ridho','text','Sedang kami periksa, mohon tunggu kabar berikutnya.',null,null,'i2',3),
('2026-11-08T04:00:00.000Z','a:risky','text','Beberapa wali murid sudah transfer top up kemarin tapi saldo kartu anak belum bertambah.',null,null,'i3',0),
('2026-11-08T04:20:00.000Z','a:ridho','system','Ditugaskan ke Ridho',null,null,'i3',1),
('2026-11-08T04:21:00.000Z','a:ridho','system','Status: Open → In Progress',null,null,'i3',2),
('2026-11-08T04:30:00.000Z','a:ridho','text','Sedang kami periksa, mohon tunggu kabar berikutnya.',null,null,'i3',3),
('2026-11-08T11:19:00.000Z','a:ridho','text','Sudah kami proses ulang manual, hasilnya sudah sesuai.',null,null,'i3',4),
('2026-11-08T11:20:00.000Z','a:ridho','system','Status: In Progress → Closed',null,null,'i3',5),
('2026-11-09T05:00:00.000Z','a:risky','text','Satu siswa kelas 8A tidak bisa masuk ke aplikasi, kata sandi dianggap salah.',null,null,'i4',0),
('2026-11-09T05:15:00.000Z','a:ridho','system','Ditugaskan ke Ridho',null,null,'i4',1),
('2026-11-09T05:16:00.000Z','a:ridho','system','Status: Open → In Progress',null,null,'i4',2),
('2026-11-09T05:25:00.000Z','a:ridho','text','Sedang kami periksa, mohon tunggu kabar berikutnya.',null,null,'i4',3),
('2026-11-09T07:14:00.000Z','a:ridho','text','Perangkat sudah diatur ulang dan berfungsi normal.',null,null,'i4',4),
('2026-11-09T07:15:00.000Z','a:ridho','system','Status: In Progress → Closed',null,null,'i4',5),
('2026-11-03T03:00:00.000Z','a:nadia','text','Wali murid melaporkan SPP bulan ini terpotong dua kali dari rekeningnya.',null,null,'i5',0),
('2026-11-03T04:30:00.000Z','a:randy','system','Ditugaskan ke Randy',null,null,'i5',1),
('2026-11-03T04:31:00.000Z','a:randy','system','Status: Open → In Progress',null,null,'i5',2),
('2026-11-03T04:40:00.000Z','a:randy','text','Sedang kami periksa, mohon tunggu kabar berikutnya.',null,null,'i5',3),
('2026-11-03T06:29:00.000Z','a:randy','text','Sudah dicek dan diperbaiki, mohon dicoba lagi.',null,null,'i5',4),
('2026-11-03T06:30:00.000Z','a:randy','system','Status: In Progress → Closed',null,null,'i5',5),
('2026-11-12T06:00:00.000Z','a:nadia','text','Guru Matematika lupa kata sandi dan tidak bisa menerima email reset.',null,null,'i6',0),
('2026-11-12T06:35:00.000Z','a:bima','system','Ditugaskan ke Bima',null,null,'i6',1),
('2026-11-12T06:36:00.000Z','a:bima','system','Status: Open → In Progress',null,null,'i6',2),
('2026-11-12T06:45:00.000Z','a:bima','text','Sedang kami periksa, mohon tunggu kabar berikutnya.',null,null,'i6',3),
('2026-11-12T21:34:00.000Z','a:bima','text','Penyebabnya konfigurasi yang berubah setelah pembaruan, sudah dikembalikan.',null,null,'i6',4),
('2026-11-12T21:35:00.000Z','a:bima','system','Status: In Progress → Closed',null,null,'i6',5),
('2026-10-28T04:00:00.000Z','a:nadia','text','File impor siswa kelas 7 ditolak dengan pesan format tidak sesuai.',null,null,'i7',0),
('2026-10-28T05:30:00.000Z','a:randy','system','Ditugaskan ke Randy',null,null,'i7',1),
('2026-10-28T05:31:00.000Z','a:randy','system','Status: Open → In Progress',null,null,'i7',2),
('2026-10-28T05:40:00.000Z','a:randy','text','Sedang kami periksa, mohon tunggu kabar berikutnya.',null,null,'i7',3),
('2026-10-28T07:29:00.000Z','a:randy','text','Data sudah dikoreksi langsung di database dan dicek di QMS.',null,null,'i7',4),
('2026-10-28T07:30:00.000Z','a:randy','system','Status: In Progress → Closed',null,null,'i7',5),
('2026-11-16T22:49:00.168Z','a:tika','text','Tiga kartu tidak terbaca di mesin kantin, lampu merah menyala.',null,null,'i8',0),
('2026-11-17T00:19:00.168Z','a:bima','system','Ditugaskan ke Bima',null,null,'i8',1),
('2026-11-17T00:20:00.168Z','a:bima','system','Status: Open → In Progress',null,null,'i8',2),
('2026-11-17T01:59:00.168Z','a:bima','text','Sedang kami periksa, mohon tunggu kabar berikutnya.',null,null,'i8',3),
('2026-11-17T03:49:00.169Z','a:nadia','text','Sidik jari guru terbaca di mesin tapi tidak muncul di Ontime.',null,null,'i9',0),
('2026-11-17T04:09:00.169Z','a:randy','system','Ditugaskan ke Randy',null,null,'i9',1),
('2026-11-17T04:10:00.169Z','a:randy','system','Status: Open → In Progress',null,null,'i9',2),
('2026-11-17T04:59:00.169Z','a:randy','text','Sedang kami periksa, mohon tunggu kabar berikutnya.',null,null,'i9',3),
('2026-11-17T08:43:00.169Z','a:randy','text','Perangkat sudah diatur ulang dan berfungsi normal.',null,null,'i9',4),
('2026-11-17T08:44:00.169Z','a:randy','system','Status: In Progress → Waiting Validation',null,null,'i9',5),
('2026-11-06T04:00:00.000Z','a:dila','text','Tagihan bulan ini lebih besar dari kesepakatan kontrak.',null,null,'i10',0),
('2026-11-06T04:15:00.000Z','a:bima','system','Ditugaskan ke Bima',null,null,'i10',1),
('2026-11-06T04:16:00.000Z','a:bima','system','Status: Open → In Progress',null,null,'i10',2),
('2026-11-06T04:25:00.000Z','a:bima','text','Sedang kami periksa, mohon tunggu kabar berikutnya.',null,null,'i10',3),
('2026-11-06T11:14:00.000Z','a:bima','text','Sudah dicek dan diperbaiki, mohon dicoba lagi.',null,null,'i10',4),
('2026-11-06T11:15:00.000Z','a:bima','system','Status: In Progress → Closed',null,null,'i10',5),
('2026-11-17T05:49:00.169Z','a:risky','text','Aplikasi sangat lambat saat jam istirahat ketika banyak transaksi.',null,null,'i11',0),
('2026-11-17T06:34:00.169Z','a:ridho','system','Ditugaskan ke Ridho',null,null,'i11',1),
('2026-11-17T06:35:00.169Z','a:ridho','system','Status: Open → In Progress',null,null,'i11',2),
('2026-11-17T07:04:00.169Z','a:ridho','text','Sedang kami periksa, mohon tunggu kabar berikutnya.',null,null,'i11',3),
('2026-11-17T06:49:00.169Z','a:cs','text','Nilai ujian tengah semester belum tampil di Ontuition untuk kelas 9.',null,null,'i12',0),
('2026-11-16T07:49:00.169Z','a:tika','text','Sekolah ingin laporan transaksi harian bisa diunduh dalam format Excel.',null,null,'i13',0),
('2026-10-30T05:00:00.000Z','a:tika','text','Akun operator terkunci setelah beberapa kali salah memasukkan sandi.',null,null,'i14',0),
('2026-10-30T05:15:00.000Z','a:bima','system','Ditugaskan ke Bima',null,null,'i14',1),
('2026-10-30T05:16:00.000Z','a:bima','system','Status: Open → In Progress',null,null,'i14',2),
('2026-10-30T05:25:00.000Z','a:bima','text','Sedang kami periksa, mohon tunggu kabar berikutnya.',null,null,'i14',3),
('2026-10-30T08:34:00.000Z','a:bima','text','Perangkat sudah diatur ulang dan berfungsi normal.',null,null,'i14',4),
('2026-10-30T08:35:00.000Z','a:bima','system','Status: In Progress → Closed',null,null,'i14',5),
('2026-10-22T03:00:00.000Z','a:dila','text','Semua perangkat di sekolah tidak bisa membuka aplikasi sejak 10 menit lalu.',null,null,'i15',0),
('2026-10-22T03:15:00.000Z','a:ridho','system','Ditugaskan ke Ridho',null,null,'i15',1),
('2026-10-22T03:16:00.000Z','a:ridho','system','Status: Open → In Progress',null,null,'i15',2),
('2026-10-22T03:25:00.000Z','a:ridho','text','Sedang kami periksa, mohon tunggu kabar berikutnya.',null,null,'i15',3),
('2026-10-22T10:14:00.000Z','a:ridho','text','Sudah dicek dan diperbaiki, mohon dicoba lagi.',null,null,'i15',4),
('2026-10-22T10:15:00.000Z','a:ridho','system','Status: In Progress → Closed',null,null,'i15',5),
('2026-11-16T17:49:00.169Z','a:pindy','text','Siswa baru kelas 1 belum tampil di daftar siswa Oncard.',null,null,'i16',0),
('2026-11-16T18:04:00.169Z','a:bima','system','Ditugaskan ke Bima',null,null,'i16',1),
('2026-11-16T18:05:00.169Z','a:bima','system','Status: Open → In Progress',null,null,'i16',2),
('2026-11-16T20:34:00.169Z','a:bima','text','Sedang kami periksa, mohon tunggu kabar berikutnya.',null,null,'i16',3),
('2026-11-17T08:43:00.169Z','a:bima','text','Penyebabnya konfigurasi yang berubah setelah pembaruan, sudah dikembalikan.',null,null,'i16',4),
('2026-11-17T08:44:00.169Z','a:bima','system','Status: In Progress → Waiting Validation',null,null,'i16',5),
('2026-11-04T04:00:00.000Z','a:pindy','text','Transfer SPP sudah dilakukan kemarin tapi status masih belum lunas.',null,null,'i17',0),
('2026-11-04T04:20:00.000Z','a:randy','system','Ditugaskan ke Randy',null,null,'i17',1),
('2026-11-04T04:21:00.000Z','a:randy','system','Status: Open → In Progress',null,null,'i17',2),
('2026-11-04T04:30:00.000Z','a:randy','text','Sedang kami periksa, mohon tunggu kabar berikutnya.',null,null,'i17',3),
('2026-11-04T06:19:00.000Z','a:randy','text','Data sudah dikoreksi langsung di database dan dicek di QMS.',null,null,'i17',4),
('2026-11-04T06:20:00.000Z','a:randy','system','Status: In Progress → Closed',null,null,'i17',5),
('2026-10-24T07:00:00.000Z','a:nadia','text','Mohon ubah nama bendahara dan nomor telepon PIC di profil sekolah.',null,null,'i18',0),
('2026-10-24T08:30:00.000Z','a:ridho','system','Ditugaskan ke Ridho',null,null,'i18',1),
('2026-10-24T08:31:00.000Z','a:ridho','system','Status: Open → In Progress',null,null,'i18',2),
('2026-10-24T08:40:00.000Z','a:ridho','text','Sedang kami periksa, mohon tunggu kabar berikutnya.',null,null,'i18',3),
('2026-10-24T23:29:00.000Z','a:ridho','text','Sudah kami proses ulang manual, hasilnya sudah sesuai.',null,null,'i18',4),
('2026-10-24T23:30:00.000Z','a:ridho','system','Status: In Progress → Closed',null,null,'i18',5),
('2026-10-18T04:00:00.000Z','a:dila','text','Laporan harian menampilkan nol padahal ada transaksi di kantin.',null,null,'i19',0),
('2026-10-18T05:30:00.000Z','a:randy','system','Ditugaskan ke Randy',null,null,'i19',1),
('2026-10-18T05:31:00.000Z','a:randy','system','Status: Open → In Progress',null,null,'i19',2),
('2026-10-18T05:40:00.000Z','a:randy','text','Sedang kami periksa, mohon tunggu kabar berikutnya.',null,null,'i19',3),
('2026-10-18T12:29:00.000Z','a:randy','text','Perangkat sudah diatur ulang dan berfungsi normal.',null,null,'i19',4),
('2026-10-18T12:30:00.000Z','a:randy','system','Status: In Progress → Closed',null,null,'i19',5),
('2026-10-13T05:00:00.000Z','a:pindy','text','Orang tua melaporkan kartu anak hilang dan meminta saldo diblokir.',null,null,'i20',0),
('2026-10-13T05:15:00.000Z','a:ridho','system','Ditugaskan ke Ridho',null,null,'i20',1),
('2026-10-13T05:16:00.000Z','a:ridho','system','Status: Open → In Progress',null,null,'i20',2),
('2026-10-13T05:25:00.000Z','a:ridho','text','Sedang kami periksa, mohon tunggu kabar berikutnya.',null,null,'i20',3),
('2026-10-13T08:34:00.000Z','a:ridho','text','Sudah dicek dan diperbaiki, mohon dicoba lagi.',null,null,'i20',4),
('2026-10-13T08:35:00.000Z','a:ridho','system','Status: In Progress → Closed',null,null,'i20',5),
('2026-10-08T06:00:00.000Z','a:tika','text','Sekolah meminta jadwal pelatihan tambahan untuk guru baru.',null,null,'i21',0),
('2026-10-08T06:15:00.000Z','a:bima','system','Ditugaskan ke Bima',null,null,'i21',1),
('2026-10-08T06:16:00.000Z','a:bima','system','Status: Open → In Progress',null,null,'i21',2),
('2026-10-08T06:25:00.000Z','a:bima','text','Sedang kami periksa, mohon tunggu kabar berikutnya.',null,null,'i21',3),
('2026-10-08T21:14:00.000Z','a:bima','text','Penyebabnya konfigurasi yang berubah setelah pembaruan, sudah dikembalikan.',null,null,'i21',4),
('2026-10-08T21:15:00.000Z','a:bima','system','Status: In Progress → Closed',null,null,'i21',5),
('2026-10-03T04:00:00.000Z','a:risky','text','Mesin kartu di koperasi tidak menyala setelah mati listrik.',null,null,'i22',0),
('2026-10-03T05:30:00.000Z','a:ridho','system','Ditugaskan ke Ridho',null,null,'i22',1),
('2026-10-03T05:31:00.000Z','a:ridho','system','Status: Open → In Progress',null,null,'i22',2),
('2026-10-03T05:40:00.000Z','a:ridho','text','Sedang kami periksa, mohon tunggu kabar berikutnya.',null,null,'i22',3),
('2026-10-03T08:49:00.000Z','a:ridho','text','Data sudah dikoreksi langsung di database dan dicek di QMS.',null,null,'i22',4),
('2026-10-03T08:50:00.000Z','a:ridho','system','Status: In Progress → Closed',null,null,'i22',5),
('2026-09-28T03:00:00.000Z','a:cs','text','Ada dua siswa dengan NIS yang sama setelah impor ulang.',null,null,'i23',0),
('2026-09-28T03:35:00.000Z','a:randy','system','Ditugaskan ke Randy',null,null,'i23',1),
('2026-09-28T03:36:00.000Z','a:randy','system','Status: Open → In Progress',null,null,'i23',2),
('2026-09-28T03:45:00.000Z','a:randy','text','Sedang kami periksa, mohon tunggu kabar berikutnya.',null,null,'i23',3),
('2026-09-28T10:34:00.000Z','a:randy','text','Sudah kami proses ulang manual, hasilnya sudah sesuai.',null,null,'i23',4),
('2026-09-28T10:35:00.000Z','a:randy','system','Status: In Progress → Closed',null,null,'i23',5),
('2026-11-17T08:24:00.170Z','a:nadia','text','Saldo 12 kartu kelas 6 ter-reset ke nol setelah pembaruan.',null,null,'i24',0);
insert into public.projects (name,school_id,status,type,priority,start_date,end_date,assignee,pm,notes,contoh,created_at,created_by,extra,id) values
('Implementasi Oncard SMA Harapan','m1','berjalan','Implementasi','tinggi','2026-10-28','2026-11-27','Ridho','a:pm','Pemasangan 6 mesin kartu di kantin dan koperasi.',null,null,null,null,'pr1'),
('Onboarding SD Cahaya Bangsa','m2','berjalan','Implementasi','sedang','2026-10-30','2026-12-07','Randy','a:pm','Onboarding Oncard dari nol.',null,null,null,null,'pr2'),
('Integrasi Ontime SMK Teknologi Riau','m4','perencanaan','Implementasi','sedang','2026-11-22','2026-12-27','Ridho','a:pm','Absensi guru dengan sidik jari.',null,null,null,null,'pr3'),
('Pembaruan modul laporan transaksi',null,'berjalan','IT Produk','tinggi','2026-11-03','2026-11-24','Bima','a:pm','Menjawab permintaan fitur dari beberapa sekolah.',null,null,null,null,'pr4'),
('Perbaikan stabilitas server saat jam sibuk',null,'tertahan','IT Produk','kritis','2026-10-23','2026-11-15','Ridho','a:pm','Tertahan menunggu anggaran.',null,null,null,null,'pr5'),
('Kampanye pendaftaran siswa baru (SPMB)',null,'selesai','Bisnis','sedang','2026-09-18','2026-10-28','Randy','a:ceo','Kampanye Qrion SPMB.',null,null,null,null,'pr6')
on conflict (id) do update set name=excluded.name, school_id=excluded.school_id, status=excluded.status, type=excluded.type, priority=excluded.priority, start_date=excluded.start_date, end_date=excluded.end_date, assignee=excluded.assignee, pm=excluded.pm, notes=excluded.notes, contoh=excluded.contoh, created_at=excluded.created_at, created_by=excluded.created_by, extra=excluded.extra;
insert into public.project_assignees (person,extra,project_id,pos) values
('Ridho',null,'pr1',0),
('Randy',null,'pr1',1),
('Randy',null,'pr2',0),
('Ridho',null,'pr3',0),
('Bima',null,'pr3',1),
('Bima',null,'pr4',0),
('Randy',null,'pr4',1),
('Ridho',null,'pr5',0),
('Randy',null,'pr6',0);
insert into public.project_milestones (title,due,status,who,extra,project_id,pos) values
('Instalasi mesin kartu','2026-11-19','dikerjakan','Ridho',null,'pr1',0),
('Pelatihan operator','2026-11-23','belum','Randy',null,'pr1',1),
('Survei kebutuhan','2026-11-05','selesai','Ridho',null,'pr1',2),
('Impor data siswa','2026-11-08','selesai','Randy',null,'pr2',0),
('Pembagian kartu','2026-11-22','dikerjakan','Randy',null,'pr2',1),
('Pelatihan guru','2026-12-01','belum','Randy',null,'pr2',2),
('Survei mesin sidik jari','2026-11-25','belum','Ridho',null,'pr3',0),
('Konfigurasi jam kerja guru','2026-12-07','belum','Bima',null,'pr3',1),
('Rancang ulang laporan harian','2026-11-10','selesai','Bima',null,'pr4',0),
('Ekspor Excel','2026-11-19','dikerjakan','Randy',null,'pr4',1),
('Uji di 3 sekolah','2026-11-23','belum','Bima',null,'pr4',2),
('Analisis beban','2026-10-30','selesai','Ridho',null,'pr5',0),
('Tambah kapasitas server','2026-11-12','belum','Ridho',null,'pr5',1),
('Materi promosi','2026-09-28','selesai','Randy',null,'pr6',0),
('Webinar SPMB','2026-10-18','selesai','Randy',null,'pr6',1);
insert into public.project_logs (at,by_ref,text,extra,project_id,pos) values
('2026-11-09T04:00:00.000Z','a:pm','Survei kebutuhan selesai',null,'pr1',0),
('2026-11-08T05:00:00.000Z','a:pm','Data 310 siswa berhasil diimpor',null,'pr2',0),
('2026-11-14T06:00:00.000Z','a:bima','Ekspor Excel tahap uji',null,'pr4',0),
('2026-11-13T04:00:00.000Z','a:pm','Menunggu persetujuan anggaran server',null,'pr5',0),
('2026-10-28T05:00:00.000Z','a:ceo','Kampanye selesai, 4 leads baru',null,'pr6',0);
insert into public.leads (name,stage,est_mrr,source,am,city,contact,phone,next_date,next_action,close_date,lost_reason,notes,contoh,created_at,created_by,school_id,extra,id) values
('SMP Tunas Harapan','proposal',2000000,'Daftar akun QMS','Dila','Siak','Bu Mega','0811111222','2026-11-19','Kirim penawaran','2026-12-09',null,null,null,'2026-10-18T03:00:00.000Z',null,null,null,'l1'),
('SMA Plus Mandiri','demo',3200000,'Website (Live Preview)','Pindy','Pekanbaru','Pak Rudi','0812222333','2026-11-20','Jadwalkan demo Oncard','2026-12-10',null,null,null,'2026-10-18T03:00:00.000Z',null,null,null,'l2'),
('SD Negeri 12 Dumai','kontak',700000,'Chat WA QRION','Dila','Dumai','Bu Wati','0813333444','2026-11-18','Kirim brosur','2026-12-08',null,null,null,'2026-10-18T03:00:00.000Z',null,null,null,'l3'),
('Yayasan Al-Hikmah','negosiasi',5200000,'Leads Offline','Nadia','Bengkalis','Ustaz Farhan','0814444555','2026-11-21','Revisi harga paket','2026-12-11',null,null,null,'2026-10-18T03:00:00.000Z',null,null,null,'l4'),
('SMK Bina Karya','baru',1800000,'Website (Live Preview)','Nadia','Duri','Pak Edi','0815555666','2026-11-19','Telepon pertama','2026-12-09',null,null,null,'2026-10-18T03:00:00.000Z',null,null,null,'l5'),
('SMP Islam Ar-Raudah','menang',1500000,'Daftar akun QMS','Pindy','Pekanbaru','Bu Nurul','0816666777',null,null,null,null,null,null,'2026-10-18T03:00:00.000Z',null,null,null,'l6'),
('SD Mutiara Bunda','kalah',900000,'Chat WA QRION','Dila','Dumai','Bu Reni','0817777888',null,null,null,'Memilih vendor lain dengan harga lebih murah',null,null,'2026-10-18T03:00:00.000Z',null,null,null,'l7'),
('SMA Taruna Bangsa','proposal',4100000,'Leads Offline','Pindy','Pekanbaru','Pak Wahyu','0818888999','2026-11-22','Presentasi ke komite','2026-12-12',null,null,null,'2026-10-18T03:00:00.000Z',null,null,null,'l8'),
('Yayasan Nurul Ilmi','demo',2600000,'Website (Live Preview)','Nadia','Siak','Bu Salma','0819999000','2026-11-23','Demo Qrion Jurnal','2026-12-13',null,null,null,'2026-10-18T03:00:00.000Z',null,null,null,'l9')
on conflict (id) do update set name=excluded.name, stage=excluded.stage, est_mrr=excluded.est_mrr, source=excluded.source, am=excluded.am, city=excluded.city, contact=excluded.contact, phone=excluded.phone, next_date=excluded.next_date, next_action=excluded.next_action, close_date=excluded.close_date, lost_reason=excluded.lost_reason, notes=excluded.notes, contoh=excluded.contoh, created_at=excluded.created_at, created_by=excluded.created_by, school_id=excluded.school_id, extra=excluded.extra;
insert into public.lead_products (product_id,extra,lead_id,pos) values
('p-a',null,'l1',0),
('p-a',null,'l2',0),
('p-b',null,'l2',1),
('p-a',null,'l3',0),
('p-a',null,'l4',0),
('p-b',null,'l4',1),
('p-c',null,'l4',2),
('p-a',null,'l5',0),
('p-a',null,'l6',0),
('p-d',null,'l6',1),
('p-a',null,'l7',0),
('p-a',null,'l8',0),
('p-b',null,'l8',1),
('p-a',null,'l9',0),
('p-d',null,'l9',1);
insert into public.lead_logs (at,by_ref,type,text,extra,lead_id,pos) values
('2026-11-02T04:00:00.000Z',null,'Telepon','Telepon Bu Mega, tertarik mencoba',null,'l1',0),
('2026-11-11T05:00:00.000Z',null,'WhatsApp','Kirim materi pengenalan',null,'l1',1),
('2026-11-02T04:00:00.000Z',null,'Telepon','Telepon Pak Rudi, tertarik mencoba',null,'l2',0),
('2026-11-11T05:00:00.000Z',null,'WhatsApp','Kirim materi pengenalan',null,'l2',1),
('2026-11-02T04:00:00.000Z',null,'Telepon','Telepon Bu Wati, tertarik mencoba',null,'l3',0),
('2026-11-11T05:00:00.000Z',null,'WhatsApp','Kirim materi pengenalan',null,'l3',1),
('2026-11-02T04:00:00.000Z',null,'Telepon','Telepon Ustaz Farhan, tertarik mencoba',null,'l4',0),
('2026-11-11T05:00:00.000Z',null,'WhatsApp','Kirim materi pengenalan',null,'l4',1),
('2026-11-02T04:00:00.000Z',null,'Telepon','Telepon Pak Edi, tertarik mencoba',null,'l5',0),
('2026-11-11T05:00:00.000Z',null,'WhatsApp','Kirim materi pengenalan',null,'l5',1),
('2026-11-02T04:00:00.000Z',null,'Telepon','Telepon Bu Nurul, tertarik mencoba',null,'l6',0),
('2026-11-11T05:00:00.000Z',null,'WhatsApp','Kirim materi pengenalan',null,'l6',1),
('2026-11-14T06:00:00.000Z',null,'Catatan','Kontrak ditandatangani',null,'l6',2),
('2026-11-02T04:00:00.000Z',null,'Telepon','Telepon Bu Reni, tertarik mencoba',null,'l7',0),
('2026-11-11T05:00:00.000Z',null,'WhatsApp','Kirim materi pengenalan',null,'l7',1),
('2026-11-02T04:00:00.000Z',null,'Telepon','Telepon Pak Wahyu, tertarik mencoba',null,'l8',0),
('2026-11-11T05:00:00.000Z',null,'WhatsApp','Kirim materi pengenalan',null,'l8',1),
('2026-11-02T04:00:00.000Z',null,'Telepon','Telepon Bu Salma, tertarik mencoba',null,'l9',0),
('2026-11-11T05:00:00.000Z',null,'WhatsApp','Kirim materi pengenalan',null,'l9',1);
insert into public.invoices (no,school_id,untuk,alamat_untuk,tanggal,jatuh_tempo,status,ppn,diskon,paid_at,catatan,contoh,created_at,created_by,extra,id) values
('INV/2026/11/001','m1','SMA Harapan Nusantara','Jl. Merdeka No. 1','2026-10-18','2026-11-13','terbit',0,0,null,null,null,'2026-10-18T03:00:00.000Z','a:risky',null,'v1'),
('INV/2026/10/007','m4','SMK Teknologi Riau','Jl. Tuanku Tambusai No. 45','2026-10-03','2026-10-18','lunas',11,0,'2026-10-15',null,null,'2026-10-03T03:00:00.000Z','a:risky',null,'v2'),
('INV/2026/11/004','m6','SMA Negeri 3 Duri','Jl. Pertamina No. 21','2026-11-05','2026-11-20','terbit',11,0,null,null,null,'2026-11-05T03:00:00.000Z','a:risky',null,'v3'),
('INV/2026/11/006','m2','SD Cahaya Bangsa','Jl. Sudirman No. 12','2026-11-12','2026-11-26','draft',0,0,null,null,null,'2026-11-12T03:00:00.000Z','a:risky',null,'v4'),
('INV/2026/09/002','m3','Yayasan Abdi Negara','Jl. Diponegoro No. 7','2026-09-08','2026-09-23','batal',0,0,null,null,null,'2026-09-08T03:00:00.000Z','a:risky',null,'v5')
on conflict (id) do update set no=excluded.no, school_id=excluded.school_id, untuk=excluded.untuk, alamat_untuk=excluded.alamat_untuk, tanggal=excluded.tanggal, jatuh_tempo=excluded.jatuh_tempo, status=excluded.status, ppn=excluded.ppn, diskon=excluded.diskon, paid_at=excluded.paid_at, catatan=excluded.catatan, contoh=excluded.contoh, created_at=excluded.created_at, created_by=excluded.created_by, extra=excluded.extra;
insert into public.invoice_items (nama,qty,harga,extra,invoice_id,pos) values
('Langganan Oncard',2,500000,null,'v1',0),
('Langganan Oncard',3,2100000,null,'v2',0),
('Langganan Ontime',3,900000,null,'v2',1),
('Langganan Oncard',1,3000000,null,'v3',0),
('Langganan Ontuition',1,1000000,null,'v3',1),
('Biaya onboarding',1,2500000,null,'v4',0),
('Langganan Oncard',2,1800000,null,'v5',0);
insert into public.payments (school_id,tipe,tanggal,total,catatan,bukti,invoice_id,contoh,created_at,created_by,extra,id) values
('m1','langganan','2026-10-08',9500000,null,null,null,null,'2026-10-08T04:00:00.000Z','a:risky',null,'p1'),
('m1','langganan','2026-11-07',9400000,null,null,null,null,'2026-11-07T04:00:00.000Z','a:risky',null,'p2'),
('m4','langganan','2026-10-13',9000000,null,null,null,null,'2026-10-13T04:00:00.000Z','a:risky',null,'p3'),
('m4','langganan','2026-11-13',3000000,null,null,null,null,'2026-11-13T04:00:00.000Z','a:risky',null,'p4'),
('m5','langganan','2026-10-20',4200000,null,null,null,null,'2026-10-20T04:00:00.000Z','a:risky',null,'p5'),
('m6','langganan','2026-10-28',14250000,null,null,null,null,'2026-10-28T04:00:00.000Z','a:risky',null,'p6'),
('m7','langganan','2026-11-02',1400000,null,null,null,null,'2026-11-02T04:00:00.000Z','a:risky',null,'p7'),
('m2','langganan','2026-11-05',800000,null,null,null,null,'2026-11-05T04:00:00.000Z','a:risky',null,'p8'),
('m3','langganan','2026-09-03',3600000,null,null,null,null,'2026-09-03T04:00:00.000Z','a:risky',null,'p9'),
('m6','langganan','2026-09-28',4500000,null,null,null,null,'2026-09-28T04:00:00.000Z','a:risky',null,'p10'),
('m1','topup','2026-11-11',15000000,'Top up saldo kartu siswa kelas X-XI',null,null,null,'2026-11-11T04:00:00.000Z','a:risky',null,'p11'),
('m6','transaksi','2026-11-15',8250000,'Transaksi kantin minggu ini',null,null,null,'2026-11-15T04:00:00.000Z','a:risky',null,'p12')
on conflict (id) do update set school_id=excluded.school_id, tipe=excluded.tipe, tanggal=excluded.tanggal, total=excluded.total, catatan=excluded.catatan, bukti=excluded.bukti, invoice_id=excluded.invoice_id, contoh=excluded.contoh, created_at=excluded.created_at, created_by=excluded.created_by, extra=excluded.extra;
insert into public.payment_items (jenis,nama,bulan,nominal,qty,extra,payment_id,pos) values
('langganan','Oncard',array['2026-08','2026-09']::text[],3500000,null,null,'p1',0),
('langganan','Ontuition',array['2026-08','2026-09']::text[],1200000,null,null,'p1',1),
('tambahan','Kartu Oncard',array['2026-08']::text[],100000,null,null,'p1',2),
('langganan','Oncard',array['2026-10','2026-11']::text[],3500000,null,null,'p2',0),
('langganan','Ontuition',array['2026-10','2026-11']::text[],1200000,null,null,'p2',1),
('langganan','Oncard',array['2026-08','2026-09','2026-10']::text[],2100000,null,null,'p3',0),
('langganan','Ontime',array['2026-08','2026-09','2026-10']::text[],900000,null,null,'p3',1),
('langganan','Oncard',array['2026-11']::text[],2100000,null,null,'p4',0),
('langganan','Ontime',array['2026-11']::text[],900000,null,null,'p4',1),
('langganan','Oncard',array['2026-09','2026-10']::text[],1600000,null,null,'p5',0),
('langganan','Qrion Jurnal',array['2026-09','2026-10']::text[],500000,null,null,'p5',1),
('langganan','Oncard',array['2026-09','2026-10','2026-11']::text[],3000000,null,null,'p6',0),
('langganan','Ontuition',array['2026-09','2026-10','2026-11']::text[],1000000,null,null,'p6',1),
('langganan','Ontime',array['2026-09','2026-10','2026-11']::text[],750000,null,null,'p6',2),
('langganan','Oncard',array['2026-10','2026-11']::text[],700000,null,null,'p7',0),
('langganan','Oncard',array['2026-11']::text[],800000,null,null,'p8',0),
('langganan','Oncard',array['2026-07','2026-08']::text[],1800000,null,null,'p9',0),
('tambahan','Mesin kartu tambahan (2 unit)',array['2026-09']::text[],4500000,null,null,'p10',0);
insert into public.expenses (tanggal,kategori,deskripsi,jumlah,vendor,rutin,bukti,catatan,created_at,created_by,extra,id) values
('2026-11-17','Server dan hosting','Server produksi',2500000,'Biznet',true,null,null,'2026-11-17T05:00:00.000Z','a:risky',null,'e1'),
('2026-11-16','Gaji dan honor','Gaji tim November',38000000,null,true,null,null,'2026-11-16T05:00:00.000Z','a:risky',null,'e2'),
('2026-11-14','Software dan langganan','Langganan Google Workspace',1450000,'Google',true,null,null,'2026-11-14T05:00:00.000Z','a:risky',null,'e3'),
('2026-11-12','Marketing dan iklan','Iklan Meta untuk SPMB',3200000,'Meta',false,null,null,'2026-11-12T05:00:00.000Z','a:risky',null,'e4'),
('2026-11-15','Operasional kantor','Sewa kantor',6500000,null,true,null,null,'2026-11-15T05:00:00.000Z','a:risky',null,'e5'),
('2026-11-09','Transport dan perjalanan','Kunjungan sekolah Duri',1850000,null,false,null,null,'2026-11-09T05:00:00.000Z','a:risky',null,'e6'),
('2026-11-03','Pelatihan dan acara','Webinar dan konsumsi',2100000,null,false,null,null,'2026-11-03T05:00:00.000Z','a:risky',null,'e7'),
('2026-10-31','Peralatan','Mesin kartu cadangan 3 unit',5400000,'Supplier Mesin Kartu',false,null,null,'2026-10-31T05:00:00.000Z','a:risky',null,'e8'),
('2026-10-26','Pajak dan legal','Konsultasi legal kontrak',2500000,'Kantor Hukum Riau',false,null,null,'2026-10-26T05:00:00.000Z','a:risky',null,'e9'),
('2026-10-17','Server dan hosting','Server produksi bulan lalu',2500000,'Biznet',true,null,null,'2026-10-17T05:00:00.000Z','a:risky',null,'e10'),
('2026-10-16','Gaji dan honor','Gaji tim Oktober',38000000,null,true,null,null,'2026-10-16T05:00:00.000Z','a:risky',null,'e11'),
('2026-10-08','Komisi dan insentif','Insentif AM kuartal 3',4500000,null,false,null,null,'2026-10-08T05:00:00.000Z','a:risky',null,'e12'),
('2026-10-15','Software dan langganan','Lisensi desain',900000,'Adobe',true,null,null,'2026-10-15T05:00:00.000Z','a:risky',null,'e13'),
('2026-10-22','Lainnya','Perlengkapan kantor',650000,null,false,null,null,'2026-10-22T05:00:00.000Z','a:risky',null,'e14')
on conflict (id) do update set tanggal=excluded.tanggal, kategori=excluded.kategori, deskripsi=excluded.deskripsi, jumlah=excluded.jumlah, vendor=excluded.vendor, rutin=excluded.rutin, bukti=excluded.bukti, catatan=excluded.catatan, created_at=excluded.created_at, created_by=excluded.created_by, extra=excluded.extra;
insert into public.letters (pihak,school_id,perihal,nomor,kode,arah,tanggal,status,lampiran,lampiran_ket,catatan,created_at,created_by,extra,id) values
('SMA Harapan Nusantara','m1','Pemberitahuan Disbursement','001/SPB-QRION/XI/2026','SPB','keluar','2026-11-09','terkirim',null,null,null,'2026-11-09T03:00:00.000Z','a:risky',null,'s1'),
('SMK Teknologi Riau','m4','Permohonan Penawaran Ontime','014/SM/X/2026','SM','masuk','2026-11-01','diterima',null,null,null,'2026-11-01T03:00:00.000Z','a:pindy',null,'s2'),
('SMA Negeri 3 Duri','m6','Konfirmasi Penambahan Mesin Kartu','002/SPB-QRION/XI/2026','SPB','keluar','2026-11-13','terkirim',null,null,null,'2026-11-13T03:00:00.000Z','a:nadia',null,'s3'),
('Yayasan Abdi Negara','m3','Pemberitahuan Kontrak Berakhir','003/SPB-QRION/XI/2026','SPB','keluar','2026-11-06','terkirim',null,null,null,'2026-11-06T03:00:00.000Z','a:pindy',null,'s4'),
('SD Islam Al-Furqan','m7','Surat Balasan Permintaan Pelatihan','021/SM/X/2026','SM','masuk','2026-10-23','diterima',null,null,null,'2026-10-23T03:00:00.000Z','a:pindy',null,'s5'),
('SMP Bina Insani','m5','Undangan Pelatihan Qrion Jurnal','004/UND-QRION/XI/2026','UND','keluar','2026-11-15','draft',null,null,null,'2026-11-15T03:00:00.000Z','a:nadia',null,'s6')
on conflict (id) do update set pihak=excluded.pihak, school_id=excluded.school_id, perihal=excluded.perihal, nomor=excluded.nomor, kode=excluded.kode, arah=excluded.arah, tanggal=excluded.tanggal, status=excluded.status, lampiran=excluded.lampiran, lampiran_ket=excluded.lampiran_ket, catatan=excluded.catatan, created_at=excluded.created_at, created_by=excluded.created_by, extra=excluded.extra;
insert into public.mou (untuk,school_id,judul,nomor,status,tanggal_ttd,mulai,berakhir,lampiran,lampiran_ket,catatan,created_at,created_by,extra,id) values
('SMA Harapan Nusantara','m1','MoU Kerjasama','001/SKS','aktif','2026-01-21',null,'2026-12-07',null,null,null,'2026-01-21T03:00:00.000Z','a:risky',null,'u1'),
('SMK Teknologi Riau','m4','Perjanjian Kerjasama Oncard dan Ontime','007/PKS','aktif','2026-05-01',null,'2027-05-01',null,null,null,'2026-05-01T03:00:00.000Z','a:risky',null,'u2'),
('SMA Negeri 3 Duri','m6','Perjanjian Kerjasama Paket Lengkap','009/PKS','aktif','2026-01-21',null,'2027-01-21',null,null,null,'2026-01-21T03:00:00.000Z','a:risky',null,'u3'),
('Yayasan Pendidikan Mutiara','m8','MoU Kerjasama (berakhir)','002/SKS','berakhir','2025-07-05',null,'2026-09-08',null,null,null,'2025-07-05T03:00:00.000Z','a:risky',null,'u4')
on conflict (id) do update set untuk=excluded.untuk, school_id=excluded.school_id, judul=excluded.judul, nomor=excluded.nomor, status=excluded.status, tanggal_ttd=excluded.tanggal_ttd, mulai=excluded.mulai, berakhir=excluded.berakhir, lampiran=excluded.lampiran, lampiran_ket=excluded.lampiran_ket, catatan=excluded.catatan, created_at=excluded.created_at, created_by=excluded.created_by, extra=excluded.extra;
insert into public.letter_templates (menu,nama,kode,link,ket,files,dibuat,diubah,extra,id) values
('surat','Template Surat Pemberitahuan','SPB',null,'Contoh',null,'2026-09-18T03:00:00.000Z','2026-09-18T03:00:00.000Z',null,'t1'),
('surat','Template Surat Undangan','UND',null,'Undangan pelatihan atau rapat',null,'2026-09-23T03:00:00.000Z','2026-09-23T03:00:00.000Z',null,'t2'),
('mou','Template Perjanjian Kerjasama','PKS',null,'Draf standar PKS',null,'2026-09-28T03:00:00.000Z','2026-09-28T03:00:00.000Z',null,'t3')
on conflict (id) do update set menu=excluded.menu, nama=excluded.nama, kode=excluded.kode, link=excluded.link, ket=excluded.ket, files=excluded.files, dibuat=excluded.dibuat, diubah=excluded.diubah, extra=excluded.extra;
insert into public.branding_assets (judul,kategori,product_id,deskripsi,tautan,files,dibuat,contoh,extra,id) values
('Logo QRION','Logo',null,'Logo utama',null,'[]'::jsonb,'2026-10-09T03:00:00.000Z',null,null,'b1'),
('Brosur Oncard','Brosur','p-a','Brosur penawaran kartu pintar',null,'[]'::jsonb,'2026-10-10T03:00:00.000Z',null,null,'b2'),
('Poster Ontuition','Poster','p-b','Poster pendaftaran bimbel',null,'[]'::jsonb,'2026-10-11T03:00:00.000Z',null,null,'b3'),
('Deck Presentasi Perusahaan','Presentasi',null,'Slide profil QRION untuk sekolah',null,'[]'::jsonb,'2026-10-12T03:00:00.000Z',null,null,'b4'),
('Panduan Top Up Wali Murid','Panduan','p-a','Cara top up saldo kartu',null,'[]'::jsonb,'2026-10-13T03:00:00.000Z',null,null,'b5'),
('Banner Webinar SPMB','Banner','p-e','Banner kampanye SPMB',null,'[]'::jsonb,'2026-10-14T03:00:00.000Z',null,null,'b6'),
('Template Postingan Instagram','Media sosial',null,'Template konten bulanan',null,'[]'::jsonb,'2026-10-15T03:00:00.000Z',null,null,'b7')
on conflict (id) do update set judul=excluded.judul, kategori=excluded.kategori, product_id=excluded.product_id, deskripsi=excluded.deskripsi, tautan=excluded.tautan, files=excluded.files, dibuat=excluded.dibuat, contoh=excluded.contoh, extra=excluded.extra;
insert into public.attendance (tanggal,uid,nama,status,masuk,pulang,catatan,cat,extra,id) values
('2026-11-17','a:risky','Risky Antonio','hadir','2026-11-17T01:00:00.000Z',null,null,null,null,'2026-11-17_a_risky'),
('2026-11-17','a:ceo','Dewi Anggraini','hadir','2026-11-17T02:05:00.000Z',null,'Kunjungan sekolah',null,null,'2026-11-17_a_ceo'),
('2026-11-17','a:pm','Hendra Saputra','hadir','2026-11-17T01:05:00.000Z',null,null,null,null,'2026-11-17_a_pm'),
('2026-11-17','a:cs','Sari Wulandari','hadir','2026-11-17T02:00:00.000Z',null,null,null,null,'2026-11-17_a_cs'),
('2026-11-17','a:tika','Tika Rahmawati','hadir','2026-11-17T01:25:00.000Z',null,null,null,null,'2026-11-17_a_tika'),
('2026-11-17','a:pindy','Pindy Maharani','hadir','2026-11-17T02:12:00.000Z',null,null,null,null,'2026-11-17_a_pindy'),
('2026-11-17','a:dila','Dila Putri','hadir','2026-11-17T01:12:00.000Z',null,null,null,null,'2026-11-17_a_dila'),
('2026-11-17','a:nadia','Nadia Safitri','hadir','2026-11-17T02:05:00.000Z',null,'Kunjungan sekolah',null,null,'2026-11-17_a_nadia'),
('2026-11-17','a:ridho','Ridho Pratama','hadir','2026-11-17T01:25:00.000Z',null,null,null,null,'2026-11-17_a_ridho'),
('2026-11-17','a:randy','Randy Wijaya','hadir','2026-11-17T02:12:00.000Z',null,null,null,null,'2026-11-17_a_randy'),
('2026-11-17','a:bima','Bima Aditya','hadir','2026-11-17T01:40:00.000Z',null,null,null,null,'2026-11-17_a_bima'),
('2026-11-16','a:risky','Risky Antonio','hadir','2026-11-16T01:05:00.000Z','2026-11-16T09:10:00.000Z',null,null,null,'2026-11-16_a_risky'),
('2026-11-16','a:ceo','Dewi Anggraini','hadir','2026-11-16T02:00:00.000Z','2026-11-16T10:30:00.000Z',null,null,null,'2026-11-16_a_ceo'),
('2026-11-16','a:pm','Hendra Saputra','hadir','2026-11-16T01:12:00.000Z','2026-11-16T09:10:00.000Z',null,null,null,'2026-11-16_a_pm'),
('2026-11-16','a:cs','Sari Wulandari','hadir','2026-11-16T02:40:00.000Z','2026-11-16T10:10:00.000Z','Rapat sekolah',null,null,'2026-11-16_a_cs'),
('2026-11-16','a:tika','Tika Rahmawati','sakit',null,null,'Flu',null,null,'2026-11-16_a_tika'),
('2026-11-16','a:pindy','Pindy Maharani','hadir','2026-11-16T02:00:00.000Z','2026-11-16T10:00:00.000Z',null,null,null,'2026-11-16_a_pindy'),
('2026-11-16','a:dila','Dila Putri','hadir','2026-11-16T01:40:00.000Z','2026-11-16T09:30:00.000Z',null,null,null,'2026-11-16_a_dila'),
('2026-11-16','a:nadia','Nadia Safitri','hadir','2026-11-16T02:25:00.000Z','2026-11-16T10:30:00.000Z',null,null,null,'2026-11-16_a_nadia'),
('2026-11-16','a:ridho','Ridho Pratama','hadir','2026-11-16T01:12:00.000Z','2026-11-16T09:00:00.000Z',null,null,null,'2026-11-16_a_ridho'),
('2026-11-16','a:randy','Randy Wijaya','hadir','2026-11-16T02:05:00.000Z','2026-11-16T10:10:00.000Z','Rapat sekolah',null,null,'2026-11-16_a_randy'),
('2026-11-16','a:bima','Bima Aditya','hadir','2026-11-16T01:25:00.000Z','2026-11-16T09:10:00.000Z','Kunjungan sekolah',null,null,'2026-11-16_a_bima'),
('2026-11-15','a:risky','Risky Antonio','hadir','2026-11-15T01:40:00.000Z','2026-11-15T09:10:00.000Z',null,null,null,'2026-11-15_a_risky'),
('2026-11-15','a:ceo','Dewi Anggraini','hadir','2026-11-15T02:40:00.000Z','2026-11-15T10:10:00.000Z',null,null,null,'2026-11-15_a_ceo'),
('2026-11-15','a:pm','Hendra Saputra','hadir','2026-11-15T01:25:00.000Z','2026-11-15T09:00:00.000Z',null,null,null,'2026-11-15_a_pm'),
('2026-11-15','a:cs','Sari Wulandari','hadir','2026-11-15T02:05:00.000Z','2026-11-15T10:30:00.000Z',null,null,null,'2026-11-15_a_cs'),
('2026-11-15','a:tika','Tika Rahmawati','hadir','2026-11-15T01:40:00.000Z','2026-11-15T09:00:00.000Z',null,null,null,'2026-11-15_a_tika'),
('2026-11-15','a:pindy','Pindy Maharani','izin',null,null,'Keperluan keluarga',null,null,'2026-11-15_a_pindy'),
('2026-11-15','a:dila','Dila Putri','hadir','2026-11-15T01:12:00.000Z','2026-11-15T09:30:00.000Z',null,null,null,'2026-11-15_a_dila'),
('2026-11-15','a:nadia','Nadia Safitri','hadir','2026-11-15T02:40:00.000Z','2026-11-15T10:30:00.000Z',null,null,null,'2026-11-15_a_nadia'),
('2026-11-15','a:ridho','Ridho Pratama','hadir','2026-11-15T01:25:00.000Z','2026-11-15T09:30:00.000Z',null,null,null,'2026-11-15_a_ridho'),
('2026-11-15','a:randy','Randy Wijaya','hadir','2026-11-15T02:25:00.000Z','2026-11-15T10:10:00.000Z','Rapat sekolah',null,null,'2026-11-15_a_randy'),
('2026-11-15','a:bima','Bima Aditya','hadir','2026-11-15T01:00:00.000Z','2026-11-15T09:00:00.000Z','Kunjungan sekolah',null,null,'2026-11-15_a_bima'),
('2026-11-14','a:risky','Risky Antonio','hadir','2026-11-14T01:05:00.000Z','2026-11-14T09:00:00.000Z',null,null,null,'2026-11-14_a_risky'),
('2026-11-14','a:ceo','Dewi Anggraini','izin',null,null,'Keperluan keluarga',null,null,'2026-11-14_a_ceo'),
('2026-11-14','a:pm','Hendra Saputra','izin',null,null,'Keperluan keluarga',null,null,'2026-11-14_a_pm'),
('2026-11-14','a:cs','Sari Wulandari','hadir','2026-11-14T02:00:00.000Z','2026-11-14T10:10:00.000Z',null,null,null,'2026-11-14_a_cs'),
('2026-11-14','a:tika','Tika Rahmawati','sakit',null,null,'Flu',null,null,'2026-11-14_a_tika'),
('2026-11-14','a:pindy','Pindy Maharani','hadir','2026-11-14T02:25:00.000Z','2026-11-14T10:00:00.000Z',null,null,null,'2026-11-14_a_pindy'),
('2026-11-14','a:dila','Dila Putri','hadir','2026-11-14T01:40:00.000Z','2026-11-14T09:10:00.000Z',null,null,null,'2026-11-14_a_dila'),
('2026-11-14','a:nadia','Nadia Safitri','hadir','2026-11-14T02:25:00.000Z','2026-11-14T10:10:00.000Z',null,null,null,'2026-11-14_a_nadia'),
('2026-11-14','a:ridho','Ridho Pratama','hadir','2026-11-14T01:05:00.000Z','2026-11-14T09:00:00.000Z',null,null,null,'2026-11-14_a_ridho'),
('2026-11-14','a:randy','Randy Wijaya','hadir','2026-11-14T02:25:00.000Z','2026-11-14T10:30:00.000Z',null,null,null,'2026-11-14_a_randy'),
('2026-11-14','a:bima','Bima Aditya','izin',null,null,'Keperluan keluarga',null,null,'2026-11-14_a_bima'),
('2026-11-13','a:risky','Risky Antonio','hadir','2026-11-13T01:40:00.000Z','2026-11-13T09:10:00.000Z','Rapat sekolah',null,null,'2026-11-13_a_risky'),
('2026-11-13','a:ceo','Dewi Anggraini','hadir','2026-11-13T02:00:00.000Z','2026-11-13T10:30:00.000Z',null,null,null,'2026-11-13_a_ceo'),
('2026-11-13','a:pm','Hendra Saputra','hadir','2026-11-13T01:00:00.000Z','2026-11-13T09:30:00.000Z',null,null,null,'2026-11-13_a_pm'),
('2026-11-13','a:cs','Sari Wulandari','hadir','2026-11-13T02:05:00.000Z','2026-11-13T10:10:00.000Z',null,null,null,'2026-11-13_a_cs'),
('2026-11-13','a:tika','Tika Rahmawati','hadir','2026-11-13T01:40:00.000Z','2026-11-13T09:10:00.000Z',null,null,null,'2026-11-13_a_tika'),
('2026-11-13','a:pindy','Pindy Maharani','hadir','2026-11-13T02:05:00.000Z','2026-11-13T10:00:00.000Z',null,null,null,'2026-11-13_a_pindy'),
('2026-11-13','a:dila','Dila Putri','hadir','2026-11-13T01:05:00.000Z','2026-11-13T09:00:00.000Z',null,null,null,'2026-11-13_a_dila'),
('2026-11-13','a:nadia','Nadia Safitri','hadir','2026-11-13T02:00:00.000Z','2026-11-13T10:00:00.000Z',null,null,null,'2026-11-13_a_nadia'),
('2026-11-13','a:ridho','Ridho Pratama','hadir','2026-11-13T01:05:00.000Z','2026-11-13T09:30:00.000Z',null,null,null,'2026-11-13_a_ridho'),
('2026-11-13','a:randy','Randy Wijaya','hadir','2026-11-13T02:12:00.000Z','2026-11-13T10:10:00.000Z','Rapat sekolah',null,null,'2026-11-13_a_randy'),
('2026-11-13','a:bima','Bima Aditya','hadir','2026-11-13T01:25:00.000Z','2026-11-13T09:00:00.000Z',null,null,null,'2026-11-13_a_bima'),
('2026-11-12','a:risky','Risky Antonio','hadir','2026-11-12T01:40:00.000Z','2026-11-12T09:00:00.000Z',null,null,null,'2026-11-12_a_risky'),
('2026-11-12','a:ceo','Dewi Anggraini','hadir','2026-11-12T02:00:00.000Z','2026-11-12T10:30:00.000Z','Kunjungan sekolah',null,null,'2026-11-12_a_ceo'),
('2026-11-12','a:pm','Hendra Saputra','hadir','2026-11-12T01:05:00.000Z','2026-11-12T09:10:00.000Z',null,null,null,'2026-11-12_a_pm'),
('2026-11-12','a:cs','Sari Wulandari','hadir','2026-11-12T02:12:00.000Z','2026-11-12T10:00:00.000Z',null,null,null,'2026-11-12_a_cs'),
('2026-11-12','a:tika','Tika Rahmawati','hadir','2026-11-12T01:25:00.000Z','2026-11-12T09:10:00.000Z',null,null,null,'2026-11-12_a_tika'),
('2026-11-12','a:pindy','Pindy Maharani','hadir','2026-11-12T02:05:00.000Z','2026-11-12T10:00:00.000Z',null,null,null,'2026-11-12_a_pindy'),
('2026-11-12','a:dila','Dila Putri','izin',null,null,'Keperluan keluarga',null,null,'2026-11-12_a_dila'),
('2026-11-12','a:nadia','Nadia Safitri','hadir','2026-11-12T02:25:00.000Z','2026-11-12T10:30:00.000Z','Kunjungan sekolah',null,null,'2026-11-12_a_nadia'),
('2026-11-12','a:ridho','Ridho Pratama','hadir','2026-11-12T01:25:00.000Z','2026-11-12T09:30:00.000Z',null,null,null,'2026-11-12_a_ridho'),
('2026-11-12','a:randy','Randy Wijaya','hadir','2026-11-12T02:40:00.000Z','2026-11-12T10:00:00.000Z','Rapat sekolah',null,null,'2026-11-12_a_randy'),
('2026-11-12','a:bima','Bima Aditya','hadir','2026-11-12T01:00:00.000Z','2026-11-12T09:30:00.000Z',null,null,null,'2026-11-12_a_bima'),
('2026-11-11','a:risky','Risky Antonio','hadir','2026-11-11T01:05:00.000Z','2026-11-11T09:00:00.000Z','Rapat sekolah',null,null,'2026-11-11_a_risky'),
('2026-11-11','a:ceo','Dewi Anggraini','hadir','2026-11-11T02:40:00.000Z','2026-11-11T10:00:00.000Z',null,null,null,'2026-11-11_a_ceo'),
('2026-11-11','a:pm','Hendra Saputra','hadir','2026-11-11T01:40:00.000Z','2026-11-11T09:10:00.000Z',null,null,null,'2026-11-11_a_pm'),
('2026-11-11','a:cs','Sari Wulandari','izin',null,null,'Keperluan keluarga',null,null,'2026-11-11_a_cs'),
('2026-11-11','a:tika','Tika Rahmawati','hadir','2026-11-11T01:25:00.000Z','2026-11-11T09:30:00.000Z',null,null,null,'2026-11-11_a_tika'),
('2026-11-11','a:pindy','Pindy Maharani','hadir','2026-11-11T02:25:00.000Z','2026-11-11T10:30:00.000Z','Kerja dari rumah',null,null,'2026-11-11_a_pindy'),
('2026-11-11','a:dila','Dila Putri','hadir','2026-11-11T01:40:00.000Z','2026-11-11T09:00:00.000Z',null,null,null,'2026-11-11_a_dila'),
('2026-11-11','a:nadia','Nadia Safitri','hadir','2026-11-11T02:40:00.000Z','2026-11-11T10:00:00.000Z',null,null,null,'2026-11-11_a_nadia'),
('2026-11-11','a:ridho','Ridho Pratama','hadir','2026-11-11T01:05:00.000Z','2026-11-11T09:10:00.000Z',null,null,null,'2026-11-11_a_ridho'),
('2026-11-11','a:randy','Randy Wijaya','hadir','2026-11-11T02:00:00.000Z','2026-11-11T10:10:00.000Z',null,null,null,'2026-11-11_a_randy'),
('2026-11-11','a:bima','Bima Aditya','hadir','2026-11-11T01:25:00.000Z','2026-11-11T09:00:00.000Z',null,null,null,'2026-11-11_a_bima'),
('2026-11-10','a:risky','Risky Antonio','izin',null,null,'Keperluan keluarga',null,null,'2026-11-10_a_risky'),
('2026-11-10','a:ceo','Dewi Anggraini','hadir','2026-11-10T02:00:00.000Z','2026-11-10T10:00:00.000Z',null,null,null,'2026-11-10_a_ceo'),
('2026-11-10','a:pm','Hendra Saputra','hadir','2026-11-10T01:00:00.000Z','2026-11-10T09:10:00.000Z',null,null,null,'2026-11-10_a_pm'),
('2026-11-10','a:cs','Sari Wulandari','hadir','2026-11-10T02:40:00.000Z','2026-11-10T10:30:00.000Z',null,null,null,'2026-11-10_a_cs'),
('2026-11-10','a:tika','Tika Rahmawati','hadir','2026-11-10T01:40:00.000Z','2026-11-10T09:30:00.000Z',null,null,null,'2026-11-10_a_tika'),
('2026-11-10','a:pindy','Pindy Maharani','hadir','2026-11-10T02:05:00.000Z','2026-11-10T10:30:00.000Z',null,null,null,'2026-11-10_a_pindy'),
('2026-11-10','a:dila','Dila Putri','hadir','2026-11-10T01:12:00.000Z','2026-11-10T09:30:00.000Z',null,null,null,'2026-11-10_a_dila'),
('2026-11-10','a:nadia','Nadia Safitri','hadir','2026-11-10T02:25:00.000Z','2026-11-10T10:00:00.000Z',null,null,null,'2026-11-10_a_nadia'),
('2026-11-10','a:ridho','Ridho Pratama','hadir','2026-11-10T01:12:00.000Z','2026-11-10T09:00:00.000Z',null,null,null,'2026-11-10_a_ridho'),
('2026-11-10','a:randy','Randy Wijaya','hadir','2026-11-10T02:05:00.000Z','2026-11-10T10:30:00.000Z',null,null,null,'2026-11-10_a_randy'),
('2026-11-10','a:bima','Bima Aditya','hadir','2026-11-10T01:05:00.000Z','2026-11-10T09:30:00.000Z',null,null,null,'2026-11-10_a_bima'),
('2026-11-09','a:risky','Risky Antonio','hadir','2026-11-09T01:12:00.000Z','2026-11-09T09:00:00.000Z',null,null,null,'2026-11-09_a_risky'),
('2026-11-09','a:ceo','Dewi Anggraini','hadir','2026-11-09T02:00:00.000Z','2026-11-09T10:10:00.000Z',null,null,null,'2026-11-09_a_ceo'),
('2026-11-09','a:pm','Hendra Saputra','hadir','2026-11-09T01:05:00.000Z','2026-11-09T09:00:00.000Z',null,null,null,'2026-11-09_a_pm'),
('2026-11-09','a:cs','Sari Wulandari','hadir','2026-11-09T02:25:00.000Z','2026-11-09T10:10:00.000Z',null,null,null,'2026-11-09_a_cs'),
('2026-11-09','a:tika','Tika Rahmawati','hadir','2026-11-09T01:00:00.000Z','2026-11-09T09:30:00.000Z',null,null,null,'2026-11-09_a_tika'),
('2026-11-09','a:pindy','Pindy Maharani','hadir','2026-11-09T02:25:00.000Z','2026-11-09T10:10:00.000Z',null,null,null,'2026-11-09_a_pindy'),
('2026-11-09','a:dila','Dila Putri','hadir','2026-11-09T01:40:00.000Z','2026-11-09T09:30:00.000Z',null,null,null,'2026-11-09_a_dila'),
('2026-11-09','a:nadia','Nadia Safitri','hadir','2026-11-09T02:00:00.000Z','2026-11-09T10:00:00.000Z',null,null,null,'2026-11-09_a_nadia'),
('2026-11-09','a:ridho','Ridho Pratama','hadir','2026-11-09T01:12:00.000Z','2026-11-09T09:10:00.000Z','Kerja dari rumah',null,null,'2026-11-09_a_ridho'),
('2026-11-09','a:randy','Randy Wijaya','hadir','2026-11-09T02:12:00.000Z','2026-11-09T10:00:00.000Z',null,null,null,'2026-11-09_a_randy'),
('2026-11-09','a:bima','Bima Aditya','hadir','2026-11-09T01:12:00.000Z','2026-11-09T09:10:00.000Z','Kunjungan sekolah',null,null,'2026-11-09_a_bima'),
('2026-11-08','a:risky','Risky Antonio','hadir','2026-11-08T01:40:00.000Z','2026-11-08T09:10:00.000Z',null,null,null,'2026-11-08_a_risky'),
('2026-11-08','a:ceo','Dewi Anggraini','sakit',null,null,'Flu',null,null,'2026-11-08_a_ceo'),
('2026-11-08','a:pm','Hendra Saputra','izin',null,null,'Keperluan keluarga',null,null,'2026-11-08_a_pm'),
('2026-11-08','a:cs','Sari Wulandari','hadir','2026-11-08T02:25:00.000Z','2026-11-08T10:00:00.000Z',null,null,null,'2026-11-08_a_cs'),
('2026-11-08','a:tika','Tika Rahmawati','izin',null,null,'Keperluan keluarga',null,null,'2026-11-08_a_tika'),
('2026-11-08','a:pindy','Pindy Maharani','sakit',null,null,'Flu',null,null,'2026-11-08_a_pindy'),
('2026-11-08','a:dila','Dila Putri','hadir','2026-11-08T01:40:00.000Z','2026-11-08T09:00:00.000Z','Rapat sekolah',null,null,'2026-11-08_a_dila'),
('2026-11-08','a:nadia','Nadia Safitri','hadir','2026-11-08T02:25:00.000Z','2026-11-08T10:00:00.000Z',null,null,null,'2026-11-08_a_nadia'),
('2026-11-08','a:ridho','Ridho Pratama','hadir','2026-11-08T01:12:00.000Z','2026-11-08T09:30:00.000Z','Kerja dari rumah',null,null,'2026-11-08_a_ridho'),
('2026-11-08','a:randy','Randy Wijaya','hadir','2026-11-08T02:05:00.000Z','2026-11-08T10:00:00.000Z',null,null,null,'2026-11-08_a_randy'),
('2026-11-08','a:bima','Bima Aditya','hadir','2026-11-08T01:05:00.000Z','2026-11-08T09:00:00.000Z',null,null,null,'2026-11-08_a_bima'),
('2026-11-07','a:risky','Risky Antonio','hadir','2026-11-07T01:40:00.000Z','2026-11-07T09:00:00.000Z',null,null,null,'2026-11-07_a_risky'),
('2026-11-07','a:ceo','Dewi Anggraini','hadir','2026-11-07T02:05:00.000Z','2026-11-07T10:10:00.000Z',null,null,null,'2026-11-07_a_ceo'),
('2026-11-07','a:pm','Hendra Saputra','izin',null,null,'Keperluan keluarga',null,null,'2026-11-07_a_pm'),
('2026-11-07','a:cs','Sari Wulandari','hadir','2026-11-07T02:00:00.000Z','2026-11-07T10:00:00.000Z',null,null,null,'2026-11-07_a_cs'),
('2026-11-07','a:tika','Tika Rahmawati','hadir','2026-11-07T01:05:00.000Z','2026-11-07T09:30:00.000Z',null,null,null,'2026-11-07_a_tika'),
('2026-11-07','a:pindy','Pindy Maharani','hadir','2026-11-07T02:00:00.000Z','2026-11-07T10:30:00.000Z',null,null,null,'2026-11-07_a_pindy'),
('2026-11-07','a:dila','Dila Putri','hadir','2026-11-07T01:25:00.000Z','2026-11-07T09:30:00.000Z',null,null,null,'2026-11-07_a_dila'),
('2026-11-07','a:nadia','Nadia Safitri','hadir','2026-11-07T02:40:00.000Z','2026-11-07T10:10:00.000Z',null,null,null,'2026-11-07_a_nadia'),
('2026-11-07','a:ridho','Ridho Pratama','hadir','2026-11-07T01:12:00.000Z','2026-11-07T09:00:00.000Z',null,null,null,'2026-11-07_a_ridho'),
('2026-11-07','a:randy','Randy Wijaya','hadir','2026-11-07T02:05:00.000Z','2026-11-07T10:10:00.000Z',null,null,null,'2026-11-07_a_randy'),
('2026-11-07','a:bima','Bima Aditya','hadir','2026-11-07T01:05:00.000Z','2026-11-07T09:00:00.000Z','Kunjungan sekolah',null,null,'2026-11-07_a_bima')
on conflict (id) do update set tanggal=excluded.tanggal, uid=excluded.uid, nama=excluded.nama, status=excluded.status, masuk=excluded.masuk, pulang=excluded.pulang, catatan=excluded.catatan, cat=excluded.cat, extra=excluded.extra;
insert into public.audit_log (t,by_name,menu,aksi,extra,id) values
('2026-11-16T03:00:00.000Z','Risky Antonio (@risky)','Mitra Sekolah','AM diubah: SMA Harapan Nusantara',null,'a1'),
('2026-11-16T03:00:00.000Z','Sari Wulandari (@cs)','Isu','Tiket dibuat: Server tidak bisa diakses',null,'a2'),
('2026-11-15T03:00:00.000Z','Ridho Pratama (@ridho)','Isu','Status tiket diperbarui',null,'a3'),
('2026-11-14T03:00:00.000Z','Pindy Maharani (@pindy)','Pipeline Leads','Dipindahkan ke Negosiasi',null,'a4'),
('2026-11-13T03:00:00.000Z','Hendra Saputra (@pm)','Project','Status project diperbarui',null,'a5'),
('2026-11-12T03:00:00.000Z','Risky Antonio (@risky)','Pembayaran Mitra','Pembayaran dicatat',null,'a6'),
('2026-11-11T03:00:00.000Z','Dewi Anggraini (@ceo)','Administrasi','Nomor surat dibuat',null,'a7'),
('2026-11-09T03:00:00.000Z','Risky Antonio (@risky)','Pengaturan','Akun @bima dibuat',null,'a8'),
('2026-11-08T03:00:00.000Z','Nadia Safitri (@nadia)','Mitra Sekolah','Aktivitas ditambahkan',null,'a9'),
('2026-11-05T03:00:00.000Z','Risky Antonio (@risky)','Pengaturan','Hak akses tersimpan',null,'a10')
on conflict (id) do update set t=excluded.t, by_name=excluded.by_name, menu=excluded.menu, aksi=excluded.aksi, extra=excluded.extra;
insert into public.notes (teks,dibuat,diubah,extra,id,owner) values
('Prioritas minggu ini
- Tutup tiket Critical
- Review anggaran server
- Follow up SMA Plus Mandiri','2026-11-16T03:00:00.000Z','2026-11-16T03:00:00.000Z',null,'n_risky_1','risky'),
('Ide fitur
Notifikasi WhatsApp otomatis saat tiket berubah status','2026-11-11T03:00:00.000Z','2026-11-11T03:00:00.000Z',null,'n_risky_2','risky'),
('Target kuartal
MRR Rp 20 jt dan 12 sekolah mitra aktif','2026-11-14T03:00:00.000Z','2026-11-14T03:00:00.000Z',null,'n_ceo_1','ceo'),
('Rapat mingguan
Bahas progres Implementasi Oncard dan Ontime SMK','2026-11-16T03:00:00.000Z','2026-11-16T03:00:00.000Z',null,'n_pm_1','pm'),
('Risiko
Anggaran server belum disetujui','2026-11-13T03:00:00.000Z','2026-11-13T03:00:00.000Z',null,'n_pm_2','pm'),
('Skrip balasan cepat
Terima kasih sudah menghubungi QRION, tiket Anda sudah kami catat.','2026-11-15T03:00:00.000Z','2026-11-15T03:00:00.000Z',null,'n_cs_1','cs'),
('Kunjungan
SMA Harapan: bahas perpanjangan kontrak, bawa penawaran','2026-11-15T03:00:00.000Z','2026-11-15T03:00:00.000Z',null,'n_pindy_1','pindy'),
('Follow up
SD Cahaya Bangsa menunggu jadwal pelatihan','2026-11-16T03:00:00.000Z','2026-11-16T03:00:00.000Z',null,'n_dila_1','dila'),
('Rencana
Demo Qrion Jurnal ke Yayasan Nurul Ilmi','2026-11-15T03:00:00.000Z','2026-11-15T03:00:00.000Z',null,'n_nadia_1','nadia'),
('Debug
Cek log gateway pembayaran untuk tiket top up','2026-11-16T03:00:00.000Z','2026-11-16T03:00:00.000Z',null,'n_ridho_1','ridho'),
('Catatan
Impor data siswa SD Cahaya perlu validasi NIS','2026-11-15T03:00:00.000Z','2026-11-15T03:00:00.000Z',null,'n_randy_1','randy'),
('Todo
Selesaikan ekspor Excel laporan harian','2026-11-16T03:00:00.000Z','2026-11-16T03:00:00.000Z',null,'n_bima_1','bima')
on conflict (id) do update set teks=excluded.teks, dibuat=excluded.dibuat, diubah=excluded.diubah, extra=excluded.extra, owner=excluded.owner;


-- ===== Akun login (username@qrion.local, sandi awal: qrion123) =====
do $$ declare uid uuid := gen_random_uuid(); begin
 if not exists (select 1 from auth.users where email='risky@qrion.local') then
  insert into auth.users(instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at,confirmation_token,recovery_token,email_change,email_change_token_new)
  values('00000000-0000-0000-0000-000000000000',uid,'authenticated','authenticated','risky@qrion.local',crypt('qrion123',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'','','','');
  insert into auth.identities(id,user_id,provider_id,identity_data,provider,last_sign_in_at,created_at,updated_at)
  values(gen_random_uuid(),uid,uid::text,jsonb_build_object('sub',uid::text,'email','risky@qrion.local','email_verified',true),'email',now(),now(),now());
 else
  update auth.users set encrypted_password=crypt('qrion123',gen_salt('bf')) where email='risky@qrion.local';
 end if; end $$;
do $$ declare uid uuid := gen_random_uuid(); begin
 if not exists (select 1 from auth.users where email='ceo@qrion.local') then
  insert into auth.users(instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at,confirmation_token,recovery_token,email_change,email_change_token_new)
  values('00000000-0000-0000-0000-000000000000',uid,'authenticated','authenticated','ceo@qrion.local',crypt('qrion123',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'','','','');
  insert into auth.identities(id,user_id,provider_id,identity_data,provider,last_sign_in_at,created_at,updated_at)
  values(gen_random_uuid(),uid,uid::text,jsonb_build_object('sub',uid::text,'email','ceo@qrion.local','email_verified',true),'email',now(),now(),now());
 else
  update auth.users set encrypted_password=crypt('qrion123',gen_salt('bf')) where email='ceo@qrion.local';
 end if; end $$;
do $$ declare uid uuid := gen_random_uuid(); begin
 if not exists (select 1 from auth.users where email='pm@qrion.local') then
  insert into auth.users(instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at,confirmation_token,recovery_token,email_change,email_change_token_new)
  values('00000000-0000-0000-0000-000000000000',uid,'authenticated','authenticated','pm@qrion.local',crypt('qrion123',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'','','','');
  insert into auth.identities(id,user_id,provider_id,identity_data,provider,last_sign_in_at,created_at,updated_at)
  values(gen_random_uuid(),uid,uid::text,jsonb_build_object('sub',uid::text,'email','pm@qrion.local','email_verified',true),'email',now(),now(),now());
 else
  update auth.users set encrypted_password=crypt('qrion123',gen_salt('bf')) where email='pm@qrion.local';
 end if; end $$;
do $$ declare uid uuid := gen_random_uuid(); begin
 if not exists (select 1 from auth.users where email='cs@qrion.local') then
  insert into auth.users(instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at,confirmation_token,recovery_token,email_change,email_change_token_new)
  values('00000000-0000-0000-0000-000000000000',uid,'authenticated','authenticated','cs@qrion.local',crypt('qrion123',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'','','','');
  insert into auth.identities(id,user_id,provider_id,identity_data,provider,last_sign_in_at,created_at,updated_at)
  values(gen_random_uuid(),uid,uid::text,jsonb_build_object('sub',uid::text,'email','cs@qrion.local','email_verified',true),'email',now(),now(),now());
 else
  update auth.users set encrypted_password=crypt('qrion123',gen_salt('bf')) where email='cs@qrion.local';
 end if; end $$;
do $$ declare uid uuid := gen_random_uuid(); begin
 if not exists (select 1 from auth.users where email='tika@qrion.local') then
  insert into auth.users(instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at,confirmation_token,recovery_token,email_change,email_change_token_new)
  values('00000000-0000-0000-0000-000000000000',uid,'authenticated','authenticated','tika@qrion.local',crypt('qrion123',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'','','','');
  insert into auth.identities(id,user_id,provider_id,identity_data,provider,last_sign_in_at,created_at,updated_at)
  values(gen_random_uuid(),uid,uid::text,jsonb_build_object('sub',uid::text,'email','tika@qrion.local','email_verified',true),'email',now(),now(),now());
 else
  update auth.users set encrypted_password=crypt('qrion123',gen_salt('bf')) where email='tika@qrion.local';
 end if; end $$;
do $$ declare uid uuid := gen_random_uuid(); begin
 if not exists (select 1 from auth.users where email='pindy@qrion.local') then
  insert into auth.users(instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at,confirmation_token,recovery_token,email_change,email_change_token_new)
  values('00000000-0000-0000-0000-000000000000',uid,'authenticated','authenticated','pindy@qrion.local',crypt('qrion123',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'','','','');
  insert into auth.identities(id,user_id,provider_id,identity_data,provider,last_sign_in_at,created_at,updated_at)
  values(gen_random_uuid(),uid,uid::text,jsonb_build_object('sub',uid::text,'email','pindy@qrion.local','email_verified',true),'email',now(),now(),now());
 else
  update auth.users set encrypted_password=crypt('qrion123',gen_salt('bf')) where email='pindy@qrion.local';
 end if; end $$;
do $$ declare uid uuid := gen_random_uuid(); begin
 if not exists (select 1 from auth.users where email='dila@qrion.local') then
  insert into auth.users(instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at,confirmation_token,recovery_token,email_change,email_change_token_new)
  values('00000000-0000-0000-0000-000000000000',uid,'authenticated','authenticated','dila@qrion.local',crypt('qrion123',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'','','','');
  insert into auth.identities(id,user_id,provider_id,identity_data,provider,last_sign_in_at,created_at,updated_at)
  values(gen_random_uuid(),uid,uid::text,jsonb_build_object('sub',uid::text,'email','dila@qrion.local','email_verified',true),'email',now(),now(),now());
 else
  update auth.users set encrypted_password=crypt('qrion123',gen_salt('bf')) where email='dila@qrion.local';
 end if; end $$;
do $$ declare uid uuid := gen_random_uuid(); begin
 if not exists (select 1 from auth.users where email='nadia@qrion.local') then
  insert into auth.users(instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at,confirmation_token,recovery_token,email_change,email_change_token_new)
  values('00000000-0000-0000-0000-000000000000',uid,'authenticated','authenticated','nadia@qrion.local',crypt('qrion123',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'','','','');
  insert into auth.identities(id,user_id,provider_id,identity_data,provider,last_sign_in_at,created_at,updated_at)
  values(gen_random_uuid(),uid,uid::text,jsonb_build_object('sub',uid::text,'email','nadia@qrion.local','email_verified',true),'email',now(),now(),now());
 else
  update auth.users set encrypted_password=crypt('qrion123',gen_salt('bf')) where email='nadia@qrion.local';
 end if; end $$;
do $$ declare uid uuid := gen_random_uuid(); begin
 if not exists (select 1 from auth.users where email='ridho@qrion.local') then
  insert into auth.users(instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at,confirmation_token,recovery_token,email_change,email_change_token_new)
  values('00000000-0000-0000-0000-000000000000',uid,'authenticated','authenticated','ridho@qrion.local',crypt('qrion123',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'','','','');
  insert into auth.identities(id,user_id,provider_id,identity_data,provider,last_sign_in_at,created_at,updated_at)
  values(gen_random_uuid(),uid,uid::text,jsonb_build_object('sub',uid::text,'email','ridho@qrion.local','email_verified',true),'email',now(),now(),now());
 else
  update auth.users set encrypted_password=crypt('qrion123',gen_salt('bf')) where email='ridho@qrion.local';
 end if; end $$;
do $$ declare uid uuid := gen_random_uuid(); begin
 if not exists (select 1 from auth.users where email='randy@qrion.local') then
  insert into auth.users(instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at,confirmation_token,recovery_token,email_change,email_change_token_new)
  values('00000000-0000-0000-0000-000000000000',uid,'authenticated','authenticated','randy@qrion.local',crypt('qrion123',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'','','','');
  insert into auth.identities(id,user_id,provider_id,identity_data,provider,last_sign_in_at,created_at,updated_at)
  values(gen_random_uuid(),uid,uid::text,jsonb_build_object('sub',uid::text,'email','randy@qrion.local','email_verified',true),'email',now(),now(),now());
 else
  update auth.users set encrypted_password=crypt('qrion123',gen_salt('bf')) where email='randy@qrion.local';
 end if; end $$;
do $$ declare uid uuid := gen_random_uuid(); begin
 if not exists (select 1 from auth.users where email='bima@qrion.local') then
  insert into auth.users(instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at,confirmation_token,recovery_token,email_change,email_change_token_new)
  values('00000000-0000-0000-0000-000000000000',uid,'authenticated','authenticated','bima@qrion.local',crypt('qrion123',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'','','','');
  insert into auth.identities(id,user_id,provider_id,identity_data,provider,last_sign_in_at,created_at,updated_at)
  values(gen_random_uuid(),uid,uid::text,jsonb_build_object('sub',uid::text,'email','bima@qrion.local','email_verified',true),'email',now(),now(),now());
 else
  update auth.users set encrypted_password=crypt('qrion123',gen_salt('bf')) where email='bima@qrion.local';
 end if; end $$;
