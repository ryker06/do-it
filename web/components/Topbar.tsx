"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SearchOverlay from "@/components/SearchOverlay";

const AVATAR = "https://www.tapback.co/api/avatar/jay.webp?color=7";

export function Topbar({
  name,
  sub,
  live = false,
}: {
  name: string;
  sub?: string;
  live?: boolean;
}) {
  const [dayLabel, setDayLabel] = useState<string>("Today");
  const [imgError, setImgError] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    function tick() {
      setDayLabel(formatDay(new Date()));
    }
    tick();
    const t = setInterval(tick, 30_000);
    return () => clearInterval(t);
  }, []);

  // Hash-based search toggle: #search opens overlay
  useEffect(() => {
    function onHashChange() {
      setSearchOpen(window.location.hash === "#search");
    }
    window.addEventListener("hashchange", onHashChange);
    // Check on mount
    onHashChange();
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  function openSearch() {
    window.location.hash = "search";
  }

  function closeSearch() {
    // Remove hash without adding history entry
    history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
    setSearchOpen(false);
  }

  return (
    <>
      <div
        className="topbar"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 4px",
          marginBottom: 18,
        }}
      >
        {/* greeting — left side */}
        <div style={{ flex: 1 }}>
          <div className="greet-day">{dayLabel}</div>
          <div className="greet-name">
            {name}
            {sub && <span className="sub"> · {sub}</span>}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* magnifier */}
          <button
            onClick={openSearch}
            aria-label="Search"
            style={{
              width: 34,
              height: 34,
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
              width={14}
              height={14}
              fill="none"
              stroke="var(--ink-2,#1C1C1E)"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M16.5 16.5l3.5 3.5" />
            </svg>
          </button>
          {/* memoji → settings */}
          <Link href="/settings" style={{ textDecoration: "none" }}>
            <div className={`me-avatar${live ? " live" : ""}`}>
              {imgError ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "var(--inset-2, #e9e9ee)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--label, #8e8e93)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  AL
                </div>
              ) : (
                <img
                  src={AVATAR}
                  alt="Adam"
                  onError={() => setImgError(true)}
                />
              )}
            </div>
          </Link>
        </div>
      </div>

      {searchOpen && <SearchOverlay onClose={closeSearch} />}
    </>
  );
}

function formatDay(d: Date): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${days[d.getDay()]} · ${hh}:${mm}`;
}
