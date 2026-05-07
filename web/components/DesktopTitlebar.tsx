"use client";

import Link from "next/link";

const AVATAR = "https://www.tapback.co/api/avatar/jay.webp?color=7";

// Surface metadata: title + contextual eyebrow per route prefix
const SURFACE_META: { prefix: string; title: string; eyebrow: string }[] = [
  { prefix: "/now", title: "now", eyebrow: "EXECUTE · current block" },
  { prefix: "/today", title: "today", eyebrow: "EXECUTE · elastic day" },
  { prefix: "/week", title: "week", eyebrow: "PLAN · weekly arc" },
  { prefix: "/visions", title: "visions", eyebrow: "LIFE · vision tracking" },
  { prefix: "/goals", title: "goals", eyebrow: "PLAN · metric goals" },
  {
    prefix: "/insights",
    title: "insights",
    eyebrow: "KNOW · tested principles",
  },
  { prefix: "/people", title: "people", eyebrow: "LIFE · relationship radar" },
  { prefix: "/notes", title: "notes", eyebrow: "DO · open scratch" },
  {
    prefix: "/knowledge",
    title: "knowledge",
    eyebrow: "KNOW · learning heatmap",
  },
  { prefix: "/money", title: "money", eyebrow: "LIFE · financial overview" },
  { prefix: "/habits", title: "habits", eyebrow: "TRACK · daily streaks" },
  { prefix: "/workouts", title: "workouts", eyebrow: "TRACK · strength log" },
  { prefix: "/health", title: "health", eyebrow: "TRACK · body signals" },
  { prefix: "/state", title: "state", eyebrow: "TRACK · energy log" },
  { prefix: "/domains", title: "domains", eyebrow: "PLAN · life momentum" },
  { prefix: "/routines", title: "routines", eyebrow: "TEND · recurring flows" },
  { prefix: "/reflect", title: "reflect", eyebrow: "TEND · daily audit" },
  { prefix: "/review", title: "review", eyebrow: "TEND · weekly review" },
  { prefix: "/prayer", title: "prayer", eyebrow: "TEND · five daily prayers" },
  { prefix: "/meal", title: "meal", eyebrow: "TEND · food log" },
  { prefix: "/inbox", title: "inbox", eyebrow: "DO · capture queue" },
  { prefix: "/jar", title: "cookie jar", eyebrow: "KNOW · proof of wins" },
  { prefix: "/wishlist", title: "wishlist", eyebrow: "LIFE · want list" },
  {
    prefix: "/yesterday",
    title: "yesterday",
    eyebrow: "OTHER · yesterday log",
  },
  { prefix: "/settings", title: "settings", eyebrow: "OTHER · preferences" },
  { prefix: "/more", title: "more", eyebrow: "NAVIGATE · all surfaces" },
];

function useSurfaceMeta(pathname: string) {
  const match = SURFACE_META.find((s) => pathname.startsWith(s.prefix));
  return match ?? { title: "do it", eyebrow: "EXECUTE · your day" };
}

export function DesktopTitlebar({ pathname }: { pathname: string }) {
  const meta = useSurfaceMeta(pathname);

  function openCmdK() {
    window.dispatchEvent(new CustomEvent("open-cmdk"));
  }

  return (
    <div className="titlebar-desktop">
      {/* Left: surface title + eyebrow */}
      <div className="titlebar-left">
        <span className="titlebar-eyebrow">{meta.eyebrow}</span>
        <span className="titlebar-title">{meta.title}</span>
      </div>

      {/* Right: Cmd+K trigger + memoji */}
      <div className="titlebar-right">
        <button
          className="titlebar-cmdk"
          onClick={openCmdK}
          aria-label="Open command palette"
        >
          <span className="titlebar-cmdk-key">⌘K</span>
          <span className="titlebar-cmdk-label">jump to anywhere</span>
        </button>
        <Link
          href="/settings/"
          className="titlebar-avatar"
          aria-label="Settings"
        >
          <img src={AVATAR} alt="Adam" width={28} height={30} />
        </Link>
      </div>
    </div>
  );
}
