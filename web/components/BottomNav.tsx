"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    href: "/now",
    glyph: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" className="active-fill" />
      </svg>
    ),
  },
  {
    href: "/today",
    glyph: (
      <svg viewBox="0 0 24 24">
        <rect x="3.5" y="5.5" width="17" height="15" rx="3" />
        <path d="M3.5 10h17" />
        <path d="M8 3.5v3.5M16 3.5v3.5" />
      </svg>
    ),
  },
  {
    href: "/domains",
    glyph: (
      <svg viewBox="0 0 24 24">
        <rect x="3.5" y="4.5" width="17" height="5" rx="2" />
        <rect x="3.5" y="11.5" width="17" height="5" rx="2" />
        <rect x="3.5" y="18.5" width="11" height="2" rx="1" />
      </svg>
    ),
  },
  {
    href: "/visions",
    glyph: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 4.5l1.6 6 5.9 1.5-5.9 1.5L12 19.5l-1.6-6L4.5 12l5.9-1.5L12 4.5z" />
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
            <div className="pill">{t.glyph}</div>
          </Link>
        );
      })}
    </nav>
  );
}
