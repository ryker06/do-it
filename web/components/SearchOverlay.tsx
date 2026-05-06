"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDoIt } from "@/lib/store";
import { DomainGlyph } from "@/components/icons";
import type { DomainId } from "@/lib/types";

const DOMAIN_BG: Record<DomainId, string> = {
  business: "var(--d-business-1,#E1ECFF)",
  religion: "var(--d-religion-1,#E2F4E6)",
  learning: "var(--d-learning-1,#FFE3EB)",
  fitness: "var(--d-fitness-1,#FFD0DA)",
  home: "var(--d-home-1,#E5ECF0)",
};

interface SearchOverlayProps {
  onClose: () => void;
}

export default function SearchOverlay({ onClose }: SearchOverlayProps) {
  const router = useRouter();
  const { blocks, visions, domains, routines } = useDoIt();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const q = query.trim().toLowerCase();

  const matchedBlocks = q
    ? blocks.filter((b) => b.title.toLowerCase().includes(q)).slice(0, 4)
    : [];
  const matchedVisions = q
    ? visions
        .filter(
          (v) =>
            v.title.toLowerCase().includes(q) ||
            v.blurb.toLowerCase().includes(q),
        )
        .slice(0, 3)
    : [];
  const matchedDomains = q
    ? domains.filter((d) => d.name.toLowerCase().includes(q)).slice(0, 3)
    : [];
  const matchedRoutines = q
    ? routines.filter((r) => r.name.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const hasResults =
    matchedBlocks.length > 0 ||
    matchedVisions.length > 0 ||
    matchedDomains.length > 0 ||
    matchedRoutines.length > 0;

  function highlight(text: string) {
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q);
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <strong style={{ color: "var(--ink,#000)", fontWeight: 700 }}>
          {text.slice(idx, idx + q.length)}
        </strong>
        {text.slice(idx + q.length)}
      </>
    );
  }

  const SUGGESTED: Array<{
    icon: React.ReactNode;
    label: string;
    sub: string;
    action: () => void;
  }> = [
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          width={18}
          height={18}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      ),
      label: "Add block",
      sub: "Schedule focus time",
      action: () => {
        onClose();
        router.push("/today");
      },
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          width={18}
          height={18}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 4l1.6 5.2L19 11l-5.4 1.8L12 18l-1.6-5.2L5 11l5.4-1.8z" />
        </svg>
      ),
      label: "Visions",
      sub: "Long-term goals",
      action: () => {
        onClose();
        router.push("/visions");
      },
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          width={18}
          height={18}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="8" height="8" rx="1.5" />
          <rect x="13" y="3" width="8" height="8" rx="1.5" />
          <rect x="3" y="13" width="8" height="8" rx="1.5" />
          <rect x="13" y="13" width="8" height="8" rx="1.5" />
        </svg>
      ),
      label: "Routines",
      sub: "Edit your week",
      action: () => {
        onClose();
        router.push("/routines");
      },
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          width={18}
          height={18}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
      label: "Settings",
      sub: "Domains & preferences",
      action: () => {
        onClose();
        router.push("/domains");
      },
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* sheet */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          background: "rgba(247,247,251,0.78)",
          backdropFilter: "saturate(180%) blur(28px)",
          WebkitBackdropFilter: "saturate(180%) blur(28px)",
          borderBottom: "0.5px solid var(--hairline,rgba(60,60,67,0.10))",
          display: "flex",
          flexDirection: "column",
          padding: "54px 20px 0",
        }}
      >
        {/* handle */}
        <div
          style={{
            width: 38,
            height: 5,
            borderRadius: 3,
            background: "rgba(60,60,67,0.18)",
            margin: "-8px auto 14px",
          }}
        />

        {/* search bar row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 22,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 42,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0 12px",
              background: "rgba(118,118,128,0.12)",
              borderRadius: 12,
              color: "var(--ink-2,#1C1C1E)",
              fontSize: 16,
              letterSpacing: "-0.01em",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width={16}
              height={16}
              fill="none"
              stroke="var(--label,#8E8E93)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0 }}
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search blocks, visions, domains…"
              style={{
                flex: 1,
                border: 0,
                background: "transparent",
                outline: 0,
                font: "inherit",
                color: "inherit",
                letterSpacing: "-0.01em",
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 999,
                  background: "rgba(60,60,67,0.30)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  flexShrink: 0,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width={9}
                  height={9}
                  fill="none"
                  stroke="#fff"
                  strokeWidth={2.4}
                  strokeLinecap="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              fontSize: 16,
              color: "var(--blue,#007AFF)",
              fontWeight: 400,
              letterSpacing: "-0.01em",
              padding: "4px 2px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Cancel
          </button>
        </div>

        {/* results or empty state */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {!q && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: 11,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--label,#8E8E93)",
                  fontWeight: 600,
                  padding: "0 4px 10px",
                }}
              >
                Suggested
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                {SUGGESTED.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={s.action}
                    style={{
                      background: "var(--card,#fff)",
                      borderRadius: 14,
                      padding: 14,
                      boxShadow:
                        "0 0 0 0.5px rgba(60,60,67,0.08), 0 1px 2px rgba(20,20,30,0.04), 0 1px 0 rgba(255,255,255,0.7) inset",
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      cursor: "pointer",
                      border: "none",
                      textAlign: "left",
                      fontFamily: "inherit",
                    }}
                  >
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        color: "var(--ink-2,#1C1C1E)",
                      }}
                    >
                      {s.icon}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--ink-2,#1C1C1E)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--label,#8E8E93)",
                        fontWeight: 500,
                        letterSpacing: "-0.005em",
                      }}
                    >
                      {s.sub}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {q && !hasResults && (
            <div
              style={{
                textAlign: "center",
                paddingTop: 60,
                fontSize: 15,
                fontWeight: 500,
                color: "var(--label,#8E8E93)",
                letterSpacing: "-0.01em",
              }}
            >
              No results for &ldquo;{query}&rdquo;
            </div>
          )}

          {q && hasResults && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {matchedBlocks.length > 0 && (
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--label,#8E8E93)",
                      fontWeight: 600,
                      padding: "0 4px 8px",
                    }}
                  >
                    Blocks
                  </div>
                  <div
                    style={{
                      background: "var(--card,#fff)",
                      borderRadius: 16,
                      boxShadow:
                        "0 0 0 0.5px rgba(60,60,67,0.06), 0 1px 1px rgba(20,20,30,0.02), 0 8px 22px -16px rgba(20,20,30,0.08)",
                      overflow: "hidden",
                    }}
                  >
                    {matchedBlocks.map((b, i) => (
                      <div
                        key={b.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "12px 14px",
                          borderTop:
                            i > 0
                              ? "0.5px solid var(--hairline-2,rgba(60,60,67,0.06))"
                              : "none",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 11,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            background: DOMAIN_BG[b.domainId],
                            color: "var(--glyph,#0A0A0F)",
                          }}
                        >
                          <DomainGlyph id={b.domainId} size={18} />
                        </div>
                        <div
                          style={{
                            flex: 1,
                            minWidth: 0,
                            display: "flex",
                            flexDirection: "column",
                            gap: 3,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 10,
                              letterSpacing: "0.14em",
                              textTransform: "uppercase",
                              color: "var(--label,#8E8E93)",
                              fontWeight: 600,
                            }}
                          >
                            Block
                          </div>
                          <div
                            style={{
                              fontSize: 15,
                              color: "var(--ink-2,#1C1C1E)",
                              letterSpacing: "-0.012em",
                              fontWeight: 500,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {highlight(b.title)}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "var(--label-2,#6E6E73)",
                              letterSpacing: "-0.005em",
                            }}
                          >
                            {b.durationMin} min
                          </div>
                        </div>
                        <svg
                          viewBox="0 0 24 24"
                          width={14}
                          height={14}
                          fill="none"
                          stroke="var(--label-3,#AEAEB2)"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 6l6 6-6 6" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchedVisions.length > 0 && (
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--label,#8E8E93)",
                      fontWeight: 600,
                      padding: "0 4px 8px",
                    }}
                  >
                    Visions
                  </div>
                  <div
                    style={{
                      background: "var(--card,#fff)",
                      borderRadius: 16,
                      boxShadow:
                        "0 0 0 0.5px rgba(60,60,67,0.06), 0 1px 1px rgba(20,20,30,0.02), 0 8px 22px -16px rgba(20,20,30,0.08)",
                      overflow: "hidden",
                    }}
                  >
                    {matchedVisions.map((v, i) => (
                      <button
                        key={v.id}
                        onClick={() => {
                          router.push(`/visions/${v.id}`);
                          onClose();
                        }}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "12px 14px",
                          borderTop:
                            i > 0
                              ? "0.5px solid var(--hairline-2,rgba(60,60,67,0.06))"
                              : "none",
                          cursor: "pointer",
                          background: "none",
                          border: "none",
                          textAlign: "left",
                        }}
                      >
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 11,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            background: DOMAIN_BG[v.domainId],
                            color: "var(--glyph,#0A0A0F)",
                          }}
                        >
                          <DomainGlyph id={v.domainId} size={18} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 10,
                              letterSpacing: "0.14em",
                              textTransform: "uppercase",
                              color: "var(--label,#8E8E93)",
                              fontWeight: 600,
                              marginBottom: 3,
                            }}
                          >
                            Vision
                          </div>
                          <div
                            style={{
                              fontSize: 15,
                              color: "var(--ink-2,#1C1C1E)",
                              letterSpacing: "-0.012em",
                              fontWeight: 500,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {highlight(v.title)}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "var(--label-2,#6E6E73)",
                              letterSpacing: "-0.005em",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {v.blurb}
                          </div>
                        </div>
                        <svg
                          viewBox="0 0 24 24"
                          width={14}
                          height={14}
                          fill="none"
                          stroke="var(--label-3,#AEAEB2)"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 6l6 6-6 6" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchedDomains.length > 0 && (
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--label,#8E8E93)",
                      fontWeight: 600,
                      padding: "0 4px 8px",
                    }}
                  >
                    Domains
                  </div>
                  <div
                    style={{
                      background: "var(--card,#fff)",
                      borderRadius: 16,
                      boxShadow:
                        "0 0 0 0.5px rgba(60,60,67,0.06), 0 1px 1px rgba(20,20,30,0.02), 0 8px 22px -16px rgba(20,20,30,0.08)",
                      overflow: "hidden",
                    }}
                  >
                    {matchedDomains.map((d, i) => (
                      <button
                        key={d.id}
                        onClick={() => {
                          router.push(`/domains/${d.id}`);
                          onClose();
                        }}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "12px 14px",
                          borderTop:
                            i > 0
                              ? "0.5px solid var(--hairline-2,rgba(60,60,67,0.06))"
                              : "none",
                          cursor: "pointer",
                          background: "none",
                          border: "none",
                          textAlign: "left",
                        }}
                      >
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 11,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            background: DOMAIN_BG[d.id],
                            color: "var(--glyph,#0A0A0F)",
                          }}
                        >
                          <DomainGlyph id={d.id} size={18} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 10,
                              letterSpacing: "0.14em",
                              textTransform: "uppercase",
                              color: "var(--label,#8E8E93)",
                              fontWeight: 600,
                              marginBottom: 3,
                            }}
                          >
                            Domain
                          </div>
                          <div
                            style={{
                              fontSize: 15,
                              color: "var(--ink-2,#1C1C1E)",
                              letterSpacing: "-0.012em",
                              fontWeight: 500,
                            }}
                          >
                            {highlight(d.name)}
                          </div>
                        </div>
                        <svg
                          viewBox="0 0 24 24"
                          width={14}
                          height={14}
                          fill="none"
                          stroke="var(--label-3,#AEAEB2)"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 6l6 6-6 6" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
