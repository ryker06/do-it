"use client";

import Link from "next/link";
import { Topbar } from "@/components/Topbar";

// Dimensional glyph component
function Glyph({
  children,
  tint,
}: {
  children: React.ReactNode;
  tint?: "blue" | "pink" | "green" | "amber";
}) {
  const tintStyles: Record<string, { bg: string; svgColor: string }> = {
    blue: {
      bg: "linear-gradient(180deg,#FFFFFF 0%,#E2EEFF 100%)",
      svgColor: "#1748A8",
    },
    pink: {
      bg: "linear-gradient(180deg,#FFFFFF 0%,#FFE7EC 100%)",
      svgColor: "#7A2A3C",
    },
    green: {
      bg: "linear-gradient(180deg,#FFFFFF 0%,#E2F4E6 100%)",
      svgColor: "#1F5C2C",
    },
    amber: {
      bg: "linear-gradient(180deg,#FFFFFF 0%,#FFF0DD 100%)",
      svgColor: "#7A4A1A",
    },
  };

  const t = tint ? tintStyles[tint] : null;

  return (
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: 11,
        background: t
          ? t.bg
          : "linear-gradient(180deg,#FFFFFF 0%,#F0EFEC 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.85),inset 0 -1px 0 rgba(20,20,30,0.06),0 1px 1.5px rgba(20,20,30,0.06),0 4px 8px -4px rgba(20,20,30,0.10)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "auto",
        marginTop: 6,
        flexShrink: 0,
        color: t ? t.svgColor : "#0B0B0F",
      }}
    >
      {children}
    </div>
  );
}

type TileData = {
  href: string;
  label: string;
  tint?: "blue" | "pink" | "green" | "amber";
  badge?: boolean;
  disabled?: boolean;
  glyph: React.ReactNode;
};

type GroupData = {
  id: string;
  name: string;
  cols: number;
  tiles: TileData[];
};

const sz = 20;
const sw = 1.7;

const GROUPS: GroupData[] = [
  {
    id: "do",
    name: "do",
    cols: 3,
    tiles: [
      {
        href: "/inbox",
        label: "inbox",
        badge: true,
        glyph: (
          <svg
            viewBox="0 0 24 24"
            width={sz}
            height={sz}
            stroke="currentColor"
            strokeWidth={sw}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 6h16M4 12h16M4 18h10" />
          </svg>
        ),
      },
      {
        href: "/routines",
        label: "templates",
        disabled: true,
        glyph: (
          <svg
            viewBox="0 0 24 24"
            width={sz}
            height={sz}
            stroke="currentColor"
            strokeWidth={sw}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="4" y="4" width="16" height="16" rx="3" />
            <path d="M8 9h8M8 13h6" />
          </svg>
        ),
      },
      {
        href: "#",
        label: "cmd+k",
        glyph: (
          <svg
            viewBox="0 0 24 24"
            width={sz}
            height={sz}
            stroke="currentColor"
            strokeWidth={sw}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 7l3-3 8 8-3 3z" />
            <path d="M14 4l3 3" />
            <path d="M5 19h6" />
          </svg>
        ),
      },
    ],
  },
  {
    id: "track",
    name: "track",
    cols: 4,
    tiles: [
      {
        href: "/habits",
        label: "habits",
        glyph: (
          <svg
            viewBox="0 0 24 24"
            width={sz}
            height={sz}
            stroke="currentColor"
            strokeWidth={sw}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5l3 2" />
          </svg>
        ),
      },
      {
        href: "/workouts",
        label: "workouts",
        glyph: (
          <svg
            viewBox="0 0 24 24"
            width={sz}
            height={sz}
            stroke="currentColor"
            strokeWidth={sw}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12h18" />
            <path d="M6 8v8" />
            <path d="M18 8v8" />
            <path d="M2 10v4" />
            <path d="M22 10v4" />
          </svg>
        ),
      },
      {
        href: "/health",
        label: "health",
        glyph: (
          <svg
            viewBox="0 0 24 24"
            width={sz}
            height={sz}
            stroke="currentColor"
            strokeWidth={sw}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 21s-7-5-7-11a5 5 0 0 1 10-1 5 5 0 0 1 10 1c-1 6-7 11-7 11z" />
          </svg>
        ),
      },
      {
        href: "/state",
        label: "state",
        glyph: (
          <svg
            viewBox="0 0 24 24"
            width={sz}
            height={sz}
            stroke="currentColor"
            strokeWidth={sw}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 14l4-4 4 3 6-7 4 5" />
            <path d="M3 20h18" />
          </svg>
        ),
      },
    ],
  },
  {
    id: "know",
    name: "know",
    cols: 4,
    tiles: [
      {
        href: "/goals",
        label: "goals",
        tint: "blue",
        glyph: (
          <svg
            viewBox="0 0 24 24"
            width={sz}
            height={sz}
            stroke="currentColor"
            strokeWidth={sw}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="12" cy="12" r="1.2" fill="currentColor" />
          </svg>
        ),
      },
      {
        href: "/insights",
        label: "insights",
        tint: "pink",
        glyph: (
          <svg
            viewBox="0 0 24 24"
            width={sz}
            height={sz}
            stroke="currentColor"
            strokeWidth={sw}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 17l5-5 4 3 4-6 5 4" />
            <circle cx="8" cy="12" r="1.2" fill="currentColor" />
            <circle cx="12" cy="15" r="1.2" fill="currentColor" />
            <circle cx="16" cy="9" r="1.2" fill="currentColor" />
          </svg>
        ),
      },
      {
        href: "/jar",
        label: "cookies",
        tint: "amber",
        glyph: (
          <svg
            viewBox="0 0 24 24"
            width={sz}
            height={sz}
            stroke="currentColor"
            strokeWidth={sw}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 8c1-3 3-5 7-5s6 2 7 5" />
            <path d="M5 8a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4" />
            <path d="M7 12v7a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-7" />
          </svg>
        ),
      },
      {
        href: "/knowledge",
        label: "heatmap",
        tint: "green",
        glyph: (
          <svg
            viewBox="0 0 24 24"
            width={sz}
            height={sz}
            stroke="currentColor"
            strokeWidth={sw}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="6" height="6" rx="1" />
            <rect x="11" y="3" width="6" height="6" rx="1" />
            <rect x="3" y="11" width="6" height="6" rx="1" />
            <rect x="11" y="11" width="6" height="6" rx="1" />
          </svg>
        ),
      },
    ],
  },
  {
    id: "life",
    name: "life",
    cols: 4,
    tiles: [
      {
        href: "/people",
        label: "people",
        glyph: (
          <svg
            viewBox="0 0 24 24"
            width={sz}
            height={sz}
            stroke="currentColor"
            strokeWidth={sw}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="8" r="3" />
            <path d="M3 19c0-3 3-5 6-5s6 2 6 5" />
            <circle cx="17" cy="9" r="2.5" />
            <path d="M14 19c0-2 2-3.5 4-3.5" />
          </svg>
        ),
      },
      {
        href: "/money",
        label: "money",
        glyph: (
          <svg
            viewBox="0 0 24 24"
            width={sz}
            height={sz}
            stroke="currentColor"
            strokeWidth={sw}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M9 14c0 1 1.3 2 3 2s3-1 3-2-1-1.5-3-2-3-1-3-2 1-2 3-2 3 1 3 2" />
            <path d="M12 6v2M12 16v2" />
          </svg>
        ),
      },
      {
        href: "/wishlist",
        label: "wishlist",
        glyph: (
          <svg
            viewBox="0 0 24 24"
            width={sz}
            height={sz}
            stroke="currentColor"
            strokeWidth={sw}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 21s-7-4-7-11V6l7-3 7 3v4c0 7-7 11-7 11z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        ),
      },
      {
        href: "/meal",
        label: "meal",
        glyph: (
          <svg
            viewBox="0 0 24 24"
            width={sz}
            height={sz}
            stroke="currentColor"
            strokeWidth={sw}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 6v6a3 3 0 0 0 6 0V6" />
            <path d="M8 6V3" />
            <path d="M16 3v18" />
            <path d="M16 14a4 4 0 0 0 4-4V4" />
          </svg>
        ),
      },
    ],
  },
  {
    id: "tend",
    name: "tend",
    cols: 4,
    tiles: [
      {
        href: "/domains",
        label: "domains",
        glyph: (
          <svg
            viewBox="0 0 24 24"
            width={sz}
            height={sz}
            stroke="currentColor"
            strokeWidth={sw}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="6" cy="6" r="2" />
            <circle cx="18" cy="6" r="2" />
            <circle cx="6" cy="18" r="2" />
            <circle cx="18" cy="18" r="2" />
            <path d="M8 6h8M6 8v8M18 8v8M8 18h8" />
          </svg>
        ),
      },
      {
        href: "/routines",
        label: "routines",
        glyph: (
          <svg
            viewBox="0 0 24 24"
            width={sz}
            height={sz}
            stroke="currentColor"
            strokeWidth={sw}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 1 1-3-6.7" />
            <path d="M21 4v5h-5" />
          </svg>
        ),
      },
      {
        href: "/reflect",
        label: "reflect",
        glyph: (
          <svg
            viewBox="0 0 24 24"
            width={sz}
            height={sz}
            stroke="currentColor"
            strokeWidth={sw}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 4h12l3 3v13H5z" />
            <path d="M5 4v16" />
            <path d="M9 9h7M9 13h6" />
          </svg>
        ),
      },
      {
        href: "/review",
        label: "weekly",
        glyph: (
          <svg
            viewBox="0 0 24 24"
            width={sz}
            height={sz}
            stroke="currentColor"
            strokeWidth={sw}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M3 10h18" />
            <path d="M8 4v4" />
            <path d="M16 4v4" />
          </svg>
        ),
      },
    ],
  },
  {
    id: "home",
    name: "home",
    cols: 2,
    tiles: [
      {
        href: "/yesterday",
        label: "yesterday",
        glyph: (
          <svg
            viewBox="0 0 24 24"
            width={sz}
            height={sz}
            stroke="currentColor"
            strokeWidth={sw}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12h4l3-7 4 14 3-7h4" />
          </svg>
        ),
      },
      {
        href: "/settings",
        label: "settings",
        glyph: (
          <svg
            viewBox="0 0 24 24"
            width={sz}
            height={sz}
            stroke="currentColor"
            strokeWidth={sw}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.5-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.5 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.5-2-1.5c.1-.4.1-.8.1-1.2z" />
          </svg>
        ),
      },
    ],
  },
];

function GroupHeader({ name }: { name: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 10,
        margin: "18px 4px 12px",
      }}
    >
      <span
        style={{
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: "0.20em",
          textTransform: "uppercase",
          color: "#8E8E93",
        }}
      >
        {name}
      </span>
      <div
        style={{
          flex: 1,
          height: 0.5,
          background: "rgba(60,60,67,0.10)",
        }}
      />
    </div>
  );
}

function Tile({ tile }: { tile: TileData }) {
  const tileStyle: React.CSSProperties = {
    height: 96,
    background: tile.tint
      ? tile.tint === "blue"
        ? "linear-gradient(180deg,#EEF4FF 0%,#fff 80%)"
        : tile.tint === "pink"
          ? "linear-gradient(180deg,#FFF1F4 0%,#fff 80%)"
          : tile.tint === "green"
            ? "linear-gradient(180deg,#EFF8F1 0%,#fff 80%)"
            : "linear-gradient(180deg,#FFF6E6 0%,#fff 80%)"
      : "#fff",
    borderRadius: 16,
    padding: "10px 8px 9px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    boxShadow:
      "inset 0 0 0 0.5px rgba(60,60,67,0.10),0 1px 1.5px rgba(20,20,30,0.03)",
    position: "relative",
    cursor: tile.disabled ? "default" : "pointer",
    opacity: tile.disabled ? 0.45 : 1,
    textDecoration: "none",
    fontFamily: "inherit",
    border: "none",
  };

  const inner = (
    <>
      {tile.badge && (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#0B0B0F",
          }}
        />
      )}
      <Glyph tint={tile.tint}>{tile.glyph}</Glyph>
      <span
        style={{
          fontSize: 11.5,
          fontWeight: 600,
          color: "#1C1C1E",
          letterSpacing: "-0.005em",
          textAlign: "center",
          lineHeight: 1.1,
        }}
      >
        {tile.label}
      </span>
    </>
  );

  if (tile.disabled || tile.href === "#") {
    return <div style={tileStyle}>{inner}</div>;
  }

  return (
    <Link href={tile.href} style={tileStyle}>
      {inner}
    </Link>
  );
}

export default function MorePage() {
  return (
    <>
      <Topbar name="more." sub="22 surfaces · all here" />

      {/* Tip card */}
      <div
        style={{
          background: "linear-gradient(180deg,#F8F7F4 0%,#FFFFFF 100%)",
          borderRadius: 20,
          padding: "16px 18px",
          boxShadow:
            "0 0 0 0.5px rgba(60,60,67,0.06),0 1px 1px rgba(20,20,30,0.02),0 12px 28px -16px rgba(20,20,30,0.10),0 28px 50px -32px rgba(20,20,30,0.14)",
          marginBottom: 6,
          display: "flex",
          alignItems: "center",
          gap: 14,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Key cap */}
        <div
          style={{
            flexShrink: 0,
            width: 46,
            height: 46,
            borderRadius: 13,
            background: "linear-gradient(180deg,#FFFFFF 0%,#F0EFEC 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.85),inset 0 -1px 0 rgba(20,20,30,0.06),0 1px 1.5px rgba(20,20,30,0.06),0 4px 8px -4px rgba(20,20,30,0.10)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 15,
            color: "#0B0B0F",
            letterSpacing: "-0.02em",
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, lineHeight: 1 }}>
            ⌘
          </span>
          <span
            style={{ fontSize: 18, letterSpacing: "-0.02em", lineHeight: 1 }}
          >
            K
          </span>
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#8E8E93",
              marginBottom: 3,
            }}
          >
            this week
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#0B0B0F",
              letterSpacing: "-0.012em",
              lineHeight: 1.25,
            }}
          >
            ⌘K to capture from anywhere.
          </div>
          <div
            style={{
              fontSize: 11.5,
              color: "#6E6E73",
              fontWeight: 500,
              marginTop: 2,
            }}
          >
            voice or text · sorts itself overnight.
          </div>
        </div>
      </div>

      {/* Groups */}
      {GROUPS.map((group) => (
        <div key={group.id}>
          <GroupHeader name={group.name} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${group.cols}, 1fr)`,
              gap: 8,
              marginBottom: 6,
            }}
          >
            {group.tiles.map((tile) => (
              <Tile key={tile.href + tile.label} tile={tile} />
            ))}
          </div>
        </div>
      ))}

      <div style={{ height: 110 }} />
    </>
  );
}
