"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Shell from "@/components/layout/Shell";
import { useAccess } from "@/lib/auth/access";
import { useSession } from "@/lib/auth/session";

/** Beranda: arahkan ke menu awal sesuai peran, atau tampilkan layar masuk. */
export default function Home() {
  const { acct } = useSession();
  const A = useAccess();
  const router = useRouter();
  const done = useRef(false);
  useEffect(() => {
    if (acct && !done.current && window.location.pathname === "/") {
      const hv = A.homeView();
      if (hv) done.current = true;
      if (hv) router.replace("/" + hv);
    }
  }, [acct, A, router]);
  return <Shell>{null}</Shell>;
}
