"use client";

import { useEffect, useState } from "react";

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
  // Use SSR-safe placeholder that gets replaced after mount.
  // "Today" is shown immediately; replaced with real day+time once client fires.
  const [dayLabel, setDayLabel] = useState<string>("Today");
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    function tick() {
      setDayLabel(formatDay(new Date()));
    }
    tick();
    const t = setInterval(tick, 30_000);
    return () => clearInterval(t);
  }, []);

  return (
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
      <div>
        <div className="greet-day">{dayLabel}</div>
        <div className="greet-name">
          {name}
          {sub && <span className="sub"> · {sub}</span>}
        </div>
      </div>
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
          <img src={AVATAR} alt="Adam" onError={() => setImgError(true)} />
        )}
      </div>
    </div>
  );
}

function formatDay(d: Date): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${days[d.getDay()]} · ${hh}:${mm}`;
}
