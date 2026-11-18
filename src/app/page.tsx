"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Shell from "@/components/layout/Shell";
import { useAccess } from "@/lib/auth/access";
import { useSession } from "@/lib/auth/session";

/** Beranda: arahkan ke menu awal sesuai peran, atau jelaskan bila peran belum diatur. */
export default function Home() {
  const { acct } = useSession();
  const A = useAccess();
  const router = useRouter();
  const done = useRef(false);
  const home = acct ? A.homeView() : null;

  useEffect(() => {
    if (!home || done.current) return;
    done.current = true;
    router.replace("/" + home);
  }, [home, router]);

  return (
    <Shell>
      {acct && !home ? (
        <div className="panel empty">Akun Anda belum diberi peran, jadi belum ada menu yang bisa dibuka. Minta super admin menetapkan peran Anda di menu Pengaturan.</div>
      ) : null}
    </Shell>
  );
}
