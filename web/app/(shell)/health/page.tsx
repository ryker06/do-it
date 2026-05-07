"use client";

import { useState } from "react";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function HealthPage() {
  const { sleepLog, hydrationLog, bodyLog, logSleep, addGlass, logBody } =
    useDoIt();
  const today = todayISO();

  const [sleepHours, setSleepHours] = useState("");
  const [bodyWeight, setBodyWeight] = useState("");
  const [bodyWaist, setBodyWaist] = useState("");
  const [sleepEcho, setSleepEcho] = useState<string | null>(null);
  const [bodyEcho, setBodyEcho] = useState<string | null>(null);

  const todaySleep = sleepLog.find((l) => l.dateISO === today);
  const todayHydration = hydrationLog.find((l) => l.dateISO === today);
  const latestBody = [...bodyLog].sort((a, b) =>
    b.dateISO.localeCompare(a.dateISO),
  )[0];

  // 7-day sleep avg
  const recent7Sleep = sleepLog
    .filter((l) => l.dateISO !== today)
    .sort((a, b) => b.dateISO.localeCompare(a.dateISO))
    .slice(0, 7);
  const avgSleep =
    recent7Sleep.length > 0
      ? recent7Sleep.reduce((acc, l) => acc + l.hoursSlept, 0) /
        recent7Sleep.length
      : null;

  // 7-day sleep trend bars (most recent 7 days)
  const sleepTrend = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const iso = d.toISOString().slice(0, 10);
    const entry = sleepLog.find((l) => l.dateISO === iso);
    return { iso, hours: entry?.hoursSlept ?? 0 };
  });
  const maxSleep = Math.max(...sleepTrend.map((s) => s.hours), 8);

  // body trend
  const sortedBody = [...bodyLog].sort((a, b) =>
    a.dateISO.localeCompare(b.dateISO),
  );
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
  const fourWeeksAgoISO = fourWeeksAgo.toISOString().slice(0, 10);
  const oldBody = sortedBody.find((b) => b.dateISO >= fourWeeksAgoISO);
  const weightDelta =
    oldBody && latestBody && oldBody.weightKg && latestBody.weightKg
      ? latestBody.weightKg - oldBody.weightKg
      : null;

  function handleLogSleep() {
    const h = parseFloat(sleepHours);
    if (isNaN(h) || h <= 0) return;
    logSleep({ dateISO: today, hoursSlept: h });
    setSleepEcho(`${h}h logged. → rest compounds.`);
    setSleepHours("");
    setTimeout(() => setSleepEcho(null), 3000);
  }

  function handleLogBody() {
    const kg = parseFloat(bodyWeight);
    const waist = parseFloat(bodyWaist);
    if (isNaN(kg) && isNaN(waist)) return;
    logBody({
      dateISO: today,
      weightKg: isNaN(kg) ? undefined : kg,
      waistCm: isNaN(waist) ? undefined : waist,
    });
    const kgStr = !isNaN(kg) ? `${kg}kg` : null;
    setBodyEcho(`${kgStr ? kgStr + " logged." : "logged."} → body changing.`);
    setBodyWeight("");
    setBodyWaist("");
    setTimeout(() => setBodyEcho(null), 3000);
  }

  const glasses = todayHydration?.glasses ?? 0;
  const goalGlasses = 8;

  const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <>
      <Topbar name="health." sub="sleep. water. body." />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          paddingBottom: 110,
        }}
      >
        {/* ── SLEEP CARD (top, large) ── */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            background:
              "linear-gradient(160deg,#E8E5F4 0%,#F0E8F4 60%,#FBE9EE 100%)",
            borderRadius: 26,
            padding: "24px 22px 22px",
            boxShadow:
              "0 0 0 0.5px rgba(60,60,67,0.06),0 2px 3px rgba(20,20,30,0.04),0 18px 38px -18px rgba(20,20,30,0.18),0 36px 64px -32px rgba(20,20,30,0.18)",
            minHeight: 200,
          }}
        >
          {/* dot pattern */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle at 18% 22%,rgba(255,255,255,0.55) 1.5px,transparent 2px),radial-gradient(circle at 64% 50%,rgba(255,255,255,0.40) 1.5px,transparent 2px),radial-gradient(circle at 30% 78%,rgba(255,255,255,0.40) 1.5px,transparent 2px)",
              backgroundSize: "22px 22px,30px 30px,18px 18px",
              opacity: 0.55,
              pointerEvents: "none",
            }}
          />

          {/* Moon glyph */}
          <div
            style={{
              position: "absolute",
              top: 18,
              right: 18,
              width: 54,
              height: 54,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 35%,#FFF6E8 0%,#F5DDB6 60%,#E5BC8A 100%)",
              boxShadow:
                "0 8px 22px -8px rgba(58,44,102,0.30),inset -8px -10px 22px rgba(58,44,102,0.18)",
            }}
          />

          <div
            style={{
              fontSize: 10.5,
              color: "#3A2C66",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              position: "relative",
            }}
          >
            sleep
          </div>
          <div
            style={{
              fontSize: 54,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "#0B0B0F",
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1,
              marginTop: 6,
              position: "relative",
            }}
          >
            {todaySleep && todaySleep.hoursSlept > 0
              ? todaySleep.hoursSlept
              : "—"}
            <span
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#3A2C66",
                letterSpacing: "-0.025em",
                marginLeft: 4,
              }}
            >
              {todaySleep && todaySleep.hoursSlept > 0 ? "h" : ""}
            </span>
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#3A2C66",
              fontWeight: 600,
              marginTop: 8,
              letterSpacing: "-0.005em",
              position: "relative",
              lineHeight: 1.45,
            }}
          >
            {avgSleep ? (
              <>
                <strong style={{ color: "#0B0B0F", fontWeight: 800 }}>
                  {avgSleep.toFixed(1)}h
                </strong>{" "}
                7-day avg. → sleep is the edge.
              </>
            ) : (
              "log tonight to start tracking."
            )}
          </div>

          {/* Mini sleep trend bars */}
          <div
            style={{
              marginTop: 14,
              paddingTop: 14,
              borderTop: "0.5px solid rgba(58,44,102,0.18)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 6,
              height: 60,
              position: "relative",
            }}
          >
            {sleepTrend.map((s, i) => {
              const pct = maxSleep > 0 ? s.hours / maxSleep : 0;
              const barH = Math.max(4, Math.round(pct * 32));
              return (
                <div
                  key={s.iso}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 5,
                    justifyContent: "flex-end",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: barH,
                      borderRadius: 3,
                      background:
                        i === sleepTrend.length - 1
                          ? "#3A2C66"
                          : "rgba(58,44,102,0.30)",
                    }}
                  />
                  <div
                    style={{
                      fontSize: 9.5,
                      color: "#3A2C66",
                      opacity: 0.65,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {DAY_LABELS[i]}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Log row */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 14,
              position: "relative",
            }}
          >
            <input
              type="number"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogSleep()}
              placeholder="hours slept"
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.65)",
                border: "none",
                borderRadius: 14,
                padding: "11px 14px",
                fontSize: 14,
                fontWeight: 600,
                color: "#0B0B0F",
                fontFamily: "inherit",
                outline: "none",
                boxShadow: "inset 0 0 0 0.5px rgba(58,44,102,0.15)",
                fontVariantNumeric: "tabular-nums",
              }}
            />
            <button
              onClick={handleLogSleep}
              style={{
                background: "linear-gradient(180deg,#1A1A20 0%,#000 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 14,
                padding: "11px 18px",
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "inherit",
                cursor: "pointer",
                boxShadow:
                  "0 1px 0 rgba(255,255,255,0.08) inset,0 0 0 0.5px rgba(0,0,0,0.5),0 18px 38px -18px rgba(10,10,20,0.55)",
              }}
            >
              log
            </button>
          </div>
          {sleepEcho && (
            <div
              style={{
                fontSize: 12,
                color: "#3A2C66",
                fontWeight: 600,
                marginTop: 8,
                position: "relative",
              }}
            >
              {sleepEcho}
            </div>
          )}
        </div>

        {/* ── HYDRATION CARD (middle) ── */}
        <div
          style={{
            background: "linear-gradient(180deg,#F2F8FF 0%,#E2EEFF 100%)",
            borderRadius: 24,
            padding: 20,
            boxShadow:
              "0 0 0 0.5px rgba(60,60,67,0.06),0 1px 1px rgba(20,20,30,0.02),0 12px 28px -16px rgba(20,20,30,0.10),0 28px 50px -32px rgba(20,20,30,0.14)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <div
              style={{
                fontSize: 10.5,
                color: "#1748A8",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              hydration
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: "-0.025em",
                color: "#0B0B0F",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {glasses}
              <span
                style={{
                  fontSize: 14,
                  color: "#1748A8",
                  fontWeight: 700,
                  marginLeft: 2,
                }}
              >
                /{goalGlasses}
              </span>
            </div>
          </div>

          {/* 8 glass icons */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(8, 1fr)",
              gap: 7,
              marginBottom: 14,
            }}
          >
            {Array.from({ length: goalGlasses }, (_, i) => {
              const full = i < glasses;
              return (
                <button
                  key={i}
                  onClick={() => {
                    if (!full) addGlass(today);
                  }}
                  style={{
                    aspectRatio: "0.7",
                    borderRadius: "6px 6px 9px 9px",
                    position: "relative",
                    background: full
                      ? "linear-gradient(180deg,rgba(10,132,255,0.20) 0%,rgba(10,132,255,0.55) 100%)"
                      : "transparent",
                    boxShadow: full
                      ? "inset 0 0 0 1.5px #0A84FF,inset 0 4px 0 rgba(255,255,255,0.40)"
                      : "inset 0 0 0 1.5px rgba(10,132,255,0.30)",
                    cursor: full ? "default" : "pointer",
                    border: "none",
                    padding: 0,
                  }}
                >
                  {full && (
                    <div
                      style={{
                        position: "absolute",
                        top: 6,
                        left: 4,
                        right: 4,
                        height: 2,
                        background: "rgba(255,255,255,0.55)",
                        borderRadius: 2,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div
            style={{
              fontSize: 13,
              color: "#1748A8",
              fontWeight: 700,
              letterSpacing: "-0.005em",
            }}
          >
            {glasses >= goalGlasses ? (
              <>
                {goalGlasses} glasses done.{" "}
                <span style={{ color: "#0B0B0F", fontWeight: 800 }}>
                  → ahead of most.
                </span>
              </>
            ) : (
              <>
                {glasses} of {goalGlasses} today.
                <span
                  style={{
                    color: "#8E8E93",
                    fontWeight: 600,
                    margin: "0 4px",
                  }}
                >
                  →
                </span>
                <span style={{ color: "#0B0B0F", fontWeight: 800 }}>
                  {goalGlasses - glasses} left.
                </span>
              </>
            )}
          </div>
        </div>

        {/* ── BODY CARD (bottom) ── */}
        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: 22,
            boxShadow:
              "0 0 0 0.5px rgba(60,60,67,0.06),0 1px 1px rgba(20,20,30,0.02),0 12px 28px -16px rgba(20,20,30,0.10),0 28px 50px -32px rgba(20,20,30,0.14)",
            position: "relative",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 14,
            alignItems: "start",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10.5,
                color: "#8E8E93",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              body
            </div>

            {latestBody ? (
              <div style={{ marginBottom: 14 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 18,
                    flexWrap: "wrap",
                  }}
                >
                  {latestBody.weightKg && (
                    <div>
                      <div
                        style={{
                          fontSize: 32,
                          fontWeight: 800,
                          letterSpacing: "-0.03em",
                          color: "#0B0B0F",
                          fontVariantNumeric: "tabular-nums",
                          lineHeight: 1,
                        }}
                      >
                        {latestBody.weightKg}
                        <span
                          style={{
                            fontSize: 14,
                            color: "#6E6E73",
                            fontWeight: 700,
                            marginLeft: 2,
                          }}
                        >
                          kg
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: "#8E8E93",
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          marginTop: 4,
                        }}
                      >
                        weight
                      </div>
                    </div>
                  )}
                  {latestBody.waistCm && (
                    <div>
                      <div
                        style={{
                          fontSize: 32,
                          fontWeight: 800,
                          letterSpacing: "-0.03em",
                          color: "#0B0B0F",
                          fontVariantNumeric: "tabular-nums",
                          lineHeight: 1,
                        }}
                      >
                        {latestBody.waistCm}
                        <span
                          style={{
                            fontSize: 14,
                            color: "#6E6E73",
                            fontWeight: 700,
                            marginLeft: 2,
                          }}
                        >
                          cm
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: "#8E8E93",
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          marginTop: 4,
                        }}
                      >
                        waist
                      </div>
                    </div>
                  )}
                </div>

                <div
                  style={{
                    fontSize: 12.5,
                    color: "#1C1C1E",
                    fontWeight: 600,
                    marginTop: 14,
                    lineHeight: 1.45,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {weightDelta !== null ? (
                    weightDelta < 0 ? (
                      <>
                        <strong style={{ color: "#0B0B0F", fontWeight: 800 }}>
                          {Math.abs(weightDelta).toFixed(1)}kg lighter
                        </strong>{" "}
                        than 4 weeks ago.{" "}
                        <span style={{ color: "#1F5C2C", fontWeight: 700 }}>
                          → trajectory holding.
                        </span>
                      </>
                    ) : weightDelta > 0 ? (
                      <>
                        <strong style={{ color: "#0B0B0F", fontWeight: 800 }}>
                          +{weightDelta.toFixed(1)}kg
                        </strong>{" "}
                        since 4 weeks ago.
                      </>
                    ) : (
                      "holding steady. → keep moving."
                    )
                  ) : (
                    "one entry so far. → keep logging."
                  )}
                </div>
              </div>
            ) : (
              <div
                style={{
                  fontSize: 13,
                  color: "#8E8E93",
                  fontWeight: 500,
                  marginBottom: 14,
                  lineHeight: 1.5,
                }}
              >
                no body logs yet.
              </div>
            )}

            {/* Log row */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input
                type="number"
                value={bodyWeight}
                onChange={(e) => setBodyWeight(e.target.value)}
                placeholder="weight kg"
                style={{
                  flex: "1 1 80px",
                  background: "#FBFAF8",
                  border: "none",
                  borderRadius: 12,
                  padding: "10px 12px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#0B0B0F",
                  fontFamily: "inherit",
                  outline: "none",
                  boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
                  fontVariantNumeric: "tabular-nums",
                }}
              />
              <input
                type="number"
                value={bodyWaist}
                onChange={(e) => setBodyWaist(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogBody()}
                placeholder="waist cm"
                style={{
                  flex: "1 1 80px",
                  background: "#FBFAF8",
                  border: "none",
                  borderRadius: 12,
                  padding: "10px 12px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#0B0B0F",
                  fontFamily: "inherit",
                  outline: "none",
                  boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
                  fontVariantNumeric: "tabular-nums",
                }}
              />
              <button
                onClick={handleLogBody}
                style={{
                  flex: "0 0 auto",
                  background: "linear-gradient(180deg,#1A1A20 0%,#000 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  padding: "10px 16px",
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  boxShadow:
                    "0 1px 0 rgba(255,255,255,0.08) inset,0 0 0 0.5px rgba(0,0,0,0.5),0 18px 38px -18px rgba(10,10,20,0.55)",
                }}
              >
                log
              </button>
            </div>

            {bodyEcho && (
              <div
                style={{
                  fontSize: 11,
                  color: "#6E6E73",
                  fontWeight: 600,
                  marginTop: 10,
                  lineHeight: 1.45,
                }}
              >
                {bodyEcho}
              </div>
            )}
          </div>

          {/* Body silhouette SVG */}
          <div
            style={{
              width: 60,
              height: 80,
              flexShrink: 0,
              alignSelf: "center",
              opacity: 0.18,
            }}
          >
            <svg viewBox="0 0 24 40" width="100%" height="100%" fill="#0B0B0F">
              <circle cx="12" cy="4" r="3.5" />
              <path d="M7 10h10v12H7z" rx="2" />
              <rect x="7" y="10" width="10" height="12" rx="2" />
              <rect x="4" y="10" width="3" height="9" rx="1.5" />
              <rect x="17" y="10" width="3" height="9" rx="1.5" />
              <rect x="8" y="22" width="3.5" height="12" rx="1.5" />
              <rect x="12.5" y="22" width="3.5" height="12" rx="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
