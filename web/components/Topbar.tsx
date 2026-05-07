"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { quoteForToday } from "@/lib/quotes";

const AVATAR = "https://www.tapback.co/api/avatar/jay.webp?color=7";

export function Topbar({
  sub,
}: {
  sub?: string;
  name?: string;
  live?: boolean;
}) {
  // Gate quote behind mount to prevent hydration mismatch:
  // quoteForToday() calls new Date() which differs between SSR and client
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(quoteForToday());
  }, []);

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
        {/* suppressHydrationWarning as belt-and-suspenders: SSR renders "" client renders quote */}
        <div className="topbar-quote" suppressHydrationWarning>
          {quote}
        </div>
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
