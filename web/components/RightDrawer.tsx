"use client";

import { useEffect } from "react";

interface RightDrawerProps {
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
}

export default function RightDrawer({
  onClose,
  children,
  width = 360,
}: RightDrawerProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      {/* backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(18,18,24,0.32)",
          backdropFilter: "blur(12px) saturate(130%)",
          WebkitBackdropFilter: "blur(12px) saturate(130%)",
          animation: "fadeIn 0.18s ease",
        }}
      />

      {/* drawer panel */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: Math.min(width, 420),
          maxWidth: "92vw",
          height: "100%",
          background: "#fff",
          boxShadow:
            "-1px 0 0 rgba(60,60,67,0.06), -4px 0 24px rgba(20,20,30,0.10), -12px 0 48px rgba(20,20,30,0.12)",
          overflowY: "auto",
          animation: "slideFromRight 0.22s cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        {children}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideFromRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
