"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDoIt } from "@/lib/store";

// ── types ─────────────────────────────────────────────────────────────────────
type VerbTag = "go" | "log" | "add" | "open";

type Cmd = {
  id: string;
  verb: VerbTag;
  label: string;
  sub?: string;
  action: () => void;
};

// ── verb tag pills ─────────────────────────────────────────────────────────────
const VERB_STYLE: Record<VerbTag, { bg: string; color: string }> = {
  go: { bg: "#C7F0CF", color: "#1F5C2C" },
  log: { bg: "#E2EEFF", color: "#0050C8" },
  add: { bg: "#FFE7EC", color: "#7A2A3C" },
  open: { bg: "#F4F5F7", color: "#3A3A3C" },
};

// ── recent command storage (session-only) ─────────────────────────────────────
const recentIds: string[] = [];
function recordRecent(id: string) {
  const idx = recentIds.indexOf(id);
  if (idx !== -1) recentIds.splice(idx, 1);
  recentIds.unshift(id);
  if (recentIds.length > 5) recentIds.length = 5;
}

// ── kbd key component ─────────────────────────────────────────────────────────
function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: "#8E8E93",
        background: "#F4F5F7",
        borderRadius: 6,
        padding: "3px 7px",
        fontFamily: "inherit",
        boxShadow:
          "0 0 0 0.5px rgba(60,60,67,0.10),0 1px 0 rgba(255,255,255,0.7) inset",
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      {children}
    </kbd>
  );
}

// ── main component ────────────────────────────────────────────────────────────
export function CmdK() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { addJarEntry, addHabit, logSleep, logBody } = useDoIt();

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 40);
  }, [open]);

  const todayISO = new Date().toISOString().slice(0, 10);

  function run(cmd: Cmd) {
    recordRecent(cmd.id);
    cmd.action();
  }

  const COMMANDS: Cmd[] = [
    // go — quick navigation
    {
      id: "go-now",
      verb: "go",
      label: "now",
      sub: "jump to current block",
      action: () => {
        router.push("/now");
        close();
      },
    },
    {
      id: "go-today",
      verb: "go",
      label: "today",
      sub: "see today's full plan",
      action: () => {
        router.push("/today");
        close();
      },
    },
    {
      id: "go-inbox",
      verb: "go",
      label: "inbox",
      sub: "unprocessed captures",
      action: () => {
        router.push("/inbox");
        close();
      },
    },
    // open — surfaces
    {
      id: "open-habits",
      verb: "open",
      label: "habits",
      sub: "mark today's habits",
      action: () => {
        router.push("/habits");
        close();
      },
    },
    {
      id: "open-workouts",
      verb: "open",
      label: "workouts",
      sub: "log a set",
      action: () => {
        router.push("/workouts");
        close();
      },
    },
    {
      id: "open-health",
      verb: "open",
      label: "health",
      sub: "sleep · water · body",
      action: () => {
        router.push("/health");
        close();
      },
    },
    {
      id: "open-jar",
      verb: "open",
      label: "cookie jar",
      sub: "proof you've done hard things",
      action: () => {
        router.push("/jar");
        close();
      },
    },
    {
      id: "open-reflect",
      verb: "open",
      label: "reflect",
      sub: "evening audit",
      action: () => {
        router.push("/reflect");
        close();
      },
    },
    {
      id: "open-goals",
      verb: "open",
      label: "goals",
      sub: "track progress",
      action: () => {
        router.push("/goals");
        close();
      },
    },
    {
      id: "open-visions",
      verb: "open",
      label: "visions",
      sub: "what you're building toward",
      action: () => {
        router.push("/visions");
        close();
      },
    },
    {
      id: "open-knowledge",
      verb: "open",
      label: "knowledge",
      sub: "heatmap of what you've absorbed",
      action: () => {
        router.push("/knowledge");
        close();
      },
    },
    {
      id: "open-insights",
      verb: "open",
      label: "insights",
      sub: "captured lessons",
      action: () => {
        router.push("/insights");
        close();
      },
    },
    {
      id: "open-domains",
      verb: "open",
      label: "domains",
      sub: "life areas · momentum",
      action: () => {
        router.push("/domains");
        close();
      },
    },
    {
      id: "open-people",
      verb: "open",
      label: "people",
      sub: "who you're building with",
      action: () => {
        router.push("/people");
        close();
      },
    },
    {
      id: "open-money",
      verb: "open",
      label: "money",
      sub: "in · out · subscriptions",
      action: () => {
        router.push("/money");
        close();
      },
    },
    {
      id: "open-wishlist",
      verb: "open",
      label: "wishlist",
      sub: "things you want",
      action: () => {
        router.push("/wishlist");
        close();
      },
    },
    {
      id: "open-routines",
      verb: "open",
      label: "routines",
      sub: "daily and weekly rhythms",
      action: () => {
        router.push("/routines");
        close();
      },
    },
    {
      id: "open-state",
      verb: "open",
      label: "state",
      sub: "how you're running today",
      action: () => {
        router.push("/state");
        close();
      },
    },
    {
      id: "open-settings",
      verb: "open",
      label: "settings",
      sub: "preferences",
      action: () => {
        router.push("/settings");
        close();
      },
    },
    // log — quick-log actions
    {
      id: "log-sleep",
      verb: "log",
      label: "sleep",
      sub: "enter hours slept",
      action: () => {
        const h = prompt("hours slept?");
        if (!h) return close();
        const n = parseFloat(h);
        if (!isNaN(n)) logSleep({ dateISO: todayISO, hoursSlept: n });
        close();
      },
    },
    {
      id: "log-weight",
      verb: "log",
      label: "weight",
      sub: "enter weight in kg",
      action: () => {
        const w = prompt("weight (kg)?");
        if (!w) return close();
        const n = parseFloat(w);
        if (!isNaN(n)) logBody({ dateISO: todayISO, weightKg: n });
        close();
      },
    },
    // add — create actions
    {
      id: "add-jar",
      verb: "add",
      label: "cookie jar entry",
      sub: "one line — what did you finish?",
      action: () => {
        const text = prompt("what did you finish?");
        if (!text?.trim()) return close();
        addJarEntry({ capturedAt: Date.now(), oneLine: text.trim() });
        close();
      },
    },
    {
      id: "add-habit",
      verb: "add",
      label: "habit",
      sub: "name a new habit",
      action: () => {
        const name = prompt("habit name?");
        if (!name?.trim()) return close();
        addHabit({ name: name.trim() });
        close();
      },
    },
  ];

  const q = query.trim().toLowerCase();
  const filtered = q
    ? COMMANDS.filter(
        (c) =>
          c.label.toLowerCase().includes(q) ||
          c.verb.toLowerCase().includes(q) ||
          (c.sub ?? "").toLowerCase().includes(q),
      )
    : COMMANDS;

  // Recent commands section (only when no query)
  const recentCmds = !q
    ? (recentIds
        .map((id) => COMMANDS.find((c) => c.id === id))
        .filter(Boolean) as Cmd[])
    : [];

  if (!open) return null;

  return (
    <div
      onClick={close}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(11,11,15,0.48)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "16vh",
        backdropFilter: "blur(12px) saturate(130%)",
        WebkitBackdropFilter: "blur(12px) saturate(130%)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(500px, calc(100vw - 32px))",
          background: "#FFFFFF",
          borderRadius: 22,
          boxShadow:
            "0 0 0 0.5px rgba(60,60,67,0.08),0 4px 8px rgba(20,20,30,0.06),0 24px 64px -12px rgba(11,11,15,0.32)",
          overflow: "hidden",
        }}
      >
        {/* search bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "14px 16px",
            borderBottom: "0.5px solid rgba(60,60,67,0.08)",
            gap: 10,
          }}
        >
          {/* search icon */}
          <svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            style={{ flexShrink: 0, opacity: 0.35 }}
          >
            <circle cx={7} cy={7} r={5} stroke="#0B0B0F" strokeWidth={1.5} />
            <path
              d="M11 11l3 3"
              stroke="#0B0B0F"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          </svg>

          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="do anything."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: 15,
              fontWeight: 500,
              color: "#0B0B0F",
              fontFamily: "inherit",
              letterSpacing: "-0.012em",
            }}
          />

          {/* keycap hints */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              flexShrink: 0,
            }}
          >
            <Kbd>⌘K</Kbd>
            <Kbd>esc</Kbd>
          </div>
        </div>

        {/* results list */}
        <div style={{ maxHeight: 380, overflowY: "auto", padding: "8px 0" }}>
          {/* recent section — only when no query and recents exist */}
          {recentCmds.length > 0 && (
            <>
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#8E8E93",
                  padding: "6px 16px 4px",
                }}
              >
                recent
              </div>
              {recentCmds.map((cmd) => (
                <CmdRow
                  key={`recent-${cmd.id}`}
                  cmd={cmd}
                  isHovered={hoveredId === `recent-${cmd.id}`}
                  onHover={(v) => setHoveredId(v ? `recent-${cmd.id}` : null)}
                  onRun={() => run(cmd)}
                />
              ))}
              <div
                style={{
                  height: 1,
                  background: "rgba(60,60,67,0.06)",
                  margin: "6px 0",
                }}
              />
            </>
          )}

          {/* all commands / filtered */}
          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "24px 0",
                fontSize: 14,
                color: "#8E8E93",
                fontWeight: 500,
                letterSpacing: "-0.01em",
              }}
            >
              no match.
            </div>
          ) : (
            filtered.map((cmd) => (
              <CmdRow
                key={cmd.id}
                cmd={cmd}
                isHovered={hoveredId === cmd.id}
                onHover={(v) => setHoveredId(v ? cmd.id : null)}
                onRun={() => run(cmd)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ── command row ───────────────────────────────────────────────────────────────
function CmdRow({
  cmd,
  isHovered,
  onHover,
  onRun,
}: {
  cmd: Cmd;
  isHovered: boolean;
  onHover: (v: boolean) => void;
  onRun: () => void;
}) {
  const vs = VERB_STYLE[cmd.verb];

  return (
    <button
      onClick={onRun}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 16px",
        background: isHovered ? "#F4F5F7" : "transparent",
        border: "none",
        cursor: "pointer",
        fontFamily: "inherit",
        textAlign: "left",
      }}
    >
      {/* verb tag pill */}
      <span
        style={{
          flexShrink: 0,
          fontSize: 9.5,
          fontWeight: 800,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          padding: "3px 7px",
          borderRadius: 6,
          background: vs.bg,
          color: vs.color,
          lineHeight: 1,
          minWidth: 32,
          textAlign: "center",
        }}
      >
        {cmd.verb}
      </span>

      {/* label + sub */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#0B0B0F",
            letterSpacing: "-0.018em",
            lineHeight: 1.2,
          }}
        >
          {cmd.label}
        </div>
        {cmd.sub && (
          <div
            style={{
              fontSize: 11.5,
              fontWeight: 500,
              color: "#6E6E73",
              letterSpacing: "-0.005em",
              marginTop: 1,
            }}
          >
            {cmd.sub}
          </div>
        )}
      </div>

      {/* enter hint on hover */}
      {isHovered && <Kbd>↵</Kbd>}
    </button>
  );
}
