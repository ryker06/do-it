"use client";

type AnchorBand = {
  name: string;
  hhmm: string;
};

interface AnchorStackProps {
  prayers: AnchorBand[];
  dayStartHHMM?: string;
  dayEndHHMM?: string;
  containerHeight: number;
}

function hhmmToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function toPercent(hhmm: string, startMin: number, totalMin: number): number {
  const min = hhmmToMinutes(hhmm);
  return Math.max(0, Math.min(100, ((min - startMin) / totalMin) * 100));
}

function loadPrayerCache(): AnchorBand[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("do-it-prayer-cache-v1");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as {
      date: string;
      anchors: { label: string; hhmm: string }[];
    };
    if (parsed.date !== new Date().toDateString()) return [];
    return parsed.anchors.map((a) => ({ name: a.label, hhmm: a.hhmm }));
  } catch {
    return [];
  }
}

export function AnchorStack({
  prayers,
  dayStartHHMM = "06:00",
  dayEndHHMM = "22:00",
  containerHeight,
}: AnchorStackProps) {
  const cached = loadPrayerCache();
  const bands = cached.length > 0 ? cached : prayers;

  const startMin = hhmmToMinutes(dayStartHHMM);
  const endMin = hhmmToMinutes(dayEndHHMM);
  const totalMin = endMin - startMin;

  if (totalMin <= 0 || bands.length === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {bands.map((band) => {
        const pct = toPercent(band.hhmm, startMin, totalMin);
        const topPx = (pct / 100) * containerHeight;
        return (
          <div
            key={band.name}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: topPx - 1,
              height: 28,
              background:
                "linear-gradient(180deg, rgba(255,180,120,0.06) 0%, transparent 100%)",
              borderTop: "1px solid rgba(255,150,80,0.12)",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 3,
                left: 8,
                fontSize: 9,
                fontWeight: 600,
                color: "rgba(180,100,40,0.45)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                userSelect: "none",
              }}
            >
              {band.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
