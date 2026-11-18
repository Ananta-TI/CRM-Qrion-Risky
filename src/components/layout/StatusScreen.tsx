"use client";
import type { ReactNode } from "react";

/** Layar status layar-penuh untuk memuat data atau menampilkan kegagalan. */
export default function StatusScreen({ title, text, loading, children }: { title: string; text?: string; loading?: boolean; children?: ReactNode }) {
  return (
    <div className="gate">
      <div className="gcard" role="status" aria-live="polite">
        <div className="gbrand">
          QRION <small>CRM</small>
        </div>
        <h1>{title}</h1>
        {text ? (
          <p style={{ marginTop: 18 }}>
            {loading ? <span className="gspin" /> : null}
            {text}
          </p>
        ) : null}
        {children ? <div className="gcard-actions">{children}</div> : null}
      </div>
    </div>
  );
}
