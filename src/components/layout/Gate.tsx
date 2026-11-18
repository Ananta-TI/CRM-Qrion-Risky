"use client";
import { useEffect, useRef, useState } from "react";
import { useSession } from "@/lib/auth/session";
import { remoteMode } from "@/lib/data/db";

/** Layar masuk (username + password). Kredensial demo ada di data/accounts.json. */
export default function Gate() {
  const { ready, login, accounts } = useSession();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const u = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ready) u.current?.focus();
  }, [ready]);
  const none = ready && !accounts.length && !remoteMode;
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const form = e.currentTarget as HTMLFormElement;
    const msg = await login((form.elements.namedItem("lg-u") as HTMLInputElement).value, (form.elements.namedItem("lg-p") as HTMLInputElement).value);
    setErr(msg);
    setBusy(false);
  }
  return (
    <div id="gate" className="gate">
      <div className="gcard" role="dialog" aria-modal="true" aria-labelledby="gt">
        <div className="gbrand">
          QRION <small>CRM</small>
        </div>
        <h1 id="gt">Masuk</h1>
        <p>Gunakan username dan password dari super admin untuk membuka QRION CRM.</p>
        {!ready ? (
          <p style={{ marginTop: 18 }}>
            <span className="gspin" />
            Menyiapkan halaman masuk…
          </p>
        ) : (
          <form id="lgf" autoComplete="off" noValidate onSubmit={submit}>
            {err ? (
              <p className="gerr" role="alert">
                {err}
              </p>
            ) : null}
            <div>
              <label htmlFor="lg-u">Username</label>
              <input type="text" id="lg-u" name="lg-u" ref={u} autoComplete="username" autoCapitalize="none" spellCheck={false} />
            </div>
            <div>
              <label htmlFor="lg-p">Password</label>
              <input type="password" id="lg-p" name="lg-p" autoComplete="current-password" />
            </div>
            <button className="btn primary" type="submit" disabled={busy}>
              {busy ? "Memeriksa…" : "Masuk"}
            </button>
          </form>
        )}
        {none ? <p className="gwarn">Belum ada akun login. Super admin perlu membuatnya di Pengaturan.</p> : null}
        <p className="gnote">Lupa password? Minta super admin mengatur ulang di Pengaturan.</p>
      </div>
    </div>
  );
}
