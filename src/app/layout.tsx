import type { Metadata } from "next";
import "@/styles/index.css";
import Providers from "@/components/layout/Providers";

export const metadata: Metadata = {
  title: "QRION CRM",
  description: "CRM internal QRION: isu, project, mitra sekolah, pembayaran, dan data QMS.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
