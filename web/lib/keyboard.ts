"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type KeyboardContext = {
  onNewAction?: () => void;
  onCmdK?: () => void;
};

/**
 * Global keyboard shortcuts hook.
 * Mount once in the shell layout.
 * Cmd+1-4 for primary nav, Cmd+N for context-aware new, Cmd+K for palette, Esc for close.
 */
export function useKeyboardShortcuts({
  onNewAction,
  onCmdK,
}: KeyboardContext = {}) {
  const router = useRouter();

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;

      // Cmd+K — palette
      if (meta && e.key === "k") {
        e.preventDefault();
        onCmdK?.();
        return;
      }

      // Cmd+1 → /now
      if (meta && e.key === "1") {
        e.preventDefault();
        router.push("/now");
        return;
      }

      // Cmd+2 → /today
      if (meta && e.key === "2") {
        e.preventDefault();
        router.push("/today");
        return;
      }

      // Cmd+3 → /week
      if (meta && e.key === "3") {
        e.preventDefault();
        router.push("/week");
        return;
      }

      // Cmd+4 → /more
      if (meta && e.key === "4") {
        e.preventDefault();
        router.push("/more");
        return;
      }

      // Cmd+N — context-aware new
      if (meta && e.key === "n") {
        e.preventDefault();
        onNewAction?.();
        return;
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [router, onNewAction, onCmdK]);
}
