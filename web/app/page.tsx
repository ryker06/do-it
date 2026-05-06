"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDoIt } from "@/lib/store";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Read from store directly (post-hydration) to avoid flash
    const state = useDoIt.getState();
    if (state.onboardingComplete) {
      router.replace("/now");
    } else {
      router.replace("/onboarding");
    }
  }, [router]);

  // Calm splash during redirect — no flash of empty
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
      }}
    >
      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: "var(--ink,#000)",
          letterSpacing: "-0.045em",
          opacity: 0.12,
        }}
      >
        Do It.
      </div>
    </div>
  );
}
