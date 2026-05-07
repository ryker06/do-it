"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    href: "/now",
    label: "now",
    glyph: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" className="active-fill" />
      </svg>
    ),
  },
  {
    href: "/today",
    label: "today",
    glyph: (
      <svg viewBox="0 0 24 24">
        <rect x="3.5" y="5.5" width="17" height="15" rx="3" />
        <path d="M3.5 10h17" />
        <path d="M8 3.5v3.5M16 3.5v3.5" />
      </svg>
    ),
  },
  {
    href: "/week",
    label: "week",
    glyph: (
      <svg viewBox="0 0 24 24">
        <rect x="3.5" y="5.5" width="3.5" height="13" rx="1" />
        <rect x="10.5" y="3.5" width="3.5" height="17" rx="1" />
        <rect x="17" y="9" width="3.5" height="9.5" rx="1" />
      </svg>
    ),
  },
  {
    href: "/more",
    label: "more",
    glyph: (
      <svg viewBox="0 0 24 24">
        <circle cx="6" cy="6" r="2" />
        <circle cx="18" cy="6" r="2" />
        <circle cx="6" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
      </svg>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="tabbar">
      {TABS.map((t) => {
        const active = pathname?.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`tab${active ? " active" : ""}`}
          >
            <div className="tab-icon">{t.glyph}</div>
            <span className="tab-label">{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
