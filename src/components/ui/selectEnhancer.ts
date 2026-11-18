"use client";
/**
 * Mengubah semua <select> (termasuk yang dirender mesin legacy) menjadi dropdown
 * bergaya GlideSelect: popover kaca, penanda pilihan yang meluncur, centang,
 * dukungan keyboard, dan daftar panjang yang bisa digulir.
 *
 * Elemen <select> aslinya tetap dipakai sebagai sumber nilai, jadi seluruh
 * handler `change`/`input` yang sudah ada tetap berjalan.
 */

type Item = { el: HTMLButtonElement; opt: HTMLOptionElement };

type OpenState = {
  sel: HTMLSelectElement;
  menu: HTMLDivElement;
  list: HTMLDivElement;
  pill: HTMLSpanElement;
  items: Item[];
  active: number;
  key: (e: KeyboardEvent) => void;
  blur: () => void;
  typed: string;
  typedAt: number;
};

const ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>';

let state: OpenState | null = null;
let installed = false;

const enhanced = (el: Element | null): el is HTMLSelectElement =>
  el instanceof HTMLSelectElement && !el.multiple && el.size <= 1 && !el.disabled && !el.hasAttribute("data-gs-native");

function close() {
  if (!state) return;
  const s = state;
  state = null;
  s.sel.removeEventListener("keydown", s.key);
  s.sel.removeEventListener("blur", s.blur);
  delete s.sel.dataset.gsOpen;
  s.menu.remove();
}

function setActive(i: number, scroll: boolean) {
  const s = state;
  if (!s) return;
  s.active = i;
  s.items.forEach((it, k) => it.el.classList.toggle("is-active", k === i));
  const it = s.items[i];
  if (!it) {
    s.pill.style.opacity = "0";
    return;
  }
  s.pill.style.transform = `translateY(${it.el.offsetTop}px)`;
  s.pill.style.opacity = "1";
  if (scroll) it.el.scrollIntoView({ block: "nearest" });
}

function choose(index: number) {
  const s = state;
  if (!s) return;
  const sel = s.sel;
  close();
  if (sel.selectedIndex !== index) {
    sel.selectedIndex = index;
    sel.dispatchEvent(new Event("input", { bubbles: true }));
    sel.dispatchEvent(new Event("change", { bubbles: true }));
  }
  sel.focus({ preventScroll: true });
}

function open(sel: HTMLSelectElement) {
  close();
  const opts = Array.from(sel.options).filter((o) => !o.hidden);
  if (!opts.length) return;

  const menu = document.createElement("div");
  menu.className = "gs-menu";
  menu.setAttribute("role", "listbox");
  const label = sel.getAttribute("aria-label") || sel.closest("label")?.textContent || "Pilihan";
  menu.setAttribute("aria-label", label.trim().slice(0, 80));

  const list = document.createElement("div");
  list.className = "gs-list";
  const pill = document.createElement("span");
  pill.className = "gs-pill";
  pill.setAttribute("aria-hidden", "true");
  list.appendChild(pill);
  menu.appendChild(list);

  const s: OpenState = {
    sel,
    menu,
    list,
    pill,
    items: [],
    active: 0,
    key: () => {},
    blur: () => {},
    typed: "",
    typedAt: 0,
  };
  state = s;

  opts.forEach((opt, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "gs-opt";
    b.setAttribute("role", "option");
    b.tabIndex = -1;
    b.disabled = opt.disabled;
    b.setAttribute("aria-selected", opt.index === sel.selectedIndex ? "true" : "false");

    const lab = document.createElement("span");
    lab.className = "gs-lab";
    lab.textContent = opt.label || opt.text;
    const chk = document.createElement("span");
    chk.className = "gs-check";
    chk.innerHTML = ICON;
    b.append(lab, chk);

    // Jangan biarkan fokus pindah dari <select> ke tombol menu.
    b.addEventListener("pointerdown", (e) => e.preventDefault());
    b.addEventListener("pointerenter", () => setActive(i, false));
    b.addEventListener("click", (e) => {
      e.preventDefault();
      choose(opt.index);
    });

    list.appendChild(b);
    s.items.push({ el: b, opt });
  });

  document.body.appendChild(menu);

  // Ukuran & posisi: menyesuaikan lebar select, membalik ke atas bila sempit.
  const rect = sel.getBoundingClientRect();
  const width = Math.min(Math.max(rect.width, 180), Math.min(360, window.innerWidth - 16));
  menu.style.width = `${width}px`;
  menu.style.left = `${Math.min(Math.max(8, rect.left), window.innerWidth - width - 8)}px`;
  const mh = menu.offsetHeight;
  const below = window.innerHeight - rect.bottom - 8;
  const above = rect.top - 8;
  const up = below < Math.min(mh, 240) && above > below;
  menu.style.top = up ? `${Math.max(8, rect.top - mh - 6)}px` : `${Math.min(window.innerHeight - mh - 8, rect.bottom + 6)}px`;
  menu.dataset.side = up ? "top" : "bottom";
  requestAnimationFrame(() => menu.classList.add("is-open"));

  sel.dataset.gsOpen = "";
  const selectedItem = s.items.findIndex((it) => it.opt.index === sel.selectedIndex);
  setActive(selectedItem >= 0 ? selectedItem : 0, false);

  // Keyboard: saat menu terbuka, panah/Enter/Escape ditangani di sini.
  const key = (e: KeyboardEvent) => {
    const cur = state;
    if (!cur) return;
    const n = cur.items.length;
    let i = cur.active;
    if (e.key === "ArrowDown") i = Math.min(n - 1, i + 1);
    else if (e.key === "ArrowUp") i = Math.max(0, i - 1);
    else if (e.key === "Home") i = 0;
    else if (e.key === "End") i = n - 1;
    else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const it = cur.items[cur.active];
      if (it) choose(it.opt.index);
      return;
    } else if (e.key === "Escape" || e.key === "Tab") {
      close();
      return;
    } else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const now = Date.now();
      cur.typed = now - cur.typedAt < 700 ? cur.typed + e.key.toLowerCase() : e.key.toLowerCase();
      cur.typedAt = now;
      const hit = cur.items.findIndex((it) => (it.opt.label || it.opt.text).toLowerCase().startsWith(cur.typed));
      if (hit >= 0) setActive(hit, true);
      e.preventDefault();
      return;
    } else return;
    e.preventDefault();
    setActive(i, true);
  };
  sel.addEventListener("keydown", key);

  const blur = () => close();
  sel.addEventListener("blur", blur);
  s.key = key;
  s.blur = blur;
}

export function installSelectEnhancer() {
  if (installed || typeof document === "undefined") return;
  installed = true;

  document.addEventListener(
    "pointerdown",
    (e) => {
      const target = e.target as Element | null;
      if (state && target && state.menu.contains(target)) return;
      const sel = target?.closest?.("select") ?? null;
      if (enhanced(sel)) {
        e.preventDefault();
        if (state && state.sel === sel) {
          close();
          return;
        }
        sel.focus({ preventScroll: true });
        open(sel);
        return;
      }
      if (state) close();
    },
    true,
  );

  const onScroll = (e: Event) => {
    if (state && e.target instanceof Node && state.menu.contains(e.target)) return;
    close();
  };
  document.addEventListener("scroll", onScroll, true);
  window.addEventListener("resize", close);
  window.addEventListener("blur", close);
}
