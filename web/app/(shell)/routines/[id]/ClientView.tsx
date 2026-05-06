"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDoIt } from "@/lib/store";
import { DomainGlyph } from "@/components/icons";
import type {
  DomainId,
  RoutineBlock,
  RoutineCadence,
  Weekday,
} from "@/lib/types";

const WEEKDAY_KEYS: Weekday[] = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];
const WEEKDAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];

const DOMAIN_BG: Record<DomainId, string> = {
  business: "linear-gradient(180deg,#E1ECFF 0%, #C9DBFF 100%)",
  religion: "linear-gradient(180deg,#E2F4E6 0%, #C0E5C8 100%)",
  learning: "linear-gradient(180deg,#FFE3EB 0%, #FFCFDC 100%)",
  fitness: "linear-gradient(180deg,#FFD0DA 0%, #FFB6C5 100%)",
  home: "linear-gradient(180deg,#E5ECF0 0%, #CFDCE3 100%)",
  food: "linear-gradient(180deg,#FFF3E0 0%, #FFE0B2 100%)",
};

const DOMAIN_NAMES: Record<DomainId, string> = {
  business: "Business",
  religion: "Religion",
  learning: "Learning",
  fitness: "Fitness",
  home: "Home",
  food: "Food",
};

function fmtDuration(totalMin: number): string {
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function ClientView({ id }: { id: string }) {
  const router = useRouter();
  const { routines, createRoutine, updateRoutine } = useDoIt();

  const routineId = id;
  const isNew = routineId === "new";

  const existing = routines.find((r) => r.id === routineId);

  const [name, setName] = useState(existing?.name ?? "New routine");
  const [identity, setIdentity] = useState(existing?.identity ?? "");
  const [days, setDays] = useState<Weekday[]>(existing?.days ?? []);
  const [blocks, setBlocks] = useState<RoutineBlock[]>(existing?.blocks ?? []);
  const [cadenceKind, setCadenceKind] = useState<RoutineCadence["kind"]>(
    existing?.cadence?.kind ?? "weekly",
  );
  const [cadenceDays, setCadenceDays] = useState<Weekday[]>(
    existing?.cadence && "days" in existing.cadence
      ? (existing.cadence.days as Weekday[])
      : [],
  );
  const [cadenceWeeks, setCadenceWeeks] = useState<(1 | 2 | 3 | 4 | 5)[]>(
    existing?.cadence?.kind === "monthlyWeeks"
      ? existing.cadence.weeks
      : [1, 3],
  );
  const [cadenceMonthDays, setCadenceMonthDays] = useState<number[]>(
    existing?.cadence?.kind === "monthlyDays" ? existing.cadence.days : [1, 15],
  );
  const [cadenceInterval, setCadenceInterval] = useState<number>(
    existing?.cadence?.kind === "interval" ? existing.cadence.everyDays : 3,
  );
  const [anchorWeek, setAnchorWeek] = useState<"A" | "B">(
    existing?.cadence?.kind === "biweekly" ? existing.cadence.anchorWeek : "A",
  );

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setIdentity(existing.identity ?? "");
      setDays(existing.days);
      setBlocks(existing.blocks);
      if (existing.cadence) {
        setCadenceKind(existing.cadence.kind);
        if ("days" in existing.cadence)
          setCadenceDays(existing.cadence.days as Weekday[]);
        if (existing.cadence.kind === "monthlyWeeks")
          setCadenceWeeks(existing.cadence.weeks);
        if (existing.cadence.kind === "monthlyDays")
          setCadenceMonthDays(existing.cadence.days);
        if (existing.cadence.kind === "interval")
          setCadenceInterval(existing.cadence.everyDays);
        if (existing.cadence.kind === "biweekly")
          setAnchorWeek(existing.cadence.anchorWeek);
      }
    }
  }, [existing]);

  // Not-found guard: slug is not "new" and doesn't match any existing routine
  if (!isNew && !existing) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 12,
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "var(--label,#8E8E93)",
          }}
        >
          Routine not found
        </div>
        <button
          onClick={() => router.push("/routines")}
          style={{
            fontSize: 14,
            color: "var(--blue,#007AFF)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Back to Routines
        </button>
      </div>
    );
  }

  function toggleDay(day: Weekday) {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  }

  function removeBlock(blockId: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
  }

  function buildCadence(): RoutineCadence {
    switch (cadenceKind) {
      case "weekly":
        return { kind: "weekly", days: cadenceDays };
      case "biweekly":
        return { kind: "biweekly", days: cadenceDays, anchorWeek };
      case "monthlyWeeks":
        return { kind: "monthlyWeeks", weeks: cadenceWeeks, days: cadenceDays };
      case "monthlyDays":
        return { kind: "monthlyDays", days: cadenceMonthDays };
      case "interval":
        return {
          kind: "interval",
          everyDays: cadenceInterval,
          from: new Date().toISOString().slice(0, 10),
        };
    }
  }

  function cadencePlainEnglish(): string {
    switch (cadenceKind) {
      case "weekly":
        return cadenceDays.length === 0
          ? "no days set"
          : `every ${cadenceDays.join(", ").toLowerCase()}`;
      case "biweekly":
        return `every other week (${anchorWeek === "A" ? "odd" : "even"} weeks) · ${cadenceDays.join(", ").toLowerCase()}`;
      case "monthlyWeeks": {
        const wk = cadenceWeeks.map((w) => `week ${w}`).join(", ");
        return `${wk} of month · ${cadenceDays.join(", ").toLowerCase()}`;
      }
      case "monthlyDays":
        return `${cadenceMonthDays.map((d) => `${d}${ordinal(d)}`).join(", ")} of each month`;
      case "interval":
        return `every ${cadenceInterval} day${cadenceInterval !== 1 ? "s" : ""}`;
    }
  }

  function ordinal(n: number): string {
    if (n % 100 >= 11 && n % 100 <= 13) return "th";
    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  function save() {
    const cadence = buildCadence();
    const cadenceDescription = cadencePlainEnglish();
    if (isNew) {
      createRoutine({
        name,
        days: cadenceDays,
        blocks,
        identity: identity || undefined,
        cadence,
        cadenceDescription,
      });
    } else if (existing) {
      updateRoutine(existing.id, {
        name,
        days: cadenceDays,
        blocks,
        identity: identity || undefined,
        cadence,
        cadenceDescription,
      });
    }
    router.back();
  }

  const totalMin = blocks.reduce((s, b) => s + b.durationMin, 0);

  const daysLabel = (() => {
    if (days.length === 0) return "no days";
    if (days.length === 7) return "every day";
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    if (days.length === 5 && weekdays.every((d) => days.includes(d as Weekday)))
      return "5 days · weekdays";
    if (days.length === 2 && days.includes("Sat") && days.includes("Sun"))
      return "2 days · weekend";
    return `${days.length} day${days.length !== 1 ? "s" : ""}`;
  })();

  return (
    <div
      style={{
        position: "relative",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* topbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 2px",
          marginBottom: 14,
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "var(--blue,#007AFF)",
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "-0.018em",
            padding: "6px 6px 6px 2px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <svg
            viewBox="0 0 11 18"
            width={11}
            height={18}
            fill="none"
            stroke="var(--blue,#007AFF)"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 1L2 9l7 8" />
          </svg>
          Routines
        </button>
        <div
          style={{
            fontSize: 11.5,
            fontWeight: 700,
            color: "var(--label,#8E8E93)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          Editing routine
        </div>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "var(--inset,#F2F2F7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow:
              "inset 0 0 0 0.5px var(--hairline-2,rgba(60,60,67,0.06))",
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
            <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" />
          </svg>
        </div>
      </div>

      {/* scroll body */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "2px 2px 130px",
          margin: "0 -2px",
          WebkitMaskImage:
            "linear-gradient(180deg, #000 0%, #000 92%, transparent 100%)",
          maskImage:
            "linear-gradient(180deg, #000 0%, #000 92%, transparent 100%)",
        }}
      >
        {/* name field */}
        <div style={{ padding: "6px 4px 4px", marginBottom: 4 }}>
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: "var(--label,#8E8E93)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Routine name
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 26,
              fontWeight: 700,
              color: "var(--ink,#000)",
              letterSpacing: "-0.034em",
              lineHeight: 1.05,
              padding: "2px 0 6px",
              borderBottom:
                "1px dashed var(--hairline-strong,rgba(60,60,67,0.18))",
            }}
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                font: "inherit",
                fontSize: 26,
                fontWeight: 700,
                color: "var(--ink,#000)",
                letterSpacing: "-0.034em",
              }}
            />
            <span
              style={{
                width: 16,
                height: 16,
                color: "var(--label,#8E8E93)",
                flexShrink: 0,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width={16}
                height={16}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 20h4l10-10-4-4L4 16v4z" />
                <path d="M14 6l4 4" />
              </svg>
            </span>
          </div>
        </div>

        {/* days card */}
        <div
          style={{
            margin: "18px 4px 6px",
            padding: "14px 14px 12px",
            background: "var(--card,#fff)",
            borderRadius: 18,
            boxShadow:
              "0 0 0 0.5px rgba(60,60,67,0.05), 0 1px 1px rgba(20,20,30,0.02), 0 6px 16px -12px rgba(20,20,30,0.10)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 18,
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 0.5px rgba(60,60,67,0.05)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: "var(--label,#8E8E93)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Runs on
            </span>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: "var(--label-2,#6E6E73)",
                letterSpacing: "-0.005em",
              }}
            >
              {daysLabel}
            </span>
          </div>
          <div
            style={{ display: "flex", justifyContent: "space-between", gap: 6 }}
          >
            {WEEKDAY_KEYS.map((key, i) => {
              const on = days.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => toggleDay(key)}
                  style={{
                    flex: 1,
                    height: 36,
                    borderRadius: 11,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: on ? "#fff" : "var(--label-2,#6E6E73)",
                    letterSpacing: "0.04em",
                    background: on ? "#0A0A0F" : "var(--inset,#F2F2F7)",
                    boxShadow: on
                      ? "inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 2px rgba(20,20,30,0.16), 0 4px 10px -6px rgba(20,20,30,0.30)"
                      : "inset 0 0 0 0.5px var(--hairline-2,rgba(60,60,67,0.06))",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {WEEKDAY_LETTERS[i]}
                </button>
              );
            })}
          </div>
        </div>

        {/* identity field */}
        <div
          style={{
            margin: "14px 4px 6px",
            padding: "14px 14px 12px",
            background: "var(--card,#fff)",
            borderRadius: 18,
            boxShadow:
              "0 0 0 0.5px rgba(60,60,67,0.05), 0 1px 1px rgba(20,20,30,0.02), 0 6px 16px -12px rgba(20,20,30,0.10)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 18,
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 0.5px rgba(60,60,67,0.05)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: "var(--label,#8E8E93)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Identity line
          </div>
          <input
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
            placeholder="i'm someone who trains daily."
            style={{
              width: "100%",
              background: "var(--inset,#F2F2F7)",
              border: "none",
              borderRadius: 12,
              padding: "10px 12px",
              fontSize: 14,
              fontWeight: 500,
              fontStyle: identity ? "italic" : "normal",
              color: "var(--ink,#000)",
              fontFamily: "inherit",
              letterSpacing: "-0.012em",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* cadence builder */}
        <div
          style={{
            margin: "14px 4px 6px",
            padding: "14px 14px 12px",
            background: "var(--card,#fff)",
            borderRadius: 18,
            boxShadow:
              "0 0 0 0.5px rgba(60,60,67,0.05), 0 1px 1px rgba(20,20,30,0.02), 0 6px 16px -12px rgba(20,20,30,0.10)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 18,
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 0.5px rgba(60,60,67,0.05)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: "var(--label,#8E8E93)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Cadence
          </div>

          {/* kind selector */}
          <select
            value={cadenceKind}
            onChange={(e) =>
              setCadenceKind(e.target.value as RoutineCadence["kind"])
            }
            style={{
              width: "100%",
              background: "var(--inset,#F2F2F7)",
              border: "none",
              borderRadius: 12,
              padding: "10px 12px",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--ink,#000)",
              fontFamily: "inherit",
              cursor: "pointer",
              outline: "none",
              marginBottom: 12,
              boxSizing: "border-box",
            }}
          >
            <option value="weekly">Every week</option>
            <option value="biweekly">Alternating weeks</option>
            <option value="monthlyWeeks">Specific weeks of month</option>
            <option value="monthlyDays">Specific days of month</option>
            <option value="interval">Every N days</option>
          </select>

          {/* per-kind config */}
          {(cadenceKind === "weekly" ||
            cadenceKind === "biweekly" ||
            cadenceKind === "monthlyWeeks") && (
            <div style={{ marginBottom: 12 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--label,#8E8E93)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Days
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {WEEKDAY_KEYS.map((key, i) => {
                  const on = cadenceDays.includes(key);
                  return (
                    <button
                      key={key}
                      onClick={() =>
                        setCadenceDays((prev) =>
                          prev.includes(key)
                            ? prev.filter((d) => d !== key)
                            : [...prev, key],
                        )
                      }
                      style={{
                        flex: 1,
                        height: 34,
                        borderRadius: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 700,
                        color: on ? "#fff" : "var(--label-2,#6E6E73)",
                        background: on ? "#0A0A0F" : "var(--inset,#F2F2F7)",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: on
                          ? "none"
                          : "inset 0 0 0 0.5px rgba(60,60,67,0.08)",
                      }}
                    >
                      {WEEKDAY_LETTERS[i]}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {cadenceKind === "biweekly" && (
            <div style={{ marginBottom: 12 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--label,#8E8E93)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Week pattern
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {(["A", "B"] as const).map((w) => (
                  <button
                    key={w}
                    onClick={() => setAnchorWeek(w)}
                    style={{
                      flex: 1,
                      height: 36,
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 700,
                      color:
                        anchorWeek === w ? "#fff" : "var(--label-2,#6E6E73)",
                      background:
                        anchorWeek === w ? "#0A0A0F" : "var(--inset,#F2F2F7)",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {w === "A" ? "Odd weeks" : "Even weeks"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {cadenceKind === "monthlyWeeks" && (
            <div style={{ marginBottom: 12 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--label,#8E8E93)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Which weeks of the month
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {([1, 2, 3, 4, 5] as const).map((w) => {
                  const on = cadenceWeeks.includes(w);
                  return (
                    <button
                      key={w}
                      onClick={() =>
                        setCadenceWeeks((prev) =>
                          prev.includes(w)
                            ? prev.filter((x) => x !== w)
                            : [...prev, w],
                        )
                      }
                      style={{
                        flex: 1,
                        height: 36,
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 700,
                        color: on ? "#fff" : "var(--label-2,#6E6E73)",
                        background: on ? "#0A0A0F" : "var(--inset,#F2F2F7)",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {w}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {cadenceKind === "monthlyDays" && (
            <div style={{ marginBottom: 12 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--label,#8E8E93)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Day numbers (comma-separated)
              </div>
              <input
                type="text"
                value={cadenceMonthDays.join(", ")}
                onChange={(e) => {
                  const nums = e.target.value
                    .split(",")
                    .map((s) => parseInt(s.trim(), 10))
                    .filter((n) => !isNaN(n) && n >= 1 && n <= 31);
                  setCadenceMonthDays(nums);
                }}
                placeholder="1, 15"
                style={{
                  width: "100%",
                  background: "var(--inset,#F2F2F7)",
                  border: "none",
                  borderRadius: 12,
                  padding: "10px 12px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--ink,#000)",
                  fontFamily: "inherit",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          )}

          {cadenceKind === "interval" && (
            <div style={{ marginBottom: 12 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--label,#8E8E93)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Every how many days
              </div>
              <input
                type="number"
                min={1}
                max={90}
                value={cadenceInterval}
                onChange={(e) =>
                  setCadenceInterval(
                    Math.max(1, parseInt(e.target.value, 10) || 1),
                  )
                }
                style={{
                  width: "100%",
                  background: "var(--inset,#F2F2F7)",
                  border: "none",
                  borderRadius: 12,
                  padding: "10px 12px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--ink,#000)",
                  fontFamily: "inherit",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          )}

          {/* plain-English phrase */}
          <div
            style={{
              fontSize: 12.5,
              color: "var(--label-2,#6E6E73)",
              fontWeight: 600,
              fontStyle: "italic",
              letterSpacing: "-0.005em",
              lineHeight: 1.4,
              padding: "8px 10px",
              background: "var(--inset,#F2F2F7)",
              borderRadius: 10,
              boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.06)",
            }}
          >
            {cadencePlainEnglish()}
          </div>
        </div>

        {/* blocks eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 6px",
            margin: "22px 0 12px",
          }}
        >
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: "var(--label,#8E8E93)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Blocks
          </span>
          <span
            style={{
              flex: 1,
              height: 1,
              background: "var(--hairline-2,rgba(60,60,67,0.06))",
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: "var(--label-2,#6E6E73)",
              fontWeight: 600,
              letterSpacing: "-0.005em",
            }}
          >
            drag to reorder
          </span>
        </div>

        {/* block list */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            margin: "0 2px",
          }}
        >
          {blocks.map((b) => (
            <div
              key={b.id}
              style={{
                height: 64,
                background: "var(--card,#fff)",
                borderRadius: 18,
                padding: "0 12px 0 4px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                boxShadow:
                  "0 0 0 0.5px rgba(60,60,67,0.05), 0 1px 1px rgba(20,20,30,0.02), 0 6px 16px -12px rgba(20,20,30,0.10)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 18,
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 0.5px rgba(60,60,67,0.05)",
                  pointerEvents: "none",
                }}
              />
              {/* drag handle */}
              <div
                style={{
                  width: 26,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--label,#8E8E93)",
                  flexShrink: 0,
                  cursor: "grab",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width={14}
                  height={14}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ opacity: 0.55 }}
                >
                  <circle
                    cx="9"
                    cy="6"
                    r="1.1"
                    fill="currentColor"
                    stroke="none"
                  />
                  <circle
                    cx="15"
                    cy="6"
                    r="1.1"
                    fill="currentColor"
                    stroke="none"
                  />
                  <circle
                    cx="9"
                    cy="12"
                    r="1.1"
                    fill="currentColor"
                    stroke="none"
                  />
                  <circle
                    cx="15"
                    cy="12"
                    r="1.1"
                    fill="currentColor"
                    stroke="none"
                  />
                  <circle
                    cx="9"
                    cy="18"
                    r="1.1"
                    fill="currentColor"
                    stroke="none"
                  />
                  <circle
                    cx="15"
                    cy="18"
                    r="1.1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </div>
              {/* domain disc */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  background: DOMAIN_BG[b.domain],
                  boxShadow:
                    "inset 0 0 0 0.5px rgba(20,20,30,0.06), inset 0 -2px 4px rgba(20,20,30,0.04), 0 1px 2px rgba(20,20,30,0.04)",
                  color: "var(--glyph,#0A0A0F)",
                }}
              >
                <DomainGlyph id={b.domain} size={19} />
              </div>
              {/* body */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <div
                  style={{
                    fontSize: 14.5,
                    fontWeight: 500,
                    color: "var(--ink,#000)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.18,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {b.title}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 10.5,
                    fontWeight: 600,
                    color: "var(--label,#8E8E93)",
                  }}
                >
                  <span
                    style={{
                      color: "var(--label-2,#6E6E73)",
                      fontWeight: 700,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {DOMAIN_NAMES[b.domain]}
                  </span>
                </div>
              </div>
              {/* duration chip */}
              <button
                onClick={() => removeBlock(b.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--ink-2,#1C1C1E)",
                  letterSpacing: "-0.012em",
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: "var(--inset,#F2F2F7)",
                  boxShadow:
                    "inset 0 0 0 0.5px var(--hairline-2,rgba(60,60,67,0.06))",
                  flexShrink: 0,
                  fontVariantNumeric: "tabular-nums",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontWeight: 700 }}>{b.durationMin}</span>
                <span
                  style={{
                    color: "var(--label-2,#6E6E73)",
                    fontWeight: 600,
                    fontSize: 10.5,
                    marginLeft: 1,
                  }}
                >
                  min
                </span>
              </button>
            </div>
          ))}

          {/* add block row */}
          <div
            style={{
              height: 64,
              borderRadius: 18,
              border: "1px dashed var(--hairline-strong,rgba(60,60,67,0.18))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  "inset 0 0 0 0.5px var(--hairline-strong,rgba(60,60,67,0.18))",
                color: "var(--ink-2,#1C1C1E)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width={11}
                height={11}
                fill="none"
                stroke="currentColor"
                strokeWidth={2.4}
                strokeLinecap="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
            <span
              style={{
                fontSize: 13.5,
                fontWeight: 600,
                color: "var(--label-2,#6E6E73)",
                letterSpacing: "-0.012em",
              }}
            >
              Add block
            </span>
          </div>
        </div>
      </div>

      {/* floating total chip */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: 90,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "9px 14px 9px 11px",
          background: "rgba(255,255,255,0.90)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
          borderRadius: 999,
          boxShadow:
            "0 0 0 0.5px rgba(60,60,67,0.10), 0 1px 1px rgba(20,20,30,0.02), 0 12px 24px -12px rgba(20,20,30,0.20)",
          zIndex: 4,
          whiteSpace: "nowrap",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width={13}
          height={13}
          fill="none"
          stroke="var(--ink-2,#1C1C1E)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "var(--label,#8E8E93)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          Total
        </span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "var(--ink,#000)",
            letterSpacing: "-0.014em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {fmtDuration(totalMin)}
        </span>
        <span style={{ color: "rgba(60,60,67,0.25)" }}>·</span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--label-2,#6E6E73)",
            letterSpacing: "-0.014em",
          }}
        >
          {blocks.length} blocks
        </span>
      </div>

      {/* save bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 84,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "14px 20px 0",
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "saturate(200%) blur(28px)",
          WebkitBackdropFilter: "saturate(200%) blur(28px)",
          borderTop: "0.5px solid var(--hairline,rgba(60,60,67,0.10))",
          zIndex: 3,
        }}
      >
        <button
          onClick={save}
          style={{
            width: "100%",
            height: 50,
            borderRadius: 999,
            background: "linear-gradient(180deg,#1C1C1E 0%, #0A0A0F 100%)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "-0.018em",
            border: "none",
            cursor: "pointer",
            boxShadow:
              "0 0 0 0.5px rgba(0,0,0,0.30), 0 1px 0 rgba(255,255,255,0.08) inset, 0 10px 24px -10px rgba(20,20,30,0.45), 0 4px 10px -4px rgba(20,20,30,0.20)",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={13}
            height={13}
            fill="none"
            stroke="#fff"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12l4 4L19 6" />
          </svg>
          save routine
        </button>
      </div>
    </div>
  );
}
