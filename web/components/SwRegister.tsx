"use client";

import { useEffect } from "react";

export function SwRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    let currentVersion: string | null = null;

    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});

    navigator.serviceWorker.addEventListener("message", (e) => {
      const data = e.data;
      if (!data || data.type !== "sw-version") return;
      const next = data.version as string;
      if (currentVersion && currentVersion !== next) {
        // New version activated — force reload to pick up new HTML
        window.location.reload();
      }
      currentVersion = next;
    });

    // Periodic update check while open
    const t = setInterval(async () => {
      const reg = await navigator.serviceWorker.getRegistration();
      reg?.update().catch(() => {});
    }, 60_000);
    return () => clearInterval(t);
  }, []);
  return null;
}
