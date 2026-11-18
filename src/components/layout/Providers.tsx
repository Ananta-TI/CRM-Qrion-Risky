"use client";
import { useEffect } from "react";
import { SessionProvider } from "@/lib/auth/session";
import { ToastProvider } from "@/components/ui/Toast";
import { RowNavProvider } from "@/components/ui/RowNav";
import { installSelectEnhancer } from "@/components/ui/selectEnhancer";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    installSelectEnhancer();
  }, []);

  return (
    <SessionProvider>
      <ToastProvider>
        <RowNavProvider>{children}</RowNavProvider>
      </ToastProvider>
    </SessionProvider>
  );
}
