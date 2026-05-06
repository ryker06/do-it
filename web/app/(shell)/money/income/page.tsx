"use client";

import { useState } from "react";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";

function fmt(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export default function IncomePage() {
  const { transactions, addTransaction, removeTransaction } = useDoIt();

  const now = new Date();
  const monthISO = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const income = transactions
    .filter((t) => t.kind === "income" && t.dateISO.startsWith(monthISO))
    .sort((a, b) => b.dateISO.localeCompare(a.dateISO));

  const grouped: Record<string, typeof income> = {};
  for (const t of income) {
    if (!grouped[t.category]) grouped[t.category] = [];
    grouped[t.category].push(t);
  }

  const [note, setNote] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [adding, setAdding] = useState(false);

  function handleAdd() {
    const a = parseFloat(amount);
    if (isNaN(a) || a <= 0) return;
    addTransaction({
      kind: "income",
      amountCents: Math.round(a * 100),
      currency: "USD",
      dateISO: new Date().toISOString().slice(0, 10),
      category: category.trim() || "other",
      note: note.trim() || undefined,
      source: "manual",
    });
    setNote("");
    setAmount("");
    setCategory("");
    setAdding(false);
  }

  return (
    <>
      <Topbar name="Inflow" sub="where it comes in" />

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
            placeholder="Amount (e.g. 2500.00)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            style={inputStyle}
          />
          <input
            placeholder="Category (e.g. freelance)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
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
          + add income
        </button>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
          paddingBottom: 110,
        }}
      >
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: "var(--label,#8E8E93)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 8,
                paddingLeft: 4,
              }}
            >
              {cat}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {items.map((t) => (
                <div
                  key={t.id}
                  style={{
                    background: "var(--card,#fff)",
                    borderRadius: 16,
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow:
                      "0 0 0 0.5px rgba(60,60,67,0.05), 0 1px 1px rgba(20,20,30,0.02)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: "var(--ink-2,#1C1C1E)",
                        letterSpacing: "-0.012em",
                      }}
                    >
                      {t.note ?? t.category}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: "var(--label,#8E8E93)",
                        marginTop: 2,
                      }}
                    >
                      {t.dateISO}
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "var(--ink,#000)",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {fmt(t.amountCents, t.currency)}
                    </span>
                    <button
                      onClick={() => removeTransaction(t.id)}
                      aria-label="Remove"
                      style={{
                        width: 26,
                        height: 26,
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
                        width={11}
                        height={11}
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
              ))}
            </div>
          </div>
        ))}
        {income.length === 0 && (
          <div
            style={{
              background: "var(--card,#fff)",
              borderRadius: 18,
              padding: "28px 16px",
              textAlign: "center",
              boxShadow: "0 0 0 0.5px rgba(60,60,67,0.05)",
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "var(--label,#8E8E93)",
              }}
            >
              Quiet this month
            </div>
          </div>
        )}
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
