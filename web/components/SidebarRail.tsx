"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const AVATAR = "https://www.tapback.co/api/avatar/jay.webp?color=7";

const NAV = [
  {
    href: "/now",
    label: "now",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: "/today",
    label: "today",
    icon: (
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
    icon: (
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
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export function SidebarRail() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/more") return false; // more is never "active"
    return pathname?.startsWith(href) ?? false;
  }

  return (
    <aside className="sidebar-rail">
      {/* App wordmark */}
      <div className="sb-wordmark">
        <span className="sb-wordmark-icon">
          <svg viewBox="0 0 20 20" fill="none">
            <circle
              cx="10"
              cy="10"
              r="9"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <circle cx="10" cy="10" r="3.5" fill="currentColor" />
          </svg>
        </span>
        <span className="sb-wordmark-text">Do It</span>
      </div>

      {/* Primary nav: 4 items */}
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`sb-item${isActive(item.href) ? " active" : ""}`}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}

      {/* Bottom: avatar + Cmd+K hint */}
      <div className="sb-bottom">
        <Link href="/settings/" className="me-sm" aria-label="Settings">
          <img src={AVATAR} alt="Adam" />
        </Link>
        <span className="me-name">adam</span>
        <span className="kb-hint">⌘K</span>
      </div>
    </aside>
  );
}
