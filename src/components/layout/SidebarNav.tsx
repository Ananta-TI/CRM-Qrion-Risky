"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import Briefcase01Icon from "@hugeicons/core-free-icons/Briefcase01Icon";
import ChartIncreaseIcon from "@hugeicons/core-free-icons/ChartIncreaseIcon";
import Clock01Icon from "@hugeicons/core-free-icons/Clock01Icon";
import DashboardCircleIcon from "@hugeicons/core-free-icons/DashboardCircleIcon";
import Database01Icon from "@hugeicons/core-free-icons/Database01Icon";
import Folder01Icon from "@hugeicons/core-free-icons/Folder01Icon";
import FunnelIcon from "@hugeicons/core-free-icons/FunnelIcon";
import Invoice01Icon from "@hugeicons/core-free-icons/Invoice01Icon";
import Mail01Icon from "@hugeicons/core-free-icons/Mail01Icon";
import Money01Icon from "@hugeicons/core-free-icons/Money01Icon";
import Note01Icon from "@hugeicons/core-free-icons/Note01Icon";
import PaintBoardIcon from "@hugeicons/core-free-icons/PaintBoardIcon";
import SchoolIcon from "@hugeicons/core-free-icons/SchoolIcon";
import Settings02Icon from "@hugeicons/core-free-icons/Settings02Icon";
import Ticket01Icon from "@hugeicons/core-free-icons/Ticket01Icon";
import UserGroupIcon from "@hugeicons/core-free-icons/UserGroupIcon";
import Wallet01Icon from "@hugeicons/core-free-icons/Wallet01Icon";
import { VIEWS } from "@/lib/core";
import { NAV_GROUPS } from "./navGroups";
import BranchedMenu from "./BranchedMenu";

const OPEN_KEY = "qrion-nav-open";
const labelOf = (key: string) => VIEWS.find((v) => v[0] === key)?.[1] || key;

const VIEW_ICONS: Record<string, any> = {
  ringkasan: DashboardCircleIcon,
  isu: Ticket01Icon,
  project: Folder01Icon,
  sekolah: SchoolIcon,
  akses: Database01Icon,
  pembayaran: Invoice01Icon,
  keluar: Wallet01Icon,
  pipeline: FunnelIcon,
  administrasi: Mail01Icon,
  branding: PaintBoardIcon,
  absen: Clock01Icon,
  catatan: Note01Icon,
  tim: Settings02Icon,
};

const GROUP_ICONS: Record<string, any> = {
  operasional: Briefcase01Icon,
  keuangan: Money01Icon,
  bisnis: ChartIncreaseIcon,
  tim: UserGroupIcon,
};

/** Navigasi sidebar: menu bercabang berikon di desktop, daftar mendatar di mobile. */
export default function SidebarNav({ view, allowed, counts }: { view: string; allowed: (v: string) => boolean; counts: Record<string, number> }) {
  const router = useRouter();
  const groups = NAV_GROUPS.map((g) => ({ ...g, items: g.views.filter(allowed) })).filter((g) => g.items.length);
  const activeKey = NAV_GROUPS.find((g) => g.views.includes(view))?.key;
  const [openKeys, setOpenKeys] = useState<string[]>(() => {
    if (typeof window === "undefined") return activeKey ? [activeKey] : [];
    try {
      const saved = JSON.parse(localStorage.getItem(OPEN_KEY) || "null");
      if (Array.isArray(saved)) return saved.filter((x) => typeof x === "string");
    } catch {}
    // Kunjungan pertama: buka grup yang memuat menu aktif saja.
    return activeKey ? [activeKey] : groups.slice(0, 1).map((g) => g.key);
  });

  const items = groups.map((g) => {
    if (g.key === "beranda" && g.items.length === 1) {
      const k = g.items[0];
      return { value: k, label: labelOf(k), icon: VIEW_ICONS[k] };
    }
    return {
      label: g.label,
      icon: GROUP_ICONS[g.key],
      children: g.items.map((k) => ({ value: k, label: labelOf(k), icon: VIEW_ICONS[k], badge: counts[k] })),
    };
  });

  const initialOpen = groups.map((g, i) => (openKeys.includes(g.key) ? i : -1)).filter((i) => i >= 0);

  const toggle = (index: number, isOpen: boolean) => {
    const key = groups[index]?.key;
    if (!key) return;
    const next = isOpen ? [...new Set([...openKeys, key])] : openKeys.filter((k) => k !== key);
    setOpenKeys(next);
    try {
      localStorage.setItem(OPEN_KEY, JSON.stringify(next));
    } catch {}
  };

  return (
    <>
      <div className="nav-branch">
        <BranchedMenu items={items} active={view} defaultOpen={initialOpen} onSelect={(value) => router.push("/" + value)} onToggle={toggle} rowHeight={34} indent={38} trunk={12} fontSize={14} />
      </div>

      <nav className="nav-flat" aria-label="Modul">
        {groups.flatMap((g) => g.items).map((k) => (
          <Link key={k} href={"/" + k} aria-current={view === k ? "page" : undefined}>
            <HugeiconsIcon icon={VIEW_ICONS[k]} size={16} strokeWidth={1.8} aria-hidden="true" />
            {labelOf(k)}
            {counts[k] != null ? <b>{counts[k]}</b> : null}
          </Link>
        ))}
      </nav>
    </>
  );
}
