"use client";

import Link from "next/link";
import { quoteForToday } from "@/lib/quotes";

const AVATAR = "https://www.tapback.co/api/avatar/jay.webp?color=7";

export function Topbar({
  sub,
}: {
  sub?: string;
  name?: string;
  live?: boolean;
}) {
  const quote = quoteForToday();

  return (
    <div
      style={{
        background: "var(--paper)",
        padding: "18px 20px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "0.5px solid var(--hairline)",
        marginBottom: 20,
        gap: 12,
      }}
    >
      {/* quote — left */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="topbar-quote">{quote}</div>
        {sub && <div className="topbar-sub">{sub}</div>}
      </div>

      {/* memoji — far right, links to /settings/ */}
      <Link href="/settings/" style={{ textDecoration: "none", flexShrink: 0 }}>
        <div className="me-avatar">
          <img src={AVATAR} alt="settings" />
        </div>
      </Link>
    </div>
  );
}
