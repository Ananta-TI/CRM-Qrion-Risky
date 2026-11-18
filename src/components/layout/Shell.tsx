"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Gate from "./Gate";
import StatusScreen from "./StatusScreen";
import AppSkeleton from "./AppSkeleton";
import SidebarNav from "./SidebarNav";
import { VIEWS, live } from "@/lib/core";
import { useAccess } from "@/lib/auth/access";
import { db, useCollection } from "@/lib/data/db";
import { useSession } from "@/lib/auth/session";
import { useNameOf } from "@/lib/names";
import { useToast } from "@/components/ui/Toast";
import { QR, legacyBooted, refreshLegacy, syncSim } from "@/lib/legacy/bridge";

export default function Shell({ children }: { children: React.ReactNode }) {
  const { ready, authName, acct, sim, setSim, logout } = useSession();
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
  const [leaving, setLeaving] = useState(false);

  const doLogout = async () => {
    if (leaving) return;
    setLeaving(true);
    try {
      await logout();
    } catch {}
    // Muat ulang penuh: memastikan state mesin legacy dan cache klien ikut bersih.
    window.location.assign("/");
  };

  QR.acct = acct;
  QR.toast = toast;
  QR.logout = doLogout;
  QR.setSim = setSim;

  // Sesi/akun berubah → mesin legacy perlu menggambar ulang (refresh & login).
  useEffect(() => {
    if (!legacyBooted()) return;
    syncSim(sim ? sim.v : "");
    refreshLegacy();
  }, [acct, sim]);

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
    // Kunci scroll selama layar masuk/status tampil; kerangka aplikasi tetap terlihat.
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

  const dataError = db.status === "error";
  const dataReady = db.status === "ready";
  const waiting = ready && !!authName && !acct && !dataError && !dataReady;
  const noAccount = ready && !!authName && !acct && dataReady;
  const showGate = ready && !waiting && !acct && !dataError && !noAccount;
  const viewAllowed = !view || !entered || A.allowed(view);

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
            disabled={!entered}
            onInput={(e) => {
              const v = (e.target as HTMLInputElement).value;
              if (viewRef.current === "ringkasan" && v.trim()) router.push("/isu?q=" + encodeURIComponent(v));
            }}
          />
          {entered ? (
            <SidebarNav view={view} allowed={A.allowed} counts={n} />
          ) : (
            <nav id="nav" aria-label="Modul" aria-hidden="true">
              {Array.from({ length: 9 }).map((_, i) => (
                <span className="sk sk-nav" key={i} />
              ))}
            </nav>
          )}
          <div className="me" id="me">
            {acct ? (
              <>
                <strong>{acct.nama || acct.id}</strong>
                <span>
                  {A.roleName(acct.role)} · @{acct.id}
                </span>
                <button className="btn small" onClick={doLogout} disabled={leaving} style={{ marginTop: 8 }}>
                  {leaving ? "Keluar…" : "Keluar"}
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
              <span>{ready ? "Belum masuk" : "Memeriksa sesi…"}</span>
            )}
          </div>
        </aside>
        <main id="main">{entered && viewAllowed ? children : <AppSkeleton />}</main>
      </div>

      {ready && !waiting && dataError && !acct ? (
        <StatusScreen title="Data belum bisa dimuat" text={db.error || "Periksa koneksi lalu coba lagi."}>
          <button className="btn primary" onClick={() => db.init()}>
            Coba lagi
          </button>
          <button className="btn" onClick={doLogout}>
            Keluar
          </button>
        </StatusScreen>
      ) : null}
      {noAccount ? (
        <StatusScreen title="Akun belum aktif" text="Sesi masuk valid, tetapi akun ini belum terdaftar atau dinonaktifkan di CRM. Hubungi super admin.">
          <button className="btn primary" onClick={doLogout}>
            Keluar
          </button>
        </StatusScreen>
      ) : null}
      {showGate ? <Gate /> : null}
    </>
  );
}
