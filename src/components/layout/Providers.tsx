"use client";
import { SessionProvider } from "@/lib/auth/session";
import { ToastProvider } from "@/components/ui/Toast";
import { RowNavProvider } from "@/components/ui/RowNav";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <RowNavProvider>{children}</RowNavProvider>
      </ToastProvider>
    </SessionProvider>
  );
}
