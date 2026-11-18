"use client";
import { isValidElement, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";

type Leaf = { value: string; label: string; icon?: ReactNode; badge?: number };
type Section = { label: string; icon?: ReactNode; children?: Leaf[]; value?: string };

const PAD = 6;
const MARK = 16;

const renderIcon = (icon?: ReactNode) => {
  if (!icon) return null;
  return <span className="bm-ic" aria-hidden="true">{isValidElement(icon) ? icon : <HugeiconsIcon icon={icon as any} size={16} strokeWidth={1.8} />}</span>;
};

const toSet = (open: number | number[]) => new Set(Array.isArray(open) ? open : open >= 0 ? [open] : []);

/** Menu bercabang: grup bisa dibuka-tutup, garis penghubung digambar SVG,
 *  penanda aksen bergeser ke bagian yang aktif. */
export default function BranchedMenu({
  items,
  active,
  defaultOpen = 0,
  onSelect,
  onToggle,
  rowHeight = 36,
  indent = 40,
  trunk = 14,
  radius = 10,
  lineWidth = 1.5,
  fontSize = 14,
  drawDuration = 400,
  foldDuration = 300,
}: {
  items: Section[];
  active?: string;
  defaultOpen?: number | number[];
  onSelect?: (value: string, item: Leaf | Section) => void;
  onToggle?: (index: number, isOpen: boolean) => void;
  rowHeight?: number;
  indent?: number;
  trunk?: number;
  radius?: number;
  lineWidth?: number;
  fontSize?: number;
  drawDuration?: number;
  foldDuration?: number;
}) {
  const [open, setOpen] = useState<Set<number>>(() => toSet(defaultOpen));
  const [innerActive, setInnerActive] = useState<string>(() => active || "");
  const current = active ?? innerActive;
  const navRef = useRef<HTMLElement | null>(null);
  const heads = useRef<(HTMLButtonElement | null)[]>([]);
  const markerRef = useRef<HTMLSpanElement | null>(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const cb = useRef({ onSelect });
  cb.current = { onSelect };

  const activeSection = items.findIndex((it) => it.value === current || it.children?.some((k) => k.value === current));
  const markerShown = activeSection >= 0 && (open.has(activeSection) || !items[activeSection]?.children);

  const place = (glide: boolean) => {
    const m = markerRef.current;
    const el = heads.current[activeSection];
    if (!m) return;
    if (!glide) m.style.transition = "none";
    if (el && markerShown) m.style.top = `${el.offsetTop + (el.offsetHeight - MARK) / 2}px`;
    m.toggleAttribute("data-on", Boolean(el && markerShown));
    if (!glide) {
      void m.offsetHeight;
      m.style.transition = "";
    }
  };

  useLayoutEffect(() => {
    place(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, markerShown, open, fontSize, rowHeight]);

  useLayoutEffect(() => {
    const ro = new ResizeObserver(() => place(false));
    if (navRef.current) ro.observe(navRef.current);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection]);

  // Grup yang memuat menu aktif ikut terbuka (mis. setelah pindah lewat drawer).
  useEffect(() => {
    if (!current) return;
    const idx = itemsRef.current.findIndex((it) => it.children?.some((k) => k.value === current));
    if (idx < 0) return;
    setOpen((prev) => (prev.has(idx) ? prev : new Set(prev).add(idx)));
  }, [current]);

  const select = (value: string, item: Leaf | Section) => {
    setInnerActive(value);
    cb.current.onSelect?.(value, item);
  };
  const toggle = (i: number) => {
    const willOpen = !open.has(i);
    setOpen((prev) => {
      const next = new Set(prev);
      if (willOpen) next.add(i);
      else next.delete(i);
      return next;
    });
    onToggle?.(i, willOpen);
  };

  const r = Math.min(radius, rowHeight / 2 - 2);
  const endX = indent - 8;
  const rowY = (k: number) => PAD + k * rowHeight + rowHeight / 2;
  const branch = (k: number) => `M ${trunk} ${rowY(k) - r} A ${r} ${r} 0 0 0 ${trunk + r} ${rowY(k)} H ${endX}`;
  const reach = (k: number) => `M ${trunk} 0 V ${rowY(k) - r} A ${r} ${r} 0 0 0 ${trunk + r} ${rowY(k)} H ${endX}`;
  const length = (k: number) => rowY(k) - r + (Math.PI * r) / 2 + (endX - trunk - r);

  return (
    <nav
      ref={navRef}
      className="bm"
      style={
        {
          "--bm-indent": `${indent}px`,
          "--bm-row": `${rowHeight}px`,
          "--bm-font": `${fontSize}px`,
          "--bm-line-w": lineWidth,
          "--bm-draw": `${drawDuration}ms`,
          "--bm-fold": `${foldDuration}ms`,
        } as React.CSSProperties
      }
    >
      <span ref={markerRef} className="bm-marker" aria-hidden="true" />
      {items.map((item, i) => {
        const kids = item.children;
        const isOpen = kids ? open.has(i) : false;
        const value = item.value ?? item.label;
        const leafActive = !kids && value === current;
        const bodyH = kids ? PAD * 2 + kids.length * rowHeight : 0;
        return (
          <div key={item.value ?? item.label} className={"bm-section" + (isOpen ? " is-open" : "")}>
            <button
              ref={(el) => {
                heads.current[i] = el;
              }}
              type="button"
              className="bm-head"
              aria-expanded={kids ? isOpen : undefined}
              aria-current={leafActive ? "true" : undefined}
              data-active={leafActive ? "" : undefined}
              onClick={() => (kids ? toggle(i) : select(value, item))}
            >
              {renderIcon(item.icon)}
              <span className="bm-label">{item.label}</span>
              {kids ? (
                <svg className="bm-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              ) : null}
            </button>

            {kids ? (
              <div className="bm-fold">
                <div className="bm-clip">
                  <div className="bm-body" style={{ height: bodyH }}>
                    <svg className="bm-lines" width={indent} height={bodyH} aria-hidden="true">
                      <path className="bm-line" d={`M ${trunk} 0 V ${rowY(kids.length - 1) - r}`} />
                      {kids.map((kid, k) => (
                        <path key={"b" + kid.value} className="bm-line" d={branch(k)} />
                      ))}
                      {kids.map((kid, k) => (
                        <path
                          key={"r" + kid.value}
                          className="bm-reach"
                          d={reach(k)}
                          style={{ strokeDasharray: length(k), strokeDashoffset: kid.value === current ? 0 : length(k) }}
                        />
                      ))}
                    </svg>
                    {kids.map((kid) => (
                      <button
                        key={kid.value}
                        type="button"
                        className="bm-item"
                        aria-current={kid.value === current ? "true" : undefined}
                        tabIndex={isOpen ? 0 : -1}
                        onClick={() => select(kid.value, kid)}
                      >
                        {renderIcon(kid.icon)}
                        <span className="bm-label">{kid.label}</span>
                        {kid.badge != null ? <span className="bm-badge">{kid.badge}</span> : null}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
