import type { Anchor } from "./types";

const KIEL = { lat: 54.3233, lon: 10.1228 };
const METHOD_MWL = 3;
const SCHOOL_HANBALI = 0;

type AladhanResp = {
  data: {
    timings: {
      Fajr: string;
      Dhuhr: string;
      Asr: string;
      Maghrib: string;
      Isha: string;
    };
    date: { readable: string };
  };
};

const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

export async function fetchTodayPrayers(): Promise<Anchor[]> {
  const url = `https://api.aladhan.com/v1/timings?latitude=${KIEL.lat}&longitude=${KIEL.lon}&method=${METHOD_MWL}&school=${SCHOOL_HANBALI}`;
  try {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error(`status ${r.status}`);
    const j = (await r.json()) as AladhanResp;
    return PRAYERS.map((name) => ({
      id: `prayer-${name.toLowerCase()}`,
      kind: "prayer" as const,
      label: name,
      hhmm: j.data.timings[name].slice(0, 5),
      hard: true,
    }));
  } catch {
    return [];
  }
}

export function nextPrayer(anchors: Anchor[], now: Date): Anchor | null {
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const upcoming = anchors
    .map((a) => {
      const [h, m] = a.hhmm.split(":").map(Number);
      return { a, mins: h * 60 + m };
    })
    .filter((x) => x.mins > nowMin)
    .sort((a, b) => a.mins - b.mins);
  return upcoming[0]?.a ?? null;
}

export function minsUntilHHMM(hhmm: string, now: Date): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m - (now.getHours() * 60 + now.getMinutes());
}
