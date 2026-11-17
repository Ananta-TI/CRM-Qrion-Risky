"use client";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

type Ctx = { state: [string, string] | null; open: (k: string, id: string) => void; close: () => void };
const DrawerCtx = createContext<Ctx>({ state: null, open: () => {}, close: () => {} });
export const useDrawer = () => useContext(DrawerCtx);

/** Panel detail samping (mitra, project, lead). Tiket isu dibuka di halaman Isu sendiri. */
export function DrawerProvider({ children, render }: { children: ReactNode; render?: (k: string, id: string, close: () => void) => ReactNode }) {
  const [state, setState] = useState<[string, string] | null>(null);
  const router = useRouter();
  const open = useCallback(
    (k: string, id: string) => {
      if (k === "isu") {
        router.push("/isu?t=" + encodeURIComponent(id));
        return;
      }
      setState([k, id]);
    },
    [router],
  );
  const close = useCallback(() => setState(null), []);
  return (
    <DrawerCtx.Provider value={{ state, open, close }}>
      {children}
      <div id="scrim" className="scrim" hidden={!state} onClick={close} />
      <aside id="drawer" className="drawer" hidden={!state} aria-label="Detail">
        {state ? (render ? render(state[0], state[1], close) : null) : null}
      </aside>
    </DrawerCtx.Provider>
  );
}
