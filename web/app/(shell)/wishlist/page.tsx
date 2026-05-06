"use client";

import { useState } from "react";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
import type {
  WishlistCategory,
  WishlistPriority,
  WishlistStatus,
} from "@/lib/types";

const PRIORITY_STYLE: Record<
  WishlistPriority,
  { bg: string; color: string; shadow: string }
> = {
  high: {
    bg: "linear-gradient(180deg,#FFD0DA 0%,#FFB6C5 100%)",
    color: "#C41E3A",
    shadow: "inset 0 0 0 0.5px rgba(196,30,58,0.15)",
  },
  medium: {
    bg: "linear-gradient(180deg,#E8F0FF 0%,#D6E4FF 100%)",
    color: "#3B5BDB",
    shadow: "inset 0 0 0 0.5px rgba(59,91,219,0.15)",
  },
  low: {
    bg: "var(--inset,#F2F2F7)",
    color: "var(--label,#8E8E93)",
    shadow: "inset 0 0 0 0.5px rgba(60,60,67,0.08)",
  },
};

const STATUS_FILTER: { label: string; value: WishlistStatus | "all" }[] = [
  { label: "wanted", value: "wanted" },
  { label: "bought", value: "bought" },
  { label: "all", value: "all" },
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
  const [addName, setAddName] = useState("");
  const [addAmount, setAddAmount] = useState("");
  const [addCategory, setAddCategory] = useState<WishlistCategory>("other");
  const [addPriority, setAddPriority] = useState<WishlistPriority>("medium");

  const visible = wishlist.filter(
    (w) => filterStatus === "all" || w.status === filterStatus,
  );

  const totalWanted = wishlist
    .filter((w) => w.status === "wanted")
    .reduce((s, w) => s + w.expectedAmountCents, 0);

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
    <>
      <Topbar
        name="wishlist."
        sub={
          totalWanted > 0
            ? `${formatAmount(totalWanted, "USD")} on deck.`
            : "tracked wants."
        }
      />

      {/* Add form */}
      <div
        style={{
          background: "var(--card,#fff)",
          borderRadius: 20,
          padding: "14px 16px",
          marginBottom: 16,
          boxShadow:
            "0 0 0 0.5px rgba(60,60,67,0.06), 0 8px 20px -12px rgba(20,20,30,0.08)",
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
            placeholder="item name"
            style={{
              flex: 1,
              fontSize: 14,
              fontWeight: 500,
              color: "var(--ink,#000)",
              background: "var(--inset,#F2F2F7)",
              border: "none",
              outline: "none",
              borderRadius: 10,
              padding: "9px 12px",
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
            step="1"
            style={{
              width: 72,
              fontSize: 14,
              fontWeight: 600,
              color: "var(--ink,#000)",
              background: "var(--inset,#F2F2F7)",
              border: "none",
              outline: "none",
              borderRadius: 10,
              padding: "9px 10px",
              fontFamily: "inherit",
              fontVariantNumeric: "tabular-nums",
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
            <option value="books">books</option>
            <option value="gear">gear</option>
            <option value="tools">tools</option>
            <option value="experiences">experiences</option>
            <option value="other">other</option>
          </select>
          <select
            value={addPriority}
            onChange={(e) => setAddPriority(e.target.value as WishlistPriority)}
            style={{
              width: 88,
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
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
          <button
            onClick={handleAdd}
            style={{
              padding: "7px 16px",
              borderRadius: 10,
              background: "linear-gradient(180deg,#1A1A20 0%,#000 100%)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              flexShrink: 0,
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.08) inset, 0 0 0 0.5px rgba(0,0,0,0.5)",
            }}
          >
            add
          </button>
        </div>
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {STATUS_FILTER.map((f) => {
          const active = filterStatus === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setFilterStatus(f.value)}
              style={{
                padding: "5px 14px",
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                background: active ? "var(--ink,#000)" : "var(--inset,#F2F2F7)",
                color: active ? "#fff" : "var(--label-2,#6E6E73)",
                boxShadow: active
                  ? "none"
                  : "inset 0 0 0 0.5px rgba(60,60,67,0.08)",
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* 2-col card grid */}
      {visible.length === 0 ? (
        <div
          style={{
            padding: "40px 0",
            textAlign: "center",
            fontSize: 14,
            fontWeight: 500,
            color: "var(--label,#8E8E93)",
            letterSpacing: "-0.01em",
          }}
        >
          nothing here. add something you want.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 10,
            paddingBottom: 110,
          }}
        >
          {visible.map((item) => {
            const ps = item.priority ? PRIORITY_STYLE[item.priority] : null;
            const isBought = item.status === "bought";
            return (
              <div
                key={item.id}
                style={{
                  background: "var(--card,#fff)",
                  borderRadius: 18,
                  padding: "14px 14px 12px",
                  boxShadow:
                    "0 0 0 0.5px rgba(60,60,67,0.06), 0 6px 16px -10px rgba(20,20,30,0.10)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  opacity: isBought ? 0.55 : 1,
                  position: "relative",
                }}
              >
                {/* Priority pill */}
                {ps && item.priority && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignSelf: "flex-start",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: ps.color,
                      background: ps.bg,
                      padding: "3px 8px",
                      borderRadius: 999,
                      boxShadow: ps.shadow,
                    }}
                  >
                    {item.priority}
                  </div>
                )}

                {/* Name */}
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "var(--ink,#000)",
                    letterSpacing: "-0.022em",
                    lineHeight: 1.25,
                    textDecoration: isBought ? "line-through" : "none",
                    textDecorationColor: "var(--label,#8E8E93)",
                  }}
                >
                  {item.name}
                </div>

                {/* Amount */}
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 800,
                    color: isBought
                      ? "var(--label,#8E8E93)"
                      : "var(--ink,#000)",
                    letterSpacing: "-0.03em",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {formatAmount(item.expectedAmountCents, item.currency)}
                </div>

                {/* Category */}
                {item.category && (
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--label,#8E8E93)",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {item.category}
                  </div>
                )}

                {/* Actions row */}
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    marginTop: 2,
                  }}
                >
                  {!isBought && (
                    <button
                      onClick={() => markWishlistBought(item.id)}
                      style={{
                        flex: 1,
                        padding: "6px 0",
                        borderRadius: 8,
                        background: "var(--inset,#F2F2F7)",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 11.5,
                        fontWeight: 600,
                        color: "var(--label-2,#6E6E73)",
                        fontFamily: "inherit",
                        boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.08)",
                      }}
                    >
                      got it
                    </button>
                  )}
                  <button
                    onClick={() => removeWishlistItem(item.id)}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
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
                      width={11}
                      height={11}
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
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
