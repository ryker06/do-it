"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/now",
    label: "Now",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width={18}
        height={18}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: "/today",
    label: "Today",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width={18}
        height={18}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3.5" y="5.5" width="17" height="15" rx="3" />
        <path d="M3.5 10h17M8 3.5v3.5M16 3.5v3.5" />
      </svg>
    ),
  },
  {
    href: "/domains",
    label: "Domains",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width={18}
        height={18}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3.5" y="4.5" width="17" height="5" rx="2" />
        <rect x="3.5" y="11.5" width="17" height="5" rx="2" />
        <rect x="3.5" y="18.5" width="11" height="2" rx="1" />
      </svg>
    ),
  },
  {
    href: "/visions",
    label: "Visions",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width={18}
        height={18}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 4.5l1.6 6 5.9 1.5-5.9 1.5L12 19.5l-1.6-6L4.5 12l5.9-1.5L12 4.5z" />
      </svg>
    ),
  },
  {
    href: "/routines",
    label: "Routines",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width={18}
        height={18}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 7v5l3 2" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
  {
    href: "/meal",
    label: "Meal",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width={18}
        height={18}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3a5 5 0 015 5c0 2.5-1.5 4.5-3.5 5.3V20a1.5 1.5 0 01-3 0v-6.7C8.5 12.5 7 10.5 7 8a5 5 0 015-5z" />
      </svg>
    ),
  },
  {
    href: "/inbox",
    label: "Inbox",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width={18}
        height={18}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" />
        <path d="M2 10h20" />
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "Settings",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width={18}
        height={18}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
  {
    href: "/yesterday",
    label: "Yesterday",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width={18}
        height={18}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 12a9 9 0 109-9M3 12V7M3 12H8" />
      </svg>
    ),
  },
];

interface NavDrawerProps {
  onClose: () => void;
}

export function NavDrawer({ onClose }: NavDrawerProps) {
  const pathname = usePathname();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
      }}
    >
      {/* scrim */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(18,18,24,0.30)",
          backdropFilter: "blur(10px) saturate(130%)",
          WebkitBackdropFilter: "blur(10px) saturate(130%)",
        }}
      />

      {/* drawer — slides from LEFT */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: 280,
          maxWidth: "85vw",
          height: "100%",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          boxShadow:
            "2px 0 0 rgba(60,60,67,0.04), 8px 0 32px -8px rgba(20,20,30,0.18), 20px 0 60px -20px rgba(20,20,30,0.14)",
          animation: "slideInLeft 0.22s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* header */}
        <div
          style={{
            padding: "24px 20px 16px",
            borderBottom: "0.5px solid rgba(60,60,67,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--label,#8E8E93)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 3,
              }}
            >
              Do It
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "var(--ink,#000)",
                letterSpacing: "-0.030em",
              }}
            >
              Navigation
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "var(--inset,#F2F2F7)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.06)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width={12}
              height={12}
              fill="none"
              stroke="var(--ink-2,#1C1C1E)"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* nav items */}
        <nav
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "10px 12px",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 12px",
                  borderRadius: 14,
                  marginBottom: 2,
                  textDecoration: "none",
                  background: active
                    ? "linear-gradient(135deg, #F0F6FF 0%, #E6F0FF 100%)"
                    : "transparent",
                  color: active
                    ? "var(--blue,#007AFF)"
                    : "var(--ink-2,#1C1C1E)",
                  fontWeight: active ? 600 : 500,
                  fontSize: 15,
                  letterSpacing: "-0.018em",
                  boxShadow: active
                    ? "inset 0 0 0 0.5px rgba(0,122,255,0.16)"
                    : "none",
                  transition: "background 0.1s ease",
                }}
              >
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: active
                      ? "rgba(0,122,255,0.12)"
                      : "var(--inset,#F2F2F7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: active
                      ? "var(--blue,#007AFF)"
                      : "var(--label-2,#6E6E73)",
                    boxShadow: active
                      ? "none"
                      : "inset 0 0 0 0.5px rgba(60,60,67,0.06)",
                  }}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* footer */}
        <div
          style={{
            padding: "14px 20px 28px",
            borderTop: "0.5px solid rgba(60,60,67,0.08)",
            fontSize: 11,
            fontWeight: 500,
            color: "var(--label,#8E8E93)",
            letterSpacing: "0.005em",
          }}
        >
          Do It · v0.5
        </div>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0.6; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
