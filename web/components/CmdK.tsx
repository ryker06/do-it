"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDoIt } from "@/lib/store";

type Cmd = {
  id: string;
  label: string;
  sub?: string;
  action: () => void;
};

export function CmdK() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
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
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  const todayISO = new Date().toISOString().slice(0, 10);

  const COMMANDS: Cmd[] = [
    {
      id: "now",
      label: "start now",
      sub: "jump to the current block",
      action: () => {
        router.push("/now");
        close();
      },
    },
    {
      id: "today",
      label: "open today",
      sub: "see today's full plan",
      action: () => {
        router.push("/today");
        close();
      },
    },
    {
      id: "habits",
      label: "open habits",
      sub: "mark today's habits",
      action: () => {
        router.push("/habits");
        close();
      },
    },
    {
      id: "workouts",
      label: "open workouts",
      sub: "log a set",
      action: () => {
        router.push("/workouts");
        close();
      },
    },
    {
      id: "health",
      label: "open health",
      sub: "log sleep · water · body",
      action: () => {
        router.push("/health");
        close();
      },
    },
    {
      id: "jar",
      label: "open cookie jar",
      sub: "proof you've done hard things",
      action: () => {
        router.push("/jar");
        close();
      },
    },
    {
      id: "reflect",
      label: "reflect",
      sub: "close today",
      action: () => {
        router.push("/reflect");
        close();
      },
    },
    {
      id: "goals",
      label: "open goals",
      sub: "track progress",
      action: () => {
        router.push("/goals");
        close();
      },
    },
    {
      id: "visions",
      label: "open visions",
      sub: "what you're building toward",
      action: () => {
        router.push("/visions");
        close();
      },
    },
    {
      id: "knowledge",
      label: "open knowledge",
      sub: "heatmap of what you've absorbed",
      action: () => {
        router.push("/knowledge");
        close();
      },
    },
    {
      id: "insights",
      label: "open insights",
      sub: "captured lessons",
      action: () => {
        router.push("/insights");
        close();
      },
    },
    {
      id: "domains",
      label: "open domains",
      sub: "life areas and momentum",
      action: () => {
        router.push("/domains");
        close();
      },
    },
    {
      id: "people",
      label: "open people",
      sub: "relationship surface",
      action: () => {
        router.push("/people");
        close();
      },
    },
    {
      id: "money",
      label: "open money",
      sub: "expenses and income",
      action: () => {
        router.push("/money");
        close();
      },
    },
    {
      id: "wishlist",
      label: "open wishlist",
      sub: "things you want",
      action: () => {
        router.push("/wishlist");
        close();
      },
    },
    {
      id: "routines",
      label: "open routines",
      sub: "daily and weekly rhythms",
      action: () => {
        router.push("/routines");
        close();
      },
    },
    {
      id: "settings",
      label: "open settings",
      sub: "preferences",
      action: () => {
        router.push("/settings");
        close();
      },
    },
    // quick-log actions
    {
      id: "log-sleep",
      label: "log sleep",
      sub: "enter hours slept",
      action: () => {
        const h = prompt("hours slept?");
        if (!h) return;
        const n = parseFloat(h);
        if (!isNaN(n)) logSleep({ dateISO: todayISO, hoursSlept: n });
        close();
      },
    },
    {
      id: "log-weight",
      label: "log weight",
      sub: "enter weight in kg",
      action: () => {
        const w = prompt("weight (kg)?");
        if (!w) return;
        const n = parseFloat(w);
        if (!isNaN(n)) logBody({ dateISO: todayISO, weightKg: n });
        close();
      },
    },
    {
      id: "add-jar",
      label: "add to cookie jar",
      sub: "one line — what did you finish?",
      action: () => {
        const text = prompt("what did you finish?");
        if (!text?.trim()) return;
        addJarEntry({ capturedAt: Date.now(), oneLine: text.trim() });
        close();
      },
    },
    {
      id: "add-habit",
      label: "add habit",
      sub: "name a new habit",
      action: () => {
        const name = prompt("habit name?");
        if (!name?.trim()) return;
        addHabit({ name: name.trim() });
        close();
      },
    },
  ];

  const filtered = query.trim()
    ? COMMANDS.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          (c.sub ?? "").toLowerCase().includes(query.toLowerCase()),
      )
    : COMMANDS;

  if (!open) return null;

  return (
    <div
      onClick={close}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.48)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "18vh",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(480px, calc(100vw - 32px))",
          background: "var(--card)",
          borderRadius: 20,
          boxShadow:
            "0 0 0 0.5px rgba(0,0,0,0.10), 0 24px 64px -12px rgba(0,0,0,0.32)",
          overflow: "hidden",
        }}
      >
        {/* Search input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "14px 16px",
            borderBottom: "0.5px solid var(--hairline-2)",
            gap: 10,
          }}
        >
          <svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            style={{ flexShrink: 0, opacity: 0.35 }}
          >
            <circle cx={7} cy={7} r={5} stroke="var(--ink)" strokeWidth={1.5} />
            <path
              d="M11 11l3 3"
              stroke="var(--ink)"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="jump to · log · add…"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: 15,
              fontWeight: 500,
              color: "var(--ink)",
              fontFamily: "inherit",
              letterSpacing: "-0.012em",
            }}
          />
          <kbd
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--label)",
              background: "var(--inset)",
              borderRadius: 6,
              padding: "3px 6px",
              fontFamily: "inherit",
              boxShadow: "inset 0 0 0 0.5px var(--hairline-2)",
            }}
          >
            esc
          </kbd>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 360, overflowY: "auto", padding: "8px 0" }}>
          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "24px 0",
                fontSize: 14,
                color: "var(--label)",
                fontWeight: 500,
              }}
            >
              no match.
            </div>
          ) : (
            filtered.map((cmd) => (
              <button
                key={cmd.id}
                onClick={cmd.action}
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 2,
                  padding: "10px 16px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "var(--inset)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--ink)",
                    letterSpacing: "-0.018em",
                  }}
                >
                  {cmd.label}
                </span>
                {cmd.sub && (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "var(--label-2)",
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {cmd.sub}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
