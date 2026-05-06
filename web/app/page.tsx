"use client";

import { useEffect } from "react";

export default function RootPage() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    let done = false;
    try {
      const raw = localStorage.getItem("do-it-state");
      if (raw) {
        const parsed = JSON.parse(raw);
        done = parsed?.state?.onboardingComplete === true;
      }
      if (!done) {
        done = localStorage.getItem("do-it-onboarding-complete") === "1";
      }
    } catch {
      done = false;
    }
    const BASE = process.env.NODE_ENV === "production" ? "/do-it" : "";
    window.location.replace(BASE + (done ? "/now/" : "/onboarding/"));
  }, []);

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--stage, #f2f2f7)",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color: "var(--label, #8E8E93)",
        }}
      >
        Loading…
      </div>
    </div>
  );
}
