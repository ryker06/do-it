"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const AVATAR = "https://www.tapback.co/api/avatar/jay.webp?color=7";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const PRIMARY: NavItem[] = [
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
];

const GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "do",
    items: [
      {
        href: "/inbox",
        label: "inbox",
        icon: (
          <svg viewBox="0 0 24 24">
            <path d="M3 7h18M3 12h18M3 17h12" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "track",
    items: [
      {
        href: "/habits",
        label: "habits",
        icon: (
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        ),
      },
      {
        href: "/workouts",
        label: "workouts",
        icon: (
          <svg viewBox="0 0 24 24">
            <path d="M6.5 6.5l11 11M3 12l9 9M12 3l9 9" />
          </svg>
        ),
      },
      {
        href: "/health",
        label: "health",
        icon: (
          <svg viewBox="0 0 24 24">
            <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        ),
      },
      {
        href: "/state",
        label: "state",
        icon: (
          <svg viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" />
            <path d="M12 8v8M8 12h8" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "know",
    items: [
      {
        href: "/visions",
        label: "visions",
        icon: (
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        ),
      },
      {
        href: "/goals",
        label: "goals",
        icon: (
          <svg viewBox="0 0 24 24">
            <path d="M9 4v16M15 4v16M4 9h16M4 15h16" />
          </svg>
        ),
      },
      {
        href: "/insights",
        label: "insights",
        icon: (
          <svg viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        ),
      },
      {
        href: "/jar",
        label: "cookie jar",
        icon: (
          <svg viewBox="0 0 24 24">
            <path d="M12 2a4 4 0 014 4H8a4 4 0 014-4z" />
            <rect x="6" y="6" width="12" height="14" rx="3" />
          </svg>
        ),
      },
      {
        href: "/knowledge",
        label: "heatmap",
        icon: (
          <svg viewBox="0 0 24 24">
            <rect x="3" y="3" width="4" height="4" rx="1" />
            <rect x="10" y="3" width="4" height="4" rx="1" />
            <rect x="17" y="3" width="4" height="4" rx="1" />
            <rect x="3" y="10" width="4" height="4" rx="1" />
            <rect x="10" y="10" width="4" height="4" rx="1" />
            <rect x="17" y="10" width="4" height="4" rx="1" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "life",
    items: [
      {
        href: "/people",
        label: "people",
        icon: (
          <svg viewBox="0 0 24 24">
            <circle cx="9" cy="7" r="4" />
            <path d="M1 21v-2a7 7 0 0114 0v2" />
            <circle cx="19" cy="7" r="2" />
            <path d="M23 21v-1a4 4 0 00-4-4" />
          </svg>
        ),
      },
      {
        href: "/money",
        label: "money",
        icon: (
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v2M12 15v2M9.5 10a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 3.5" />
          </svg>
        ),
      },
      {
        href: "/wishlist",
        label: "wishlist",
        icon: (
          <svg viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "tend",
    items: [
      {
        href: "/domains",
        label: "domains",
        icon: (
          <svg viewBox="0 0 24 24">
            <rect x="3.5" y="4.5" width="17" height="5" rx="2" />
            <rect x="3.5" y="11.5" width="17" height="5" rx="2" />
            <rect x="3.5" y="18.5" width="11" height="2" rx="1" />
          </svg>
        ),
      },
      {
        href: "/routines",
        label: "routines",
        icon: (
          <svg viewBox="0 0 24 24">
            <path d="M12 2v10l6 3" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        ),
      },
      {
        href: "/reflect",
        label: "reflect",
        icon: (
          <svg viewBox="0 0 24 24">
            <path d="M3 17l4-8 4 4 4-6 4 6" />
          </svg>
        ),
      },
      {
        href: "/review",
        label: "weekly",
        icon: (
          <svg viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="3" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "home",
    items: [
      {
        href: "/yesterday",
        label: "yesterday",
        icon: (
          <svg viewBox="0 0 24 24">
            <path d="M3 12h18M3 12l4-4M3 12l4 4" />
          </svg>
        ),
      },
      {
        href: "/settings",
        label: "settings",
        icon: (
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        ),
      },
    ],
  },
];

export function SidebarRail() {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname?.startsWith(href) ?? false;
  }

  return (
    <aside className="sidebar-rail">
      <div className="sb-logo">do it.</div>

      {PRIMARY.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`sb-item${isActive(item.href) ? " active" : ""}`}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}

      <div className="sb-divider" />

      {GROUPS.map((group) => (
        <div key={group.label}>
          <div className="sb-group-label">{group.label}</div>
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sb-item${isActive(item.href) ? " active" : ""}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      ))}

      <div className="sb-bottom">
        <div className="me-sm">
          <img src={AVATAR} alt="Adam" />
        </div>
        <span className="me-name">adam</span>
        <span className="kb-hint">⌘K</span>
      </div>
    </aside>
  );
}
