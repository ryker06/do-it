"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDoIt } from "@/lib/store";

const STEPS = ["welcome", "city", "done"] as const;
type Step = (typeof STEPS)[number];

export default function OnboardingPage() {
  const router = useRouter();
  const { completeOnboarding, setUserCity } = useDoIt();
  const [step, setStep] = useState<Step>("welcome");
  const [city, setCity] = useState("Kiel");

  function finish() {
    setUserCity(city);
    completeOnboarding();
    router.push("/now");
  }

  function next() {
    if (step === "welcome") setStep("city");
    else if (step === "city") setStep("done");
    else finish();
  }

  function skip() {
    finish();
  }

  const stepIdx = STEPS.indexOf(step);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        padding: "54px 24px 0",
        overflow: "hidden",
      }}
    >
      {/* ambient halo */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 520,
          background:
            "radial-gradient(120% 80% at 50% -10%, rgba(0,122,255,0.07) 0%, rgba(0,122,255,0.018) 35%, transparent 65%), radial-gradient(80% 60% at 85% 0%, rgba(180,210,255,0.18) 0%, transparent 55%)",
          pointerEvents: "none",
        }}
      />

      {/* step eyebrow */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 10.5,
            fontWeight: 700,
            color: "var(--label-2,#6E6E73)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ display: "inline-flex", gap: 4 }}>
            {STEPS.map((s, i) => (
              <span
                key={s}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background:
                    i <= stepIdx ? "var(--ink,#000)" : "var(--inset-2,#EAEAEF)",
                }}
              />
            ))}
          </span>
        </div>
        <button
          onClick={skip}
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--label,#8E8E93)",
            letterSpacing: "-0.012em",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Skip
        </button>
      </div>

      {/* ─── STEP: WELCOME ─── */}
      {step === "welcome" && (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 2,
            paddingBottom: 120,
          }}
        >
          <style>{`
            @keyframes ob-float {
              0%,100%{transform:translateY(0);}
              50%{transform:translateY(-6px);}
            }
          `}</style>
          <div
            style={{
              width: 220,
              height: 220,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 22%, transparent 45%), radial-gradient(circle at 50% 60%, #DCEAFC 0%, #C5DCF7 60%, #ABCAF0 100%)",
              boxShadow:
                "inset 0 -10px 30px rgba(60,90,140,0.18), inset 0 2px 0 rgba(255,255,255,0.9), 0 30px 60px -20px rgba(60,90,140,0.30), 0 10px 30px -10px rgba(60,90,140,0.18)",
              animation: "ob-float 5.5s ease-in-out infinite",
            }}
          />
          <div
            style={{
              marginTop: 46,
              fontSize: 48,
              fontWeight: 800,
              color: "var(--ink,#000)",
              letterSpacing: "-0.055em",
              lineHeight: 0.95,
              textAlign: "center",
            }}
          >
            Do It.
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 17,
              fontWeight: 500,
              color: "var(--label-2,#6E6E73)",
              letterSpacing: "-0.02em",
              textAlign: "center",
            }}
          >
            One thing at a time.
          </div>
          <div
            style={{
              marginTop: 26,
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontSize: 12,
              fontWeight: 600,
              color: "var(--label,#8E8E93)",
              letterSpacing: "0.02em",
              background: "rgba(255,255,255,0.7)",
              padding: "7px 13px",
              borderRadius: 999,
              boxShadow:
                "0 0 0 0.5px rgba(60,60,67,0.10), 0 1px 1px rgba(20,20,30,0.03)",
              backdropFilter: "saturate(180%) blur(10px)",
              WebkitBackdropFilter: "saturate(180%) blur(10px)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--green,#34C759)",
                boxShadow: "0 0 0 3px rgba(52,199,89,0.14)",
              }}
            />
            Calm. Focused. Daily.
          </div>
        </div>
      )}

      {/* ─── STEP: CITY ─── */}
      {step === "city" && (
        <div style={{ position: "relative", zIndex: 2, paddingBottom: 120 }}>
          <div
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              color: "var(--label,#8E8E93)",
              letterSpacing: "0.04em",
              marginTop: 14,
            }}
          >
            Step 2 of 3
          </div>
          <div
            style={{
              fontSize: 38,
              fontWeight: 800,
              color: "var(--ink,#000)",
              letterSpacing: "-0.05em",
              lineHeight: 0.99,
              marginTop: 6,
            }}
          >
            Where are{" "}
            <span style={{ color: "var(--label,#8E8E93)", fontWeight: 500 }}>
              you?
            </span>
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 15.5,
              fontWeight: 500,
              color: "var(--label-2,#6E6E73)",
              letterSpacing: "-0.014em",
              lineHeight: 1.42,
              maxWidth: 300,
            }}
          >
            Prayer times are calculated from your city. You can change this
            later.
          </div>

          {/* field card */}
          <div
            style={{
              position: "relative",
              marginTop: 24,
              background: "var(--card,#fff)",
              borderRadius: 24,
              padding: "18px 18px 18px 16px",
              boxShadow:
                "0 0 0 0.5px rgba(60,60,67,0.06), 0 1px 1px rgba(20,20,30,0.02), 0 12px 28px -14px rgba(20,20,30,0.10), 0 26px 50px -28px rgba(20,20,30,0.14)",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 24,
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 0.5px rgba(60,60,67,0.06)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                background: "linear-gradient(180deg,#E1ECFF 0%, #C9DBFF 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow:
                  "inset 0 0 0 0.5px rgba(20,20,30,0.06), inset 0 -2px 4px rgba(20,20,30,0.04), 0 1px 2px rgba(20,20,30,0.04)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width={22}
                height={22}
                fill="none"
                stroke="var(--glyph,#0A0A0F)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                flex: 1,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: "var(--label,#8E8E93)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                City
              </div>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your city"
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--ink,#000)",
                  letterSpacing: "-0.025em",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontFamily: "inherit",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ─── STEP: DONE ─── */}
      {step === "done" && (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 2,
            paddingBottom: 120,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "var(--green-soft,rgba(52,199,89,0.14))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width={36}
              height={36}
              fill="none"
              stroke="var(--green-deep,#248A3D)"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12l5 5 9-11" />
            </svg>
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 38,
              fontWeight: 800,
              color: "var(--ink,#000)",
              letterSpacing: "-0.05em",
              lineHeight: 0.99,
              textAlign: "center",
            }}
          >
            You&apos;re set.
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 15.5,
              fontWeight: 500,
              color: "var(--label-2,#6E6E73)",
              letterSpacing: "-0.014em",
              lineHeight: 1.42,
              textAlign: "center",
              maxWidth: 280,
            }}
          >
            Prayer times and a full day of focus — ready when you are.
          </div>
        </div>
      )}

      {/* footer CTA */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "18px 24px 28px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.92) 30%, #fff 70%)",
          zIndex: 3,
        }}
      >
        <button
          onClick={next}
          style={{
            width: "100%",
            background: "linear-gradient(180deg, #1A1A20 0%, #000000 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 999,
            padding: "17px 22px",
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: "-0.014em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.08) inset, 0 0 0 0.5px rgba(0,0,0,0.5), 0 18px 38px -18px rgba(10,10,20,0.55), 0 6px 14px -6px rgba(10,10,20,0.30)",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {step === "done" ? "Open Do It" : "Continue"}
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.16)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width={10}
              height={10}
              fill="none"
              stroke="#fff"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}
