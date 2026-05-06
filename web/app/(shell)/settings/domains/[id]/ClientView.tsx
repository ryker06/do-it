"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDoIt } from "@/lib/store";
import { DomainGlyph } from "@/components/icons";
import type { DomainId, DomainMomentum, DomainDirection } from "@/lib/types";

const DOMAIN_BG: Record<DomainId, string> = {
  business: "linear-gradient(180deg,#E1ECFF 0%, #C9DBFF 100%)",
  religion: "linear-gradient(180deg,#E2F4E6 0%, #C0E5C8 100%)",
  learning: "linear-gradient(180deg,#FFE3EB 0%, #FFCFDC 100%)",
  fitness: "linear-gradient(180deg,#FFD0DA 0%, #FFB6C5 100%)",
  home: "linear-gradient(180deg,#E5ECF0 0%, #CFDCE3 100%)",
  food: "linear-gradient(180deg,#FFF3E0 0%, #FFE0B2 100%)",
};

const MOMENTUMS: DomainMomentum[] = [
  "warm",
  "steady",
  "drifting",
  "quiet",
  "humming",
];
const DIRECTIONS: DomainDirection[] = ["improving", "stable", "declining"];

const MOMENTUM_LABELS: Record<DomainMomentum, string> = {
  warm: "Warm",
  steady: "Steady",
  drifting: "Drifting",
  quiet: "Quiet",
  humming: "Humming",
};
const DIRECTION_LABELS: Record<DomainDirection, string> = {
  improving: "Improving",
  stable: "Stable",
  declining: "Declining",
};

export function ClientView({ id }: { id: string }) {
  const router = useRouter();
  const { domains, updateDomain } = useDoIt();

  const domainId = id as DomainId;
  const domain = domains.find((d) => d.id === domainId);

  const [nextAction, setNextAction] = useState(domain?.nextAction ?? "");
  const [streakLabel, setStreakLabel] = useState(domain?.streakLabel ?? "");
  const [momentum, setMomentum] = useState<DomainMomentum>(
    domain?.momentum ?? "steady",
  );
  const [direction, setDirection] = useState<DomainDirection>(
    domain?.direction ?? "stable",
  );

  if (!domain) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "var(--label,#8E8E93)",
          }}
        >
          Domain not found
        </div>
      </div>
    );
  }

  function save() {
    updateDomain(domainId, { nextAction, streakLabel, momentum, direction });
    router.back();
  }

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      {/* scrim */}
      <div
        onClick={() => router.back()}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(18,18,24,0.34)",
          backdropFilter: "blur(14px) saturate(140%)",
          WebkitBackdropFilter: "blur(14px) saturate(140%)",
          zIndex: 0,
        }}
      />

      {/* sheet */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          background: "#fff",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          padding: "10px 22px 24px",
          boxShadow:
            "0 -1px 0 rgba(255,255,255,0.95) inset, 0 0 0 0.5px rgba(60,60,67,0.08), 0 -2px 8px rgba(20,20,30,0.04), 0 -22px 60px -10px rgba(20,20,30,0.20), 0 -40px 80px -20px rgba(20,20,30,0.22)",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.95)",
            pointerEvents: "none",
          }}
        />

        {/* handle */}
        <div
          style={{
            width: 38,
            height: 5,
            borderRadius: 999,
            background: "rgba(60,60,67,0.22)",
            margin: "8px auto 6px",
          }}
        />

        {/* eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "6px 4px 4px",
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
            Edit domain
          </span>
          <button
            onClick={() => router.back()}
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "var(--label-2,#6E6E73)",
              letterSpacing: "-0.018em",
              background: "none",
              border: 0,
              cursor: "pointer",
              padding: "4px 2px",
            }}
          >
            Cancel
          </button>
        </div>

        {/* preview disc */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "14px 0 18px",
          }}
        >
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: DOMAIN_BG[domainId],
              boxShadow:
                "inset 0 0 0 0.5px rgba(20,20,30,0.06), inset 0 -4px 8px rgba(20,20,30,0.05), 0 1px 2px rgba(20,20,30,0.04), 0 18px 40px -18px rgba(20,20,30,0.25)",
              color: "var(--glyph,#0A0A0F)",
            }}
          >
            <DomainGlyph id={domainId} size={40} />
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 22,
              fontWeight: 700,
              color: "var(--ink,#000)",
              letterSpacing: "-0.030em",
              lineHeight: 1.05,
            }}
          >
            {domain.name}
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: 11.5,
              fontWeight: 600,
              color: "var(--label,#8E8E93)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Domain
          </div>
        </div>

        {/* scroll body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            margin: "0 -22px",
            padding: "0 22px 8px",
            WebkitMaskImage:
              "linear-gradient(180deg, #000 0%, #000 95%, transparent 100%)",
            maskImage:
              "linear-gradient(180deg, #000 0%, #000 95%, transparent 100%)",
          }}
        >
          {/* momentum */}
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
            Momentum
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 18,
              flexWrap: "wrap",
            }}
          >
            {MOMENTUMS.map((m) => {
              const active = momentum === m;
              return (
                <button
                  key={m}
                  onClick={() => setMomentum(m)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    background: active ? "#0A0A0F" : "var(--inset,#F2F2F7)",
                    color: active ? "#fff" : "var(--ink-2,#1C1C1E)",
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "-0.012em",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: active
                      ? "none"
                      : "inset 0 0 0 0.5px var(--hairline-2,rgba(60,60,67,0.06))",
                  }}
                >
                  {MOMENTUM_LABELS[m]}
                </button>
              );
            })}
          </div>

          {/* direction */}
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
            Direction
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 18,
              flexWrap: "wrap",
            }}
          >
            {DIRECTIONS.map((d) => {
              const active = direction === d;
              return (
                <button
                  key={d}
                  onClick={() => setDirection(d)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    background: active ? "#0A0A0F" : "var(--inset,#F2F2F7)",
                    color: active ? "#fff" : "var(--ink-2,#1C1C1E)",
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "-0.012em",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: active
                      ? "none"
                      : "inset 0 0 0 0.5px var(--hairline-2,rgba(60,60,67,0.06))",
                  }}
                >
                  {DIRECTION_LABELS[d]}
                </button>
              );
            })}
          </div>

          {/* next action */}
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
            Next action
          </div>
          <div
            style={{
              background: "var(--inset,#F2F2F7)",
              borderRadius: 14,
              padding: "12px 14px",
              boxShadow:
                "inset 0 0 0 0.5px var(--hairline-2,rgba(60,60,67,0.06))",
              marginBottom: 18,
            }}
          >
            <input
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              placeholder="What's next for this domain?"
              style={{
                width: "100%",
                fontSize: 14,
                fontWeight: 500,
                color: "var(--ink,#000)",
                letterSpacing: "-0.018em",
                background: "transparent",
                border: "none",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* streak label */}
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
            Streak label
          </div>
          <div
            style={{
              background: "var(--inset,#F2F2F7)",
              borderRadius: 14,
              padding: "12px 14px",
              boxShadow:
                "inset 0 0 0 0.5px var(--hairline-2,rgba(60,60,67,0.06))",
              marginBottom: 24,
            }}
          >
            <input
              value={streakLabel}
              onChange={(e) => setStreakLabel(e.target.value)}
              placeholder="e.g. 7-day streak"
              style={{
                width: "100%",
                fontSize: 14,
                fontWeight: 500,
                color: "var(--ink,#000)",
                letterSpacing: "-0.018em",
                background: "transparent",
                border: "none",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* save */}
          <button
            onClick={save}
            style={{
              width: "100%",
              padding: 16,
              borderRadius: 18,
              border: 0,
              cursor: "pointer",
              background: "linear-gradient(180deg,#1C1C1E 0%, #000000 100%)",
              boxShadow:
                "0 0 0 0.5px rgba(0,0,0,0.40), 0 14px 28px -12px rgba(20,20,30,0.50), 0 6px 12px -6px rgba(20,20,30,0.30)",
              color: "#fff",
              fontSize: 15.5,
              fontWeight: 700,
              letterSpacing: "-0.022em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width={14}
              height={14}
              fill="none"
              stroke="#fff"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12l4 4L19 6" />
            </svg>
            save changes
          </button>
        </div>
      </div>
    </div>
  );
}
