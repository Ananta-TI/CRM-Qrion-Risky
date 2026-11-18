"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import Gate from "./Gate";
import { VIEWS, live } from "@/lib/core";
import { useAccess } from "@/lib/auth/access";
import { useCollection } from "@/lib/data/db";
import { useSession } from "@/lib/auth/session";
import { useNameOf } from "@/lib/names";
import { useToast } from "@/components/ui/Toast";
import { QR, legacyBooted, syncSim } from "@/lib/legacy/bridge";

export default function Shell({ children }: { children: React.ReactNode }) {
  const { ready, acct, sim, setSim, logout } = useSession();
  const A = useAccess();
  const nameOf = useNameOf();
  const path = usePathname();
  const router = useRouter();
  const issues = useCollection("issues");
  const projects = useCollection("projects");
  const schools = useCollection("schools");
  const leads = useCollection("leads");
  const settings = useCollection("settings");
  const people: string[] = (settings.find((s) => s.id === "people") as any)?.items || [];
  const view = path.split("/")[1] || "";
  const entered = !!acct;
  const toast = useToast();
  const viewRef = useRef(view);
  viewRef.current = view;
  const doLogout = () => {
    logout();
    if (legacyBooted()) setTimeout(() => location.reload(), 150);
  };
  QR.acct = acct;
  QR.toast = toast;
  QR.logout = doLogout;
  QR.setSim = setSim;

  useEffect(() => {
    syncSim(sim ? sim.v : "");
  }, [sim]);

  useEffect(() => {
    const h = () => {
      const k = location.hash.slice(1);
      if (!k || !VIEWS.some((v) => v[0] === k)) return;
      if (k !== viewRef.current) router.push("/" + k);
    };
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, [router]);

  useEffect(() => {
    document.body.classList.toggle("gated", !entered);
    document.body.style.overflow = entered ? "" : "hidden";
  }, [entered]);

  useEffect(() => {
    if (entered && ready && view && !A.allowed(view)) {
      const hv = A.homeView();
      if (hv && hv !== view) router.replace("/" + hv);
    }
  }, [entered, ready, view, A, router]);

  const n: Record<string, number> = {
    isu: issues.filter((i) => i.status !== "Closed").length,
    project: projects.filter((p) => p.status !== "selesai").length,
    sekolah: schools.filter((s) => live(s)).length,
    pipeline: leads.filter((l) => !["menang", "kalah"].includes(l.stage)).length,
  };

  return (
    <>
      <div className="mesh" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="app">
        <aside className="rail">
          <div className="brand">
            QRION <small>CRM</small>
          </div>
          <input
            type="search"
            id="gq"
            placeholder="Cari semua data"
            aria-label="Cari semua data"
            onInput={(e) => {
              const v = (e.target as HTMLInputElement).value;
              if (viewRef.current === "ringkasan" && v.trim()) router.push("/isu?q=" + encodeURIComponent(v));
            }}
          />
          <nav id="nav" aria-label="Modul">
            {entered &&
              VIEWS.filter((v) => A.allowed(v[0])).map(([k, l]) => (
                <Link key={k} href={"/" + k} aria-current={view === k ? "page" : undefined}>
                  {l}
                  {n[k] != null ? <b>{n[k]}</b> : null}
                </Link>
              ))}
          </nav>
          <div className="me" id="me">
            {acct ? (
              <>
                <strong>{acct.nama || acct.id}</strong>
                <span>
                  {A.roleName(acct.role)} · @{acct.id}
                </span>
                <button className="btn small" onClick={doLogout} style={{ marginTop: 8 }}>
                  Keluar
                </button>
                {A.own || sim ? (
                  <>
                    <label className="simlbl" htmlFor="simsel">
                      Lihat sebagai
                    </label>
                    <select id="simsel" aria-label="Lihat tampilan sebagai peran lain" value={sim ? sim.v : ""} onChange={(e) => setSim(e.target.value)}>
                      <option value="">Akun saya (super admin)</option>
                      {people.map((p) => (
                        <option key={p} value={"prog:" + p}>
                          Programmer: {p}
                        </option>
                      ))}
                      {Object.keys(A.ACC).map((k) => (
                        <option key={k} value={"role:" + k}>
                          {A.ACC[k].name}
                        </option>
                      ))}
                    </select>
                  </>
                ) : null}
              </>
            ) : (
              <span>Belum masuk</span>
            )}
          </div>
        </aside>
        <main id="main">{entered ? children : null}</main>
      </div>
      {!entered && ready ? <Gate /> : null}
      {!ready ? <Gate /> : null}
    </>
  );
}
