"use client";

import Link from "next/link";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";

export default function MealPage() {
  const { blocks, finish, createBlock } = useDoIt();

  const foodBlocks = blocks
    .filter((b) => b.domain === "food" && b.scheduledFor === "today")
    .sort((a, b) => a.order - b.order);

  function markEaten(id: string) {
    finish(id);
  }

  function planTomorrow() {
    createBlock({
      title: "Meal — plan tomorrow",
      domain: "food",
      durationMin: 20,
      scheduleToday: false,
    });
  }

  return (
    <>
      <Topbar name="Meal" sub="today's food" />

      {/* eyebrow */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 6px",
          marginBottom: 14,
        }}
      >
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            color: "var(--label,#8E8E93)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          Today
        </span>
        <span
          style={{
            flex: 1,
            height: 1,
            background: "var(--hairline-2,rgba(60,60,67,0.06))",
          }}
        />
        <Link
          href="/meal/shopping"
          style={{
            fontSize: 11.5,
            fontWeight: 600,
            color: "var(--blue,#007AFF)",
            letterSpacing: "-0.005em",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          Shopping list
          <svg
            viewBox="0 0 24 24"
            width={9}
            height={9}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          paddingBottom: 110,
        }}
      >
        {foodBlocks.length === 0 ? (
          <div
            style={{
              background: "var(--card,#fff)",
              borderRadius: 18,
              padding: "32px 16px",
              textAlign: "center",
              boxShadow:
                "0 0 0 0.5px rgba(60,60,67,0.05), 0 1px 1px rgba(20,20,30,0.02)",
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "var(--label,#8E8E93)",
                letterSpacing: "-0.012em",
              }}
            >
              No meals planned today
            </div>
          </div>
        ) : (
          foodBlocks.map((b) => {
            const done = b.status === "done";
            return (
              <div
                key={b.id}
                style={{
                  background: "var(--card,#fff)",
                  borderRadius: 18,
                  padding: "14px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  boxShadow:
                    "0 0 0 0.5px rgba(60,60,67,0.05), 0 1px 1px rgba(20,20,30,0.02), 0 6px 16px -12px rgba(20,20,30,0.08)",
                  position: "relative",
                  opacity: done ? 0.55 : 1,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 18,
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 0.5px rgba(60,60,67,0.05)",
                    pointerEvents: "none",
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "var(--ink,#000)",
                      letterSpacing: "-0.022em",
                      lineHeight: 1.2,
                      textDecoration: done ? "line-through" : "none",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {b.title}
                  </div>
                  {b.meta?.mealSlot && (
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: "var(--label,#8E8E93)",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        marginTop: 2,
                      }}
                    >
                      {String(b.meta.mealSlot)}
                    </div>
                  )}
                </div>
                {!done ? (
                  <button
                    onClick={() => markEaten(b.id)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 999,
                      background:
                        "linear-gradient(180deg,#E8F5E9 0%,#D4EDD6 100%)",
                      color: "#248A3D",
                      fontSize: 12.5,
                      fontWeight: 600,
                      letterSpacing: "-0.010em",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      flexShrink: 0,
                      boxShadow:
                        "inset 0 0 0 0.5px rgba(52,199,89,0.20), 0 1px 2px rgba(52,199,89,0.08)",
                    }}
                  >
                    Eaten
                  </button>
                ) : (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--green-deep,#248A3D)",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      flexShrink: 0,
                    }}
                  >
                    Done
                  </span>
                )}
              </div>
            );
          })
        )}

        {/* plan tomorrow */}
        <button
          onClick={planTomorrow}
          style={{
            marginTop: 8,
            height: 52,
            borderRadius: 16,
            border: "1px dashed var(--hairline-strong,rgba(60,60,67,0.18))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            background: "transparent",
            cursor: "pointer",
            width: "100%",
            fontFamily: "inherit",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={12}
            height={12}
            fill="none"
            stroke="var(--label-2,#6E6E73)"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span
            style={{
              fontSize: 13.5,
              fontWeight: 600,
              color: "var(--label-2,#6E6E73)",
              letterSpacing: "-0.012em",
            }}
          >
            Plan tomorrow&apos;s meal
          </span>
        </button>
      </div>
    </>
  );
}
