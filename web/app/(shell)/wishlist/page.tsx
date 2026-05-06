"use client";

import { useState } from "react";
import { useDoIt } from "@/lib/store";
import type {
  WishlistCategory,
  WishlistPriority,
  WishlistStatus,
} from "@/lib/types";

const PRIORITY_LABEL: Record<WishlistPriority, string> = {
  low: "low",
  medium: "med",
  high: "high",
};

const PRIORITY_COLOR: Record<WishlistPriority, string> = {
  low: "#8E8E93",
  medium: "#007AFF",
  high: "#FF9500",
};

const STATUS_FILTER: { label: string; value: WishlistStatus | "all" }[] = [
  { label: "Wanted", value: "wanted" },
  { label: "Bought", value: "bought" },
  { label: "All", value: "all" },
];

function formatAmount(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default function WishlistPage() {
  const { wishlist, addWishlistItem, removeWishlistItem, markWishlistBought } =
    useDoIt();

  const [filterStatus, setFilterStatus] = useState<WishlistStatus | "all">(
    "wanted",
  );

  // Add form state
  const [addName, setAddName] = useState("");
  const [addAmount, setAddAmount] = useState("");
  const [addCategory, setAddCategory] = useState<WishlistCategory>("other");
  const [addPriority, setAddPriority] = useState<WishlistPriority>("medium");

  const visible = wishlist.filter(
    (w) => filterStatus === "all" || w.status === filterStatus,
  );

  function handleAdd() {
    const name = addName.trim();
    const cents = Math.round(parseFloat(addAmount) * 100);
    if (!name || isNaN(cents) || cents <= 0) return;
    addWishlistItem({
      name,
      expectedAmountCents: cents,
      currency: "USD",
      category: addCategory,
      priority: addPriority,
      status: "wanted",
    });
    setAddName("");
    setAddAmount("");
    setAddCategory("other");
    setAddPriority("medium");
  }

  return (
    <div style={{ position: "relative", zIndex: 2 }}>
      {/* Header */}
      <div style={{ padding: "0 4px", marginBottom: 18 }}>
        <div className="greet-day">Wishlist</div>
        <div className="greet-name">
          Wishlist <span className="sub">· tracked wants</span>
        </div>
      </div>

      {/* Inline add form */}
      <div
        style={{
          background: "var(--card,#fff)",
          borderRadius: 18,
          boxShadow:
            "0 0 0 0.5px rgba(60,60,67,0.07), 0 1px 1px rgba(20,20,30,0.02), 0 6px 16px -12px rgba(20,20,30,0.10)",
          padding: "14px 14px",
          marginBottom: 16,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={addName}
            onChange={(e) => setAddName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Item name"
            style={{
              flex: 1,
              fontSize: 14,
              fontWeight: 500,
              color: "var(--ink,#000)",
              background: "var(--inset,#F2F2F7)",
              border: "none",
              outline: "none",
              borderRadius: 10,
              padding: "8px 12px",
              fontFamily: "inherit",
              letterSpacing: "-0.012em",
            }}
          />
          <input
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="$0"
            type="number"
            min="0"
            step="0.01"
            style={{
              width: 72,
              fontSize: 14,
              fontWeight: 500,
              color: "var(--ink,#000)",
              background: "var(--inset,#F2F2F7)",
              border: "none",
              outline: "none",
              borderRadius: 10,
              padding: "8px 10px",
              fontFamily: "inherit",
              letterSpacing: "-0.012em",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select
            value={addCategory}
            onChange={(e) => setAddCategory(e.target.value as WishlistCategory)}
            style={{
              flex: 1,
              fontSize: 13,
              fontWeight: 500,
              color: "var(--ink-2,#1C1C1E)",
              background: "var(--inset,#F2F2F7)",
              border: "none",
              outline: "none",
              borderRadius: 10,
              padding: "7px 10px",
              fontFamily: "inherit",
            }}
          >
            <option value="books">Books</option>
            <option value="gear">Gear</option>
            <option value="tools">Tools</option>
            <option value="experiences">Experiences</option>
            <option value="other">Other</option>
          </select>
          <select
            value={addPriority}
            onChange={(e) => setAddPriority(e.target.value as WishlistPriority)}
            style={{
              width: 80,
              fontSize: 13,
              fontWeight: 500,
              color: "var(--ink-2,#1C1C1E)",
              background: "var(--inset,#F2F2F7)",
              border: "none",
              outline: "none",
              borderRadius: 10,
              padding: "7px 10px",
              fontFamily: "inherit",
            }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button
            onClick={handleAdd}
            style={{
              padding: "7px 16px",
              borderRadius: 10,
              background: "var(--ink,#000)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              letterSpacing: "-0.01em",
              flexShrink: 0,
            }}
          >
            + Add
          </button>
        </div>
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {STATUS_FILTER.map((f) => {
          const active = filterStatus === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setFilterStatus(f.value)}
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                background: active ? "var(--ink,#000)" : "var(--inset,#F2F2F7)",
                color: active ? "#fff" : "var(--label-2,#6E6E73)",
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <div
          style={{
            padding: "32px 0",
            textAlign: "center",
            fontSize: 14,
            fontWeight: 500,
            color: "var(--label,#8E8E93)",
            letterSpacing: "-0.01em",
          }}
        >
          Nothing here yet
        </div>
      ) : (
        <div
          style={{
            background: "var(--card,#fff)",
            borderRadius: 18,
            boxShadow:
              "0 0 0 0.5px rgba(60,60,67,0.07), 0 1px 1px rgba(20,20,30,0.02), 0 6px 16px -12px rgba(20,20,30,0.10)",
            overflow: "hidden",
          }}
        >
          {visible.map((item, i) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                borderTop:
                  i > 0 ? "0.5px solid rgba(60,60,67,0.06)" : undefined,
                opacity: item.status === "bought" ? 0.55 : 1,
              }}
            >
              {/* Priority pill */}
              {item.priority && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: PRIORITY_COLOR[item.priority],
                    background: `${PRIORITY_COLOR[item.priority]}18`,
                    padding: "3px 7px",
                    borderRadius: 999,
                    flexShrink: 0,
                  }}
                >
                  {PRIORITY_LABEL[item.priority]}
                </span>
              )}

              {/* Name + category */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14.5,
                    fontWeight: 500,
                    color: "var(--ink,#000)",
                    letterSpacing: "-0.018em",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    textDecoration:
                      item.status === "bought" ? "line-through" : "none",
                  }}
                >
                  {item.name}
                </div>
                {item.category && (
                  <div
                    style={{
                      fontSize: 11.5,
                      fontWeight: 500,
                      color: "var(--label,#8E8E93)",
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {item.category}
                  </div>
                )}
              </div>

              {/* Amount */}
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--ink-2,#1C1C1E)",
                  letterSpacing: "-0.014em",
                  flexShrink: 0,
                }}
              >
                {formatAmount(item.expectedAmountCents, item.currency)}
              </div>

              {/* Actions */}
              {item.status === "wanted" && (
                <button
                  onClick={() => markWishlistBought(item.id)}
                  title="Mark bought"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "var(--inset,#F2F2F7)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.08)",
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
                    <path d="M5 12l4 4L19 6" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => removeWishlistItem(item.id)}
                title="Remove"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "var(--inset,#F2F2F7)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.08)",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width={12}
                  height={12}
                  fill="none"
                  stroke="var(--label,#8E8E93)"
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
