/** Pengelompokan menu sidebar. Urutan di sini menentukan urutan tampil. */
export type NavGroup = { key: string; label: string; views: string[] };

export const NAV_GROUPS: NavGroup[] = [
  { key: "beranda", label: "Beranda", views: ["ringkasan"] },
  { key: "operasional", label: "Operasional", views: ["isu", "project", "sekolah", "akses"] },
  { key: "keuangan", label: "Keuangan", views: ["pembayaran", "keluar"] },
  { key: "bisnis", label: "Bisnis", views: ["pipeline", "administrasi", "branding"] },
  { key: "tim", label: "Tim & pribadi", views: ["absen", "catatan", "tim"] },
];
