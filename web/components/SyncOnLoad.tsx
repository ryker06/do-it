"use client";

import { useEffect, useRef, useState } from "react";
import { useDoIt } from "@/lib/store";
import { syncFromCloud } from "@/lib/notionSync";

/**
 * SyncOnLoad — mounted once in the shell layout.
 * On mount: if lastSyncISO < today AND local time >= 04:00, runs syncFromCloud().
 * Shows a small transient toast on success ("Synced N blocks").
 * Never blocks render. Never throws.
 */
export function SyncOnLoad() {
  const userPrefs = useDoIt((s) => s.userPrefs);
  const hydrated = useDoIt((s) => s.hydrated);
  const ran = useRef(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (ran.current) return;
    ran.current = true;

    const todayISO = new Date().toISOString().slice(0, 10);
    const alreadySyncedToday = userPrefs.lastSyncISO === todayISO;
    if (alreadySyncedToday) return;

    const now = new Date();
    const hoursLocal = now.getHours();
    // Only sync if it's 04:00 or later locally
    if (hoursLocal < 4) return;

    const syncUrl = userPrefs.syncUrl?.trim() ?? "";
    if (!syncUrl) return;

    syncFromCloud({ syncUrl })
      .then(({ added }) => {
        if (added > 0) {
          setToast(`Synced ${added} block${added === 1 ? "" : "s"}`);
          setTimeout(() => setToast(null), 2000);
        }
      })
      .catch(() => {
        // swallow — syncFromCloud already never throws, belt-and-suspenders
      });
  }, [hydrated, userPrefs.lastSyncISO, userPrefs.syncUrl]);

  if (!toast) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 100,
        right: 16,
        zIndex: 9999,
        background: "var(--ink, #000)",
        color: "#fff",
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: "-0.018em",
        padding: "8px 14px",
        borderRadius: 12,
        boxShadow:
          "0 4px 16px rgba(0,0,0,0.18), 0 0 0 0.5px rgba(255,255,255,0.08)",
        pointerEvents: "none",
        animation: "fadeInUp 0.22s ease",
      }}
      aria-live="polite"
    >
      {toast}
    </div>
  );
}
