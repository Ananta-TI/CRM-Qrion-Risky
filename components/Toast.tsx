"use client";
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

const Ctx = createContext<(t: string, bad?: boolean) => void>(() => {});
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [t, setT] = useState<{ text: string; bad: boolean } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toast = useCallback((text: string, bad = false) => {
    setT({ text, bad });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setT(null), 3600);
  }, []);
  return (
    <Ctx.Provider value={toast}>
      {children}
      <div id="toast" role="status" className={t?.bad ? "bad" : ""} hidden={!t}>
        {t?.text}
      </div>
    </Ctx.Provider>
  );
}
