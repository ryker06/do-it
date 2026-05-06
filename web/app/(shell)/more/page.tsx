"use client";

import Link from "next/link";
import { Topbar } from "@/components/Topbar";

type Tile = {
  href: string;
  label: string;
  emoji: string;
};

type Group = {
  id: string;
  name: string;
  tiles: Tile[];
};

const GROUPS: Group[] = [
  {
    id: "do",
    name: "do",
    tiles: [{ href: "/inbox", label: "inbox", emoji: "📥" }],
  },
  {
    id: "track",
    name: "track",
    tiles: [
      { href: "/habits", label: "habits", emoji: "⬛" },
      { href: "/workouts", label: "workouts", emoji: "🏋️" },
      { href: "/health", label: "health", emoji: "💧" },
      { href: "/state", label: "state", emoji: "🌡" },
    ],
  },
  {
    id: "know",
    name: "know",
    tiles: [
      { href: "/visions", label: "visions", emoji: "🔭" },
      { href: "/goals", label: "goals", emoji: "🎯" },
      { href: "/insights", label: "insights", emoji: "💡" },
      { href: "/jar", label: "cookie jar", emoji: "🍪" },
      { href: "/knowledge", label: "knowledge", emoji: "📊" },
    ],
  },
  {
    id: "life",
    name: "life",
    tiles: [
      { href: "/people", label: "people", emoji: "🤝" },
      { href: "/money", label: "money", emoji: "💸" },
      { href: "/wishlist", label: "wishlist", emoji: "✨" },
    ],
  },
  {
    id: "tend",
    name: "tend",
    tiles: [
      { href: "/domains", label: "domains", emoji: "🗺" },
      { href: "/routines", label: "routines", emoji: "🔄" },
      { href: "/reflect", label: "reflect", emoji: "🌙" },
      { href: "/review", label: "review", emoji: "📋" },
    ],
  },
  {
    id: "home",
    name: "home",
    tiles: [
      { href: "/yesterday", label: "yesterday", emoji: "◀" },
      { href: "/settings", label: "settings", emoji: "⚙️" },
    ],
  },
];

export default function MorePage() {
  return (
    <div className="shell-content">
      <Topbar name="more." sub="every surface." />

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {GROUPS.map((group) => (
          <div key={group.id}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--label)",
                marginBottom: 8,
                paddingLeft: 2,
              }}
            >
              {group.name}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 8,
              }}
            >
              {group.tiles.map((tile) => (
                <Link
                  key={tile.href}
                  href={tile.href}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 6,
                    padding: "12px 12px 11px",
                    borderRadius: 16,
                    background: "var(--card)",
                    boxShadow: "var(--shadow-stack)",
                    textDecoration: "none",
                  }}
                >
                  <span style={{ fontSize: 20, lineHeight: 1 }}>
                    {tile.emoji}
                  </span>
                  <span
                    style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: "var(--ink)",
                      letterSpacing: "-0.015em",
                      lineHeight: 1.2,
                    }}
                  >
                    {tile.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
