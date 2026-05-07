"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const AVATAR = "https://www.tapback.co/api/avatar/jay.webp?color=7";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

// Icons — 16px line icons, stroke 1.7, no fill
const IC = {
  now: (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
    </svg>
  ),
  today: (
    <svg viewBox="0 0 24 24">
      <rect x="3.5" y="5.5" width="17" height="15" rx="3" />
      <path d="M3.5 10h17" />
      <path d="M8 3.5v3.5M16 3.5v3.5" />
    </svg>
  ),
  week: (
    <svg viewBox="0 0 24 24">
      <rect x="3.5" y="5.5" width="3.5" height="13" rx="1" />
      <rect x="10.5" y="3.5" width="3.5" height="17" rx="1" />
      <rect x="17" y="9" width="3.5" height="9.5" rx="1" />
    </svg>
  ),
  notes: (
    <svg viewBox="0 0 24 24">
      <path d="M4 4h16v12l-4 4H4V4z" />
      <path d="M8 8h8M8 12h5" />
    </svg>
  ),
  inbox: (
    <svg viewBox="0 0 24 24">
      <path d="M3 7h18M3 12h18M3 17h12" />
    </svg>
  ),
  visions: (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
  goals: (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  ),
  domains: (
    <svg viewBox="0 0 24 24">
      <rect x="3.5" y="4.5" width="17" height="5" rx="2" />
      <rect x="3.5" y="11.5" width="17" height="5" rx="2" />
      <rect x="3.5" y="18.5" width="11" height="2" rx="1" />
    </svg>
  ),
  routines: (
    <svg viewBox="0 0 24 24">
      <path d="M12 2v10l6 3" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
  habits: (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  workouts: (
    <svg viewBox="0 0 24 24">
      <path d="M6.5 6.5l11 11M3 12l9 9M12 3l9 9" />
    </svg>
  ),
  health: (
    <svg viewBox="0 0 24 24">
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
  state: (
    <svg viewBox="0 0 24 24">
      <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" />
      <path d="M8 13s1.5 2 4 2 4-2 4-2" />
      <path d="M9 9h.01M15 9h.01" />
    </svg>
  ),
  people: (
    <svg viewBox="0 0 24 24">
      <circle cx="9" cy="7" r="4" />
      <path d="M1 21v-2a7 7 0 0114 0v2" />
      <circle cx="19" cy="7" r="2" />
      <path d="M23 21v-1a4 4 0 00-4-4" />
    </svg>
  ),
  money: (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v2M12 15v2M9.5 10a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 3.5" />
    </svg>
  ),
  wishlist: (
    <svg viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  insights: (
    <svg viewBox="0 0 24 24">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  jar: (
    <svg viewBox="0 0 24 24">
      <path d="M12 2a4 4 0 014 4H8a4 4 0 014-4z" />
      <rect x="6" y="6" width="12" height="14" rx="3" />
    </svg>
  ),
  knowledge: (
    <svg viewBox="0 0 24 24">
      <rect x="3" y="3" width="4" height="4" rx="1" />
      <rect x="10" y="3" width="4" height="4" rx="1" />
      <rect x="17" y="3" width="4" height="4" rx="1" />
      <rect x="3" y="10" width="4" height="4" rx="1" />
      <rect x="10" y="10" width="4" height="4" rx="1" />
      <rect x="17" y="10" width="4" height="4" rx="1" />
    </svg>
  ),
  reflect: (
    <svg viewBox="0 0 24 24">
      <path d="M3 17l4-8 4 4 4-6 4 6" />
    </svg>
  ),
  prayer: (
    <svg viewBox="0 0 24 24">
      <path d="M12 2c1 2 4 4 4 8a4 4 0 01-8 0c0-4 3-6 4-8z" />
      <path d="M8 20h8" />
      <path d="M12 14v6" />
    </svg>
  ),
  meal: (
    <svg viewBox="0 0 24 24">
      <path d="M3 3h3v11a3 3 0 006 0V3h3M3 9h6" />
    </svg>
  ),
  review: (
    <svg viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  yesterday: (
    <svg viewBox="0 0 24 24">
      <path d="M3 12h18M3 12l4-4M3 12l4 4" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
};

// Navigation groups per WORKFLOW §6 keyboard map order
// Groups: DO / PLAN / TRACK / LIFE / KNOW / TEND / OTHER
const PRIMARY: NavItem[] = [
  { href: "/now", label: "now", icon: IC.now },
  { href: "/today", label: "today", icon: IC.today },
  { href: "/week", label: "week", icon: IC.week },
];

const GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "do",
    items: [
      { href: "/notes", label: "notes", icon: IC.notes },
      { href: "/inbox", label: "inbox", icon: IC.inbox },
    ],
  },
  {
    label: "plan",
    items: [
      { href: "/visions", label: "visions", icon: IC.visions },
      { href: "/goals", label: "goals", icon: IC.goals },
      { href: "/domains", label: "domains", icon: IC.domains },
      { href: "/routines", label: "routines", icon: IC.routines },
    ],
  },
  {
    label: "track",
    items: [
      { href: "/habits", label: "habits", icon: IC.habits },
      { href: "/workouts", label: "workouts", icon: IC.workouts },
      { href: "/health", label: "health", icon: IC.health },
      { href: "/state", label: "state", icon: IC.state },
    ],
  },
  {
    label: "life",
    items: [
      { href: "/people", label: "people", icon: IC.people },
      { href: "/money", label: "money", icon: IC.money },
      { href: "/wishlist", label: "wishlist", icon: IC.wishlist },
    ],
  },
  {
    label: "know",
    items: [
      { href: "/insights", label: "insights", icon: IC.insights },
      { href: "/jar", label: "cookie jar", icon: IC.jar },
      { href: "/knowledge", label: "knowledge", icon: IC.knowledge },
    ],
  },
  {
    label: "tend",
    items: [
      { href: "/reflect", label: "reflect", icon: IC.reflect },
      { href: "/prayer", label: "prayer", icon: IC.prayer },
      { href: "/meal", label: "meal", icon: IC.meal },
      { href: "/review", label: "review", icon: IC.review },
    ],
  },
  {
    label: "other",
    items: [
      { href: "/yesterday", label: "yesterday", icon: IC.yesterday },
      { href: "/settings", label: "settings", icon: IC.settings },
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

      {/* Primary nav: Now · Today · Week */}
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

      {/* Grouped nav */}
      {GROUPS.map((group) => (
        <div key={group.label}>
          <div className="sb-group-label">
            <span>{group.label}</span>
            <span className="sb-group-rule" />
          </div>
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

      {/* Bottom: avatar + Cmd+K hint */}
      <div className="sb-bottom">
        <Link href="/settings/" className="me-sm" aria-label="Settings">
          <img src={AVATAR} alt="Adam" />
        </Link>
        <span className="me-name">adam</span>
        <span className="kb-hint">⌘K do anything</span>
      </div>
    </aside>
  );
}
