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
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  const dayLabel = now ? formatDay(now) : "";
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
        <img src={AVATAR} alt="Adam" />
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
