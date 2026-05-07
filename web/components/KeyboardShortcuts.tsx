"use client";

import { useKeyboardShortcuts } from "@/lib/keyboard";

/**
 * Mounts global keyboard shortcuts. Drop once in the shell layout.
 * Cmd+K opens the CmdK palette (dispatches a custom event that CmdK listens to).
 */
export function KeyboardShortcuts() {
  useKeyboardShortcuts({
    onCmdK: () => {
      window.dispatchEvent(new CustomEvent("open-cmdk"));
    },
  });
  return null;
}
