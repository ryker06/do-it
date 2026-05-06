"use client";

import { useState } from "react";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";

export default function CookieJarPage() {
  const { jar, addJarEntry, removeJarEntry } = useDoIt();
  const [newEntry, setNewEntry] = useState("");

  function handleAdd() {
    if (!newEntry.trim()) return;
    addJarEntry({ capturedAt: Date.now(), oneLine: newEntry.trim() });
    setNewEntry("");
  }

  const sorted = [...jar].sort((a, b) => b.capturedAt - a.capturedAt);

  return (
    <div className="shell-content">
      <Topbar name="cookie jar." sub="proof you've done hard things." />

      {/* Pink intro card */}
      <div
        style={{
          background:
            "linear-gradient(135deg, var(--pink) 0%, var(--pink-2) 100%)",
          borderRadius: 24,
          padding: "20px 20px 18px",
          marginBottom: 18,
          boxShadow: "var(--shadow-stack)",
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#7A2A3C",
            lineHeight: 1.2,
            marginBottom: 6,
          }}
        >
          every hard thing you finished lives here.
        </div>
        <div
          style={{
            fontSize: 13,
            color: "#9A3A50",
            fontWeight: 500,
            letterSpacing: "-0.005em",
          }}
        >
          open it when the next hard thing arrives.
        </div>
      </div>

      {/* Add entry */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 18,
        }}
      >
        <input
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="one line. what did you finish?"
          style={{
            flex: 1,
            background: "var(--card)",
            border: "none",
            borderRadius: 14,
            padding: "12px 14px",
            fontSize: 14,
            fontWeight: 500,
            color: "var(--ink)",
            fontFamily: "inherit",
            outline: "none",
            boxShadow: "var(--shadow-stack)",
          }}
        />
        <button
          onClick={handleAdd}
          style={{
            background: "linear-gradient(180deg,#1A1A20 0%,#000 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 14,
            padding: "12px 18px",
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "inherit",
            cursor: "pointer",
            boxShadow: "var(--shadow-press)",
            flexShrink: 0,
          }}
        >
          add
        </button>
      </div>

      {sorted.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 0",
            color: "var(--label)",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          nothing captured yet. · add your first win.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sorted.map((entry) => (
            <div
              key={entry.id}
              style={{
                background: "var(--card)",
                borderRadius: 18,
                padding: "14px 16px",
                boxShadow: "var(--shadow-stack)",
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                position: "relative",
              }}
            >
              <div
                style={{
                  flex: 1,
                  fontSize: 14.5,
                  fontWeight: 600,
                  color: "var(--ink)",
                  letterSpacing: "-0.018em",
                  lineHeight: 1.4,
                }}
              >
                {entry.oneLine}
              </div>
              <button
                onClick={() => removeJarEntry(entry.id)}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "var(--inset)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: "var(--label)",
                  fontSize: 13,
                  fontWeight: 700,
                  marginTop: 1,
                }}
                aria-label="remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
