"use client";

import { useRouter } from "next/navigation";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
import { DomainGlyph, SparkSvg } from "@/components/icons";

export default function VisionsPage() {
  const { visions, domains } = useDoIt();
  const router = useRouter();

  // Empty state
  if (visions.length === 0) {
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
              "radial-gradient(120% 80% at 50% -10%, rgba(52,199,89,0.07) 0%, rgba(52,199,89,0.015) 40%, transparent 65%), radial-gradient(80% 60% at 85% 0%, rgba(200,230,210,0.20) 0%, transparent 55%)",
          }}
        />
        <Topbar name="Visions" sub="no threads yet" />

        <div className="section-eyebrow">
          <span className="lbl">What you&apos;re building</span>
          <span className="rule" />
          <span className="meta">begin a thread</span>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "8px 4px 110px",
          }}
        >
          {/* sage orb */}
          <div
            style={{
              width: 148,
              height: 148,
              borderRadius: "50%",
              position: "relative",
              margin: "18px auto 0",
              background:
                "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 22%, transparent 45%), radial-gradient(circle at 50% 60%, #E2F4E6 0%, #C0E5C8 60%, #9CD2A8 100%)",
              boxShadow:
                "inset 0 -10px 30px rgba(50,110,70,0.18), inset 0 2px 0 rgba(255,255,255,0.9), 0 30px 60px -22px rgba(50,110,70,0.22), 0 10px 30px -10px rgba(50,110,70,0.14)",
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
                color: "rgba(40,90,55,0.42)",
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
                <circle cx="24" cy="24" r="14" />
                <path d="M24 14l3.5 8.5L24 26l-3.5-3.5z" />
                <path d="M24 26l-3.5 8L24 30.5 27.5 34z" />
                <path d="M24 6v3M24 39v3M6 24h3M39 24h3" />
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
              What are you
              <br />
              building?
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
              Visions are the big threads that pull you forward.
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
              Add your first vision
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

          {/* Notion hint card */}
          <div
            style={{
              margin: "32px 14px 0",
              background: "linear-gradient(180deg, #EAF6EE 0%, #DCEFE3 100%)",
              borderRadius: 20,
              padding: "14px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 0 0 0.5px rgba(47,90,62,0.10), 0 6px 16px -10px rgba(47,90,62,0.16)",
              position: "relative",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow:
                  "0 0 0 0.5px rgba(47,90,62,0.12), 0 1px 2px rgba(47,90,62,0.10)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width={18}
                height={18}
                fill="none"
                stroke="#2F5A3E"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3.5" y="3.5" width="17" height="17" rx="3.4" />
                <path d="M8.5 8v8M8.5 8l7 8M15.5 8v8" />
              </svg>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                flex: 1,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#1F3A2A",
                  letterSpacing: "-0.014em",
                }}
              >
                Pull from Notion
              </div>
              <div
                style={{
                  fontSize: 11.5,
                  fontWeight: 500,
                  color: "#4A6F58",
                  letterSpacing: "-0.005em",
                  lineHeight: 1.3,
                }}
              >
                We can shape your brain dumps into visions at 4&thinsp;am.
              </div>
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#2F5A3E",
                letterSpacing: "-0.005em",
                background: "rgba(255,255,255,0.85)",
                padding: "6px 11px",
                borderRadius: 999,
                boxShadow:
                  "0 0 0 0.5px rgba(47,90,62,0.12), 0 1px 2px rgba(47,90,62,0.06)",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              Connect
            </div>
          </div>
        </div>
      </>
    );
  }

  const hero = visions.find((v) => v.id === "v7") ?? visions[0];
  const grid = visions.filter((v) => v.id !== hero.id);

  return (
    <>
      <Topbar name="Visions" sub="where you're headed" />

      <div className="section-eyebrow">
        <span className="lbl">What you&apos;re building</span>
        <span className="rule" />
        <span className="meta">{visions.length} threads</span>
      </div>

      {/* Hero tile */}
      <button
        onClick={() => router.push(`/visions/${hero.id}`)}
        className="viz-hero"
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
        <div className="pin">⌖ The spine</div>
        <div className="row1">
          <div className="ddisc learning lg">
            <DomainGlyph id={hero.domainId} />
          </div>
          <div style={{ flex: 1 }}>
            <div
              className="title"
              style={{
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: "-0.038em",
                lineHeight: 1.05,
              }}
            >
              {hero.title}
            </div>
          </div>
        </div>
        <div className="blurb">{hero.blurb}</div>
      </button>

      <div className="viz-grid">
        {grid.map((v) => {
          return (
            <button
              key={v.id}
              onClick={() => router.push(`/visions/${v.id}`)}
              className="viz-tile"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "left",
                padding: 0,
              }}
            >
              <div className="spark">
                <SparkSvg />
              </div>
              <div className={`ddisc ${v.domainId} sm`}>
                <DomainGlyph id={v.domainId} />
              </div>
              <div className="name">{v.title}</div>
              <div className="tag">{shorten(v.blurb)}</div>
            </button>
          );
        })}
      </div>
    </>
  );
}

function shorten(s: string): string {
  if (s.length <= 60) return s;
  return s.slice(0, 57) + "…";
}
