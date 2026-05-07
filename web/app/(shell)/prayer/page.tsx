"use client";

import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
import type { PrayerName } from "@/lib/types";

const PRAYERS: PrayerName[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

const SHADOW_PAPER =
  "0 0 0 0.5px rgba(60,60,67,0.06),0 1px 1px rgba(20,20,30,0.02),0 12px 28px -16px rgba(20,20,30,0.10),0 28px 50px -32px rgba(20,20,30,0.14)";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function lastNDays(n: number): string[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return d.toISOString().slice(0, 10);
  });
}

function dayLabel(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return ["S", "M", "T", "W", "T", "F", "S"][d.getDay()];
}

function isToday(iso: string): boolean {
  return iso === todayISO();
}

export default function PrayerPage() {
  const { prayerMarks, markPrayer } = useDoIt();
  const today = todayISO();

  function isPrayed(dateISO: string, prayer: PrayerName): boolean {
    return prayerMarks.some(
      (m) => m.dateISO === dateISO && m.prayer === prayer && m.prayed,
    );
  }

  function toggle(prayer: PrayerName) {
    const current = isPrayed(today, prayer);
    markPrayer(today, prayer, !current);
  }

  // stats for this week (last 7 days)
  const last7 = lastNDays(7);
  const keptThisWeek = last7.reduce((acc, iso) => {
    return acc + PRAYERS.filter((p) => isPrayed(iso, p)).length;
  }, 0);
  const totalThisWeek = 7 * 5;

  // last 4 weeks for grid
  const last28 = lastNDays(28);

  return (
    <>
      <Topbar name="prayer." sub="five times · every day" />

      {/* heading */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          padding: "2px 6px 18px",
        }}
      >
        <div
          style={{
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#0B0B0F",
          }}
        >
          prayer.
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#8E8E93",
            letterSpacing: "-0.005em",
          }}
        >
          kept{" "}
          <b style={{ color: "#1C1C1E", fontWeight: 700 }}>{keptThisWeek}</b> of{" "}
          {totalThisWeek} this week
        </div>
      </div>

      {/* today's 5 prayers */}
      <div
        style={{
          background: "#fff",
          borderRadius: 22,
          padding: "6px 16px",
          boxShadow: SHADOW_PAPER,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#8E8E93",
            padding: "14px 0 10px",
          }}
        >
          today
        </div>
        {PRAYERS.map((prayer, i) => {
          const prayed = isPrayed(today, prayer);
          return (
            <div
              key={prayer}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 0",
                borderTop: i > 0 ? "0.5px solid rgba(60,60,67,0.06)" : "none",
              }}
            >
              {/* tap dot */}
              <button
                onClick={() => toggle(prayer)}
                aria-label={`${prayed ? "unmark" : "mark"} ${prayer}`}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  background: prayed
                    ? "linear-gradient(180deg,#C7F0CF 0%,#A8E4B4 100%)"
                    : "#F4F5F7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: prayed
                    ? "0 0 0 0.5px rgba(31,92,44,0.15), 0 2px 6px -2px rgba(31,92,44,0.20)"
                    : "inset 0 0 0 0.5px rgba(60,60,67,0.12)",
                  transition: "background 0.15s ease",
                }}
              >
                {prayed && (
                  <svg
                    viewBox="0 0 24 24"
                    width={13}
                    height={13}
                    fill="none"
                    stroke="#1F5C2C"
                    strokeWidth={2.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12l4 4L19 6" />
                  </svg>
                )}
              </button>

              {/* prayer name */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: prayed ? 600 : 700,
                    color: prayed ? "#8E8E93" : "#0B0B0F",
                    letterSpacing: "-0.015em",
                    textDecoration: prayed ? "none" : "none",
                  }}
                >
                  {prayer}
                </div>
              </div>

              {/* status badge */}
              {prayed ? (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#2F7A40",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    background: "#E2F4E6",
                    borderRadius: 999,
                    padding: "3px 9px",
                  }}
                >
                  kept
                </span>
              ) : (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#8E8E93",
                    letterSpacing: "0.02em",
                  }}
                >
                  tap to mark
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* weekly grid — last 28 days × 5 prayers */}
      <div
        style={{
          background: "#fff",
          borderRadius: 22,
          padding: 18,
          boxShadow: SHADOW_PAPER,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#8E8E93",
            }}
          >
            last 4 weeks
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#6E6E73",
              letterSpacing: "-0.005em",
            }}
          >
            {PRAYERS.map((p) => p[0]).join(" · ")}
          </span>
        </div>

        {/* grid: 28 cols × 5 rows */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(28, 1fr)`,
            gap: "3px 2px",
          }}
        >
          {PRAYERS.map((prayer) =>
            last28.map((iso) => {
              const prayed = isPrayed(iso, prayer);
              const today_ = isToday(iso);
              return (
                <div
                  key={`${iso}-${prayer}`}
                  style={{
                    aspectRatio: "1",
                    borderRadius: 2,
                    background: prayed ? "#C7F0CF" : "rgba(60,60,67,0.06)",
                    boxShadow: today_
                      ? "0 0 0 1px rgba(0,122,255,0.4)"
                      : undefined,
                  }}
                />
              );
            }),
          )}
        </div>

        {/* day labels row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(28, 1fr)`,
            gap: "0 2px",
            marginTop: 6,
          }}
        >
          {last28.map((iso, i) => (
            <div
              key={iso}
              style={{
                fontSize: 7.5,
                fontWeight: isToday(iso) ? 800 : 500,
                color: isToday(iso) ? "#0B0B0F" : "#C7C7CC",
                textAlign: "center",
                letterSpacing: 0,
                lineHeight: 1,
                opacity: i % 7 === 0 || isToday(iso) ? 1 : 0,
              }}
            >
              {i % 7 === 0 || isToday(iso) ? dayLabel(iso) : ""}
            </div>
          ))}
        </div>
      </div>

      {/* calm phrase */}
      <div
        style={{
          textAlign: "center",
          padding: "8px 16px",
          fontSize: 13.5,
          fontWeight: 500,
          color: "#6E6E73",
          letterSpacing: "-0.008em",
          lineHeight: 1.5,
          marginBottom: 110,
        }}
      >
        kept this week ·{" "}
        <b style={{ color: "#0B0B0F", fontWeight: 700 }}>{keptThisWeek}</b> of{" "}
        {totalThisWeek} prayers.
      </div>
    </>
  );
}
