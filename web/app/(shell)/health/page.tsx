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
  const [echo, setEcho] = useState<string | null>(null);

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

  // body trend
  const sortedBody = [...bodyLog].sort((a, b) =>
    a.dateISO.localeCompare(b.dateISO),
  );
  const oldest = sortedBody[0];
  const newest = sortedBody[sortedBody.length - 1];
  const weightDelta =
    oldest && newest && oldest.weightKg && newest.weightKg
      ? newest.weightKg - oldest.weightKg
      : null;

  function handleLogSleep() {
    const h = parseFloat(sleepHours);
    if (isNaN(h) || h <= 0) return;
    logSleep({ dateISO: today, hoursSlept: h });
    setEcho(`logged ${h}h. → rest compounds.`);
    setSleepHours("");
    setTimeout(() => setEcho(null), 3000);
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
    setEcho("logged. → body changing.");
    setBodyWeight("");
    setBodyWaist("");
    setTimeout(() => setEcho(null), 3000);
  }

  const glasses = todayHydration?.glasses ?? 0;
  const goalGlasses = 8;
  const ringPct = Math.min(1, glasses / goalGlasses);
  const circumference = 2 * Math.PI * 28;

  return (
    <div className="shell-content">
      <Topbar name="health." sub="sleep. water. body." />

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Sleep card */}
        <div
          style={{
            background: "var(--card)",
            borderRadius: 24,
            padding: "20px 20px 16px",
            boxShadow: "var(--shadow-stack)",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--label)",
              marginBottom: 12,
            }}
          >
            sleep
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: "-0.05em",
              color: "var(--ink)",
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1,
              marginBottom: 4,
            }}
          >
            {todaySleep && todaySleep.hoursSlept > 0
              ? `${todaySleep.hoursSlept}h`
              : "—"}
          </div>
          <div
            style={{
              fontSize: 12.5,
              color: "var(--label-2)",
              fontWeight: 600,
              marginBottom: 14,
            }}
          >
            {avgSleep
              ? `7-day avg: ${avgSleep.toFixed(1)}h`
              : "no recent data."}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="number"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              placeholder="hours slept"
              style={{
                flex: 1,
                background: "var(--inset)",
                border: "none",
                borderRadius: 12,
                padding: "10px 12px",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--ink)",
                fontFamily: "inherit",
                outline: "none",
                boxShadow: "inset 0 0 0 0.5px var(--hairline-2)",
              }}
            />
            <button
              onClick={handleLogSleep}
              style={{
                background: "linear-gradient(180deg,#1A1A20 0%,#000 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "10px 16px",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: "pointer",
                boxShadow: "var(--shadow-press)",
              }}
            >
              log
            </button>
          </div>
        </div>

        {/* Hydration card */}
        <div
          style={{
            background: "var(--card)",
            borderRadius: 24,
            padding: "20px 20px 16px",
            boxShadow: "var(--shadow-stack)",
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          {/* subtle ring */}
          <div style={{ flexShrink: 0 }}>
            <svg width={72} height={72} viewBox="0 0 72 72">
              <circle
                cx={36}
                cy={36}
                r={28}
                fill="none"
                stroke="var(--inset-2)"
                strokeWidth={5}
              />
              <circle
                cx={36}
                cy={36}
                r={28}
                fill="none"
                stroke="var(--blue)"
                strokeWidth={5}
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - ringPct)}
                strokeLinecap="round"
                transform="rotate(-90 36 36)"
                style={{ transition: "stroke-dashoffset 0.4s ease" }}
              />
              <text
                x={36}
                y={40}
                textAnchor="middle"
                fontSize={16}
                fontWeight={700}
                fill="var(--ink)"
                fontFamily="-apple-system,sans-serif"
              >
                {glasses}
              </text>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--label)",
                marginBottom: 6,
              }}
            >
              hydration
            </div>
            <div
              style={{
                fontSize: 14,
                color: "var(--ink-2)",
                fontWeight: 600,
                letterSpacing: "-0.012em",
                marginBottom: 10,
              }}
            >
              {glasses} of {goalGlasses} glasses
            </div>
            <button
              onClick={() => addGlass(today)}
              style={{
                background: "var(--blue-soft)",
                color: "var(--blue)",
                border: "none",
                borderRadius: 999,
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "inherit",
                cursor: "pointer",
                boxShadow: "inset 0 0 0 0.5px rgba(0,122,255,0.20)",
              }}
            >
              + glass
            </button>
          </div>
        </div>

        {/* Body card */}
        <div
          style={{
            background: "var(--card)",
            borderRadius: 24,
            padding: "20px 20px 16px",
            boxShadow: "var(--shadow-stack)",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--label)",
              marginBottom: 12,
            }}
          >
            body
          </div>
          {latestBody && (
            <div style={{ marginBottom: 12 }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  letterSpacing: "-0.045em",
                  color: "var(--ink)",
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {latestBody.weightKg ?? "—"}kg
              </div>
              <div
                style={{
                  fontSize: 12.5,
                  color: "var(--label-2)",
                  fontWeight: 600,
                }}
              >
                {weightDelta !== null
                  ? `${weightDelta > 0 ? "+" : ""}${weightDelta.toFixed(1)}kg since first log`
                  : "one entry so far."}
                {latestBody.waistCm ? ` · ${latestBody.waistCm}cm waist` : ""}
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="number"
              value={bodyWeight}
              onChange={(e) => setBodyWeight(e.target.value)}
              placeholder="weight kg"
              style={{
                flex: 1,
                background: "var(--inset)",
                border: "none",
                borderRadius: 12,
                padding: "10px 12px",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--ink)",
                fontFamily: "inherit",
                outline: "none",
                boxShadow: "inset 0 0 0 0.5px var(--hairline-2)",
              }}
            />
            <input
              type="number"
              value={bodyWaist}
              onChange={(e) => setBodyWaist(e.target.value)}
              placeholder="waist cm"
              style={{
                flex: 1,
                background: "var(--inset)",
                border: "none",
                borderRadius: 12,
                padding: "10px 12px",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--ink)",
                fontFamily: "inherit",
                outline: "none",
                boxShadow: "inset 0 0 0 0.5px var(--hairline-2)",
              }}
            />
            <button
              onClick={handleLogBody}
              style={{
                background: "linear-gradient(180deg,#1A1A20 0%,#000 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "10px 16px",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: "pointer",
                boxShadow: "var(--shadow-press)",
              }}
            >
              log
            </button>
          </div>
          {echo && (
            <div
              style={{
                fontSize: 11,
                color: "var(--label)",
                fontStyle: "italic",
                fontWeight: 600,
                marginTop: 10,
              }}
            >
              {echo}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
