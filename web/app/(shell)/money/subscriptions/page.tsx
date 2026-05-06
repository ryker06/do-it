"use client";

import { useState } from "react";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
import type { CadenceMoney } from "@/lib/types";

function fmt(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

function daysUntil(isoDate: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(isoDate);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / 86400_000);
}

function cadenceLabel(c: CadenceMoney) {
  if (c === "monthly") return "/ mo";
  if (c === "yearly") return "/ yr";
  return "/ wk";
}

export default function SubscriptionsPage() {
  const { subscriptions, addSubscription, removeSubscription } = useDoIt();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [cadence, setCadence] = useState<CadenceMoney>("monthly");
  const [nextCharge, setNextCharge] = useState("");
  const [category, setCategory] = useState("");
  const [adding, setAdding] = useState(false);

  const sorted = [...subscriptions].sort(
    (a, b) =>
      new Date(a.nextChargeISO).getTime() - new Date(b.nextChargeISO).getTime(),
  );

  function handleAdd() {
    const n = name.trim();
    const a = parseFloat(amount);
    if (!n || isNaN(a) || !nextCharge) return;
    addSubscription({
      name: n,
      amountCents: Math.round(a * 100),
      currency: "USD",
      cadence,
      nextChargeISO: nextCharge,
      category: category.trim() || "other",
    });
    setName("");
    setAmount("");
    setNextCharge("");
    setCategory("");
    setAdding(false);
  }

  return (
    <>
      <Topbar name="Subscriptions" sub="what renews next" />

      {/* Add strip */}
      {adding ? (
        <div
          style={{
            background: "var(--card,#fff)",
            borderRadius: 20,
            padding: "14px 16px",
            marginBottom: 18,
            boxShadow:
              "0 0 0 0.5px rgba(60,60,67,0.06), 0 8px 20px -12px rgba(20,20,30,0.08)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <input
            placeholder="Name (e.g. Spotify)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <input
              placeholder="Amount (e.g. 9.99)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              style={{ ...inputStyle, flex: 1 }}
            />
            <select
              value={cadence}
              onChange={(e) => setCadence(e.target.value as CadenceMoney)}
              style={{ ...inputStyle, width: 110 }}
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <input
            placeholder="Next charge (YYYY-MM-DD)"
            value={nextCharge}
            onChange={(e) => setNextCharge(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Category (e.g. software)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={inputStyle}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleAdd} style={primaryBtn}>
              Save
            </button>
            <button onClick={() => setAdding(false)} style={ghostBtn}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} style={addStripBtn}>
          + add subscription
        </button>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          paddingBottom: 110,
        }}
      >
        {sorted.map((sub) => {
          const days = daysUntil(sub.nextChargeISO);
          const phrase =
            days === 0
              ? "renews today"
              : days === 1
                ? "renews tomorrow"
                : `renews in ${days} days`;
          return (
            <div
              key={sub.id}
              style={{
                background: "var(--card,#fff)",
                borderRadius: 18,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow:
                  "0 0 0 0.5px rgba(60,60,67,0.05), 0 1px 1px rgba(20,20,30,0.02), 0 6px 16px -12px rgba(20,20,30,0.08)",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--ink,#000)",
                    letterSpacing: "-0.016em",
                  }}
                >
                  {sub.name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--label,#8E8E93)",
                    marginTop: 2,
                    letterSpacing: "-0.008em",
                  }}
                >
                  {phrase} · {sub.category}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--ink,#000)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {fmt(sub.amountCents, sub.currency)}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: "var(--label,#8E8E93)",
                    }}
                  >
                    {cadenceLabel(sub.cadence)}
                  </div>
                </div>
                <button
                  onClick={() => removeSubscription(sub.id)}
                  aria-label="Remove"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "var(--inset,#F2F2F7)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--label-2,#6E6E73)",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width={12}
                    height={12}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

const inputStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: "var(--ink-2,#1C1C1E)",
  background: "var(--inset,#F2F2F7)",
  border: "none",
  borderRadius: 12,
  padding: "10px 12px",
  outline: "none",
  fontFamily: "inherit",
  width: "100%",
  boxSizing: "border-box",
};

const primaryBtn: React.CSSProperties = {
  flex: 1,
  padding: "10px 0",
  borderRadius: 12,
  background: "linear-gradient(180deg,#1A1A20 0%,#000 100%)",
  color: "#fff",
  fontSize: 14,
  fontWeight: 600,
  border: "none",
  cursor: "pointer",
  fontFamily: "inherit",
};

const ghostBtn: React.CSSProperties = {
  flex: 1,
  padding: "10px 0",
  borderRadius: 12,
  background: "var(--inset,#F2F2F7)",
  color: "var(--label-2,#6E6E73)",
  fontSize: 14,
  fontWeight: 600,
  border: "none",
  cursor: "pointer",
  fontFamily: "inherit",
};

const addStripBtn: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "12px 16px",
  borderRadius: 16,
  background: "var(--card,#fff)",
  color: "var(--blue,#007AFF)",
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: "-0.012em",
  border: "none",
  cursor: "pointer",
  fontFamily: "inherit",
  textAlign: "left",
  marginBottom: 18,
  boxShadow: "0 0 0 0.5px rgba(60,60,67,0.06), 0 1px 1px rgba(20,20,30,0.02)",
};
