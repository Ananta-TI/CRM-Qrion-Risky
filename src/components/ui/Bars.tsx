import type { ReactNode } from "react";

/** Diagram batang horizontal sederhana untuk panel ringkasan. */
export function Bars({ items }: { items: { label: ReactNode; value: number; text: ReactNode }[] }) {
  const mx = Math.max(1, ...items.map((x) => x.value));
  return (
    <div className="bars">
      {items.map((x, i) => (
        <div className="bar" key={i}>
          <span>{x.label}</span>
          <div className="track">
            <i style={{ width: (x.value / mx) * 100 + "%" }} />
          </div>
          <strong>{x.text}</strong>
        </div>
      ))}
    </div>
  );
}
