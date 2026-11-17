"use client";
import { SessionProvider } from "@/lib/session";
import { ToastProvider } from "@/components/Toast";
import { DrawerProvider } from "@/components/Drawer";
import { renderDrawer } from "@/features/drawers";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <DrawerProvider render={renderDrawer}>{children}</DrawerProvider>
      </ToastProvider>
    </SessionProvider>
  );
}
