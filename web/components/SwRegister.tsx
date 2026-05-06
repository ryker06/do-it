"use client";

import { useEffect } from "react";

export function SwRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV === "production") {
      let currentVersion: string | null = null;

      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch(() => {});

      navigator.serviceWorker.addEventListener("message", (e) => {
        const data = e.data;
        if (!data || data.type !== "sw-version") return;
        const next = data.version as string;
        if (currentVersion && currentVersion !== next) {
          window.location.reload();
        }
        currentVersion = next;
      });

      const t = setInterval(async () => {
        const reg = await navigator.serviceWorker.getRegistration();
        reg?.update().catch(() => {});
      }, 60_000);
      return () => clearInterval(t);
    } else {
      // Dev: nuke any previously-registered SW + caches so stale pages don't appear
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => regs.forEach((r) => r.unregister()));
      if ("caches" in window) {
        caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
      }
    }
  }, []);
  return null;
}
