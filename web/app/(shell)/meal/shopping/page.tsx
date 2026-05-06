"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDoIt } from "@/lib/store";

type Aisle = "produce" | "proteins" | "pantry" | "dairy" | "other";

const AISLE_LABELS: Record<Aisle, string> = {
  produce: "Produce",
  proteins: "Proteins",
  pantry: "Pantry",
  dairy: "Dairy",
  other: "Other",
};

const AISLE_ORDER: Aisle[] = [
  "produce",
  "proteins",
  "pantry",
  "dairy",
  "other",
];

function categorise(ingredient: string): Aisle {
  const t = ingredient.toLowerCase();
  if (
    /apple|banana|berry|berries|spinach|lettuce|tomato|cucumber|broccoli|carrot|onion|garlic|pepper|herb|basil|parsley|dill|lemon|lime|avocado|mushroom|potato|sweet potato|zucchini/.test(
      t,
    )
  )
    return "produce";
  if (/chicken|beef|salmon|fish|shrimp|egg|tofu|turkey|tuna|pork/.test(t))
    return "proteins";
  if (
    /rice|oats|pasta|flour|oil|olive oil|tahini|honey|sauce|stock|broth|bean|lentil|nut|almond|salt|pepper|spice|canned|can/.test(
      t,
    )
  )
    return "pantry";
  if (/milk|cheese|yogurt|butter|cream|kefir/.test(t)) return "dairy";
  return "other";
}

function getNextSevenDaysFoodIngredients(
  blocks: ReturnType<typeof useDoIt.getState>["blocks"],
): string[] {
  const now = new Date();
  const sevenDaysOut = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const sevenDaysOutStr = sevenDaysOut.toISOString().slice(0, 10);

  const allIngredients = new Set<string>();

  for (const b of blocks) {
    if (b.domain !== "food") continue;
    const sf = b.scheduledFor ?? "";
    const isToday = sf === "today";
    const isFutureDate =
      sf >= new Date().toISOString().slice(0, 10) && sf <= sevenDaysOutStr;
    if (!isToday && !isFutureDate) continue;
    if (Array.isArray(b.meta?.ingredients)) {
      for (const ing of b.meta.ingredients as string[]) {
        allIngredients.add(ing.toLowerCase().trim());
      }
    }
  }

  return Array.from(allIngredients).sort();
}

export default function ShoppingPage() {
  const router = useRouter();
  const { blocks } = useDoIt();
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const ingredients = getNextSevenDaysFoodIngredients(blocks);

  const grouped = AISLE_ORDER.reduce<Record<Aisle, string[]>>(
    (acc, aisle) => {
      acc[aisle] = ingredients.filter((i) => categorise(i) === aisle);
      return acc;
    },
    { produce: [], proteins: [], pantry: [], dairy: [], other: [] },
  );

  function toggleItem(item: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  }

  const totalItems = ingredients.length;
  const checkedCount = checked.size;

  return (
    <div
      style={{
        position: "relative",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* topbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 4px",
          marginBottom: 18,
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "var(--inset,#F2F2F7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.06)",
            border: "none",
            cursor: "pointer",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={13}
            height={13}
            fill="none"
            stroke="var(--ink-2,#1C1C1E)"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--label,#8E8E93)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Shopping
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "var(--ink,#000)",
              letterSpacing: "-0.030em",
              lineHeight: 1.1,
            }}
          >
            Next 7 days
          </div>
        </div>
        {totalItems > 0 && (
          <div
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              color: "var(--label-2,#6E6E73)",
              letterSpacing: "-0.005em",
            }}
          >
            {checkedCount}/{totalItems}
          </div>
        )}
      </div>

      {/* list */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "2px 0 110px",
          WebkitMaskImage:
            "linear-gradient(180deg, #000 0%, #000 92%, transparent 100%)",
          maskImage:
            "linear-gradient(180deg, #000 0%, #000 92%, transparent 100%)",
        }}
      >
        {totalItems === 0 ? (
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
              No ingredients found for upcoming meals
            </div>
          </div>
        ) : (
          AISLE_ORDER.map((aisle) => {
            const items = grouped[aisle];
            if (items.length === 0) return null;
            return (
              <div key={aisle} style={{ marginBottom: 22 }}>
                {/* aisle header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "0 6px",
                    marginBottom: 10,
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
                    {AISLE_LABELS[aisle]}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      height: 1,
                      background: "var(--hairline-2,rgba(60,60,67,0.06))",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--label-2,#6E6E73)",
                    }}
                  >
                    {items.length}
                  </span>
                </div>

                {/* items card */}
                <div
                  style={{
                    background: "var(--card,#fff)",
                    borderRadius: 18,
                    overflow: "hidden",
                    boxShadow:
                      "0 0 0 0.5px rgba(60,60,67,0.05), 0 1px 1px rgba(20,20,30,0.02), 0 6px 16px -12px rgba(20,20,30,0.08)",
                    position: "relative",
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
                      zIndex: 2,
                    }}
                  />
                  {items.map((item, i) => {
                    const done = checked.has(item);
                    return (
                      <button
                        key={item}
                        onClick={() => toggleItem(item)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "12px 14px",
                          width: "100%",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          textAlign: "left",
                          borderTop:
                            i > 0
                              ? "0.5px solid var(--hairline-2,rgba(60,60,67,0.06))"
                              : "none",
                        }}
                      >
                        {/* checkbox */}
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            flexShrink: 0,
                            background: done
                              ? "var(--green-soft,rgba(52,199,89,0.14))"
                              : "var(--inset,#F2F2F7)",
                            boxShadow: done
                              ? "none"
                              : "inset 0 0 0 0.5px var(--hairline,rgba(60,60,67,0.12))",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {done && (
                            <svg
                              viewBox="0 0 24 24"
                              width={10}
                              height={10}
                              fill="none"
                              stroke="var(--green-deep,#248A3D)"
                              strokeWidth={2.8}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12l4 4L19 6" />
                            </svg>
                          )}
                        </div>
                        <span
                          style={{
                            fontSize: 14.5,
                            fontWeight: 500,
                            color: done
                              ? "var(--label,#8E8E93)"
                              : "var(--ink-2,#1C1C1E)",
                            letterSpacing: "-0.016em",
                            textDecoration: done ? "line-through" : "none",
                            flex: 1,
                            textTransform: "capitalize",
                          }}
                        >
                          {item}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
