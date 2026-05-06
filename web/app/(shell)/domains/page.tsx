"use client";

import { useRouter } from "next/navigation";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
import { DomainGlyph, ChevSvg, ArrowSvg } from "@/components/icons";
import type { DomainMomentum } from "@/lib/types";

const MOMENTUM: Record<DomainMomentum, string> = {
  strong: "Strong rhythm",
  stable: "Stable rhythm",
  weak: "Weak rhythm",
  inactive: "Quiet period",
};

export default function DomainsPage() {
  const { domains } = useDoIt();
  const router = useRouter();

  // Empty state
  if (domains.length === 0) {
    return (
      <>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 560,
            pointerEvents: "none",
            background:
              "radial-gradient(120% 80% at 50% -10%, rgba(255,200,210,0.10) 0%, rgba(255,200,210,0.02) 40%, transparent 65%), radial-gradient(70% 55% at 15% 0%, rgba(225,236,255,0.18) 0%, transparent 55%)",
          }}
        />
        <Topbar name="Domains" sub="nothing yet" />

        <div className="section-eyebrow">
          <span className="lbl">Five areas</span>
          <span className="rule" />
          <span className="meta">choose to begin</span>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "8px 4px 110px",
          }}
        >
          {/* warm orb */}
          <div
            style={{
              width: 148,
              height: 148,
              borderRadius: "50%",
              position: "relative",
              margin: "18px auto 0",
              background:
                "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 22%, transparent 45%), radial-gradient(circle at 50% 60%, #FFE3EB 0%, #FFCFDC 60%, #F4B6C7 100%)",
              boxShadow:
                "inset 0 -10px 30px rgba(160,80,100,0.16), inset 0 2px 0 rgba(255,255,255,0.9), 0 30px 60px -22px rgba(160,80,100,0.22), 0 10px 30px -10px rgba(160,80,100,0.14)",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(120,50,70,0.40)",
                zIndex: 1,
              }}
            >
              <svg
                viewBox="0 0 48 48"
                width={54}
                height={54}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="24" cy="24" r="3.2" />
                <path d="M24 10.5a5.5 5.5 0 010 11M24 10.5a5.5 5.5 0 000 11" />
                <path
                  d="M37.6 19.5a5.5 5.5 0 01-9 6.3M37.6 19.5a5.5 5.5 0 00-9 6.3"
                  transform="rotate(72 24 24)"
                />
                <path
                  d="M37.6 19.5a5.5 5.5 0 01-9 6.3M37.6 19.5a5.5 5.5 0 00-9 6.3"
                  transform="rotate(144 24 24)"
                />
                <path
                  d="M37.6 19.5a5.5 5.5 0 01-9 6.3M37.6 19.5a5.5 5.5 0 00-9 6.3"
                  transform="rotate(216 24 24)"
                />
                <path
                  d="M37.6 19.5a5.5 5.5 0 01-9 6.3M37.6 19.5a5.5 5.5 0 00-9 6.3"
                  transform="rotate(288 24 24)"
                />
              </svg>
            </div>
          </div>

          <div
            style={{ textAlign: "center", marginTop: 34, padding: "0 18px" }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: "var(--ink,#000)",
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
              }}
            >
              Define your
              <br />
              life areas.
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 14.5,
                fontWeight: 500,
                color: "var(--label-2,#6E6E73)",
                letterSpacing: "-0.012em",
                lineHeight: 1.42,
              }}
            >
              Domains are how Do It tracks momentum across what matters.
            </div>
          </div>

          <div
            style={{
              marginTop: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              padding: "0 6px",
            }}
          >
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
                padding: "14px 22px",
                borderRadius: 999,
                background: "linear-gradient(180deg, #1A1A20 0%, #000000 100%)",
                color: "#fff",
                fontWeight: 600,
                fontSize: 14.5,
                letterSpacing: "-0.012em",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow:
                  "0 1px 0 rgba(255,255,255,0.08) inset, 0 0 0 0.5px rgba(0,0,0,0.5), 0 18px 38px -18px rgba(10,10,20,0.55), 0 6px 14px -6px rgba(10,10,20,0.30)",
              }}
            >
              Add your first domain
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.16)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  viewBox="0 0 12 12"
                  width={9}
                  height={9}
                  fill="none"
                  stroke="#fff"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 6h7M6 3l3 3-3 3" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar name="Domains" sub="how life is moving" />

      <div className="section-eyebrow">
        <span className="lbl">Five areas</span>
        <span className="rule" />
        <span className="meta">this week</span>
      </div>

      <div>
        {domains.map((d) => (
          <button
            key={d.id}
            onClick={() => router.push(`/domains/${d.id}`)}
            className="dcard"
            style={{
              width: "100%",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              textAlign: "left",
              padding: 0,
            }}
          >
            <div className="dcard-head">
              <div className={`ddisc ${d.id} lg`}>
                <DomainGlyph id={d.id} />
              </div>
              <div className="dcard-body">
                <div className="dcard-name">{d.name}</div>
                <div className="dcard-meta">
                  <span className="rhythm">{MOMENTUM[d.momentum]}</span>
                  <span className="sep">·</span>
                  <ArrowSvg
                    dir={d.direction === "improving" ? "up" : "flat"}
                    stroke="#6E6E73"
                    size={9}
                  />
                  <span style={{ color: "#6E6E73", fontWeight: 600 }}>
                    {d.direction}
                  </span>
                  <span className="sep">·</span>
                  <span className="last">{d.lastEngagement}</span>
                </div>
              </div>
              <div className="dcard-chev">
                <ChevSvg />
              </div>
            </div>
            <div className="next">
              <span className="lbl">Next</span>
              <span className="vline" />
              <span className="text">{d.nextAction}</span>
              <span className="go">
                <ChevSvg size={8} stroke="#1C1C1E" />
              </span>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
