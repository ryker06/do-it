"use client";

import Link from "next/link";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";

function fmt(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function daysUntil(isoDate: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(isoDate);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / 86400_000);
}

export default function MoneyPage() {
  const { transactions, subscriptions } = useDoIt();

  const now = new Date();
  const monthISO = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const thisMonth = transactions.filter((t) => t.dateISO.startsWith(monthISO));

  const totalIn = thisMonth
    .filter((t) => t.kind === "income")
    .reduce((a, t) => a + t.amountCents, 0);
  const totalOut = thisMonth
    .filter((t) => t.kind === "expense")
    .reduce((a, t) => a + t.amountCents, 0);
  const net = totalIn - totalOut;

  // Top 3 expense categories
  const expenseByCat: Record<string, number> = {};
  thisMonth
    .filter((t) => t.kind === "expense")
    .forEach((t) => {
      expenseByCat[t.category] =
        (expenseByCat[t.category] ?? 0) + t.amountCents;
    });
  const topExpenses = Object.entries(expenseByCat)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Top 3 income categories
  const incomeByCat: Record<string, number> = {};
  thisMonth
    .filter((t) => t.kind === "income")
    .forEach((t) => {
      incomeByCat[t.category] = (incomeByCat[t.category] ?? 0) + t.amountCents;
    });
  const topIncome = Object.entries(incomeByCat)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Next subscription
  const nextSub = [...subscriptions].sort(
    (a, b) =>
      new Date(a.nextChargeISO).getTime() - new Date(b.nextChargeISO).getTime(),
  )[0];

  return (
    <>
      <Topbar name="money." sub="this month's picture." />

      {/* 3-cell in/out/net header */}
      <div
        style={{
          background: "var(--card,#fff)",
          borderRadius: 20,
          padding: "18px 18px",
          marginBottom: 16,
          boxShadow:
            "0 0 0 0.5px rgba(60,60,67,0.06), 0 8px 20px -12px rgba(20,20,30,0.08)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 0,
        }}
      >
        {[
          { label: "in", value: totalIn, color: "#1F7A2B" },
          { label: "out", value: totalOut, color: "#C41E3A" },
          {
            label: "net",
            value: net,
            color: net >= 0 ? "#1F7A2B" : "#C41E3A",
            prefix: net >= 0 ? "+" : "",
          },
        ].map((cell, i) => (
          <div
            key={cell.label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingLeft: i > 0 ? 12 : 0,
              borderLeft:
                i > 0
                  ? "0.5px solid var(--hairline,rgba(60,60,67,0.10))"
                  : undefined,
              gap: 2,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--label,#8E8E93)",
              }}
            >
              {cell.label}
            </div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: cell.color,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {cell.prefix ?? ""}
              {fmt(cell.value)}
            </div>
          </div>
        ))}
      </div>

      {/* Three cards */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          paddingBottom: 110,
        }}
      >
        {/* Subscriptions */}
        <Link href="/money/subscriptions" style={{ textDecoration: "none" }}>
          <div
            style={{
              background: "var(--card,#fff)",
              borderRadius: 20,
              padding: "16px 18px",
              boxShadow:
                "0 0 0 0.5px rgba(60,60,67,0.06), 0 1px 1px rgba(20,20,30,0.02), 0 8px 20px -12px rgba(20,20,30,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--label,#8E8E93)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                subscriptions
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--blue,#007AFF)",
                }}
              >
                {subscriptions.length} active →
              </span>
            </div>
            {nextSub && (
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--ink-2,#1C1C1E)",
                  letterSpacing: "-0.012em",
                }}
              >
                {nextSub.name} · {fmt(nextSub.amountCents, nextSub.currency)} —
                renews in {daysUntil(nextSub.nextChargeISO)} days
              </div>
            )}
          </div>
        </Link>

        {/* Outflow */}
        <Link href="/money/expenses" style={{ textDecoration: "none" }}>
          <div
            style={{
              background: "var(--card,#fff)",
              borderRadius: 20,
              padding: "16px 18px",
              boxShadow:
                "0 0 0 0.5px rgba(60,60,67,0.06), 0 1px 1px rgba(20,20,30,0.02), 0 8px 20px -12px rgba(20,20,30,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--label,#8E8E93)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                outflow
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--blue,#007AFF)",
                }}
              >
                view all →
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {topExpenses.map(([cat, cents]) => (
                <div
                  key={cat}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--ink-2,#1C1C1E)",
                      letterSpacing: "-0.012em",
                      textTransform: "capitalize",
                    }}
                  >
                    {cat}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--ink,#000)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {fmt(cents)}
                  </span>
                </div>
              ))}
              {topExpenses.length === 0 && (
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--label,#8E8E93)",
                  }}
                >
                  quiet this month.
                </div>
              )}
            </div>
          </div>
        </Link>

        {/* Inflow */}
        <Link href="/money/income" style={{ textDecoration: "none" }}>
          <div
            style={{
              background: "var(--card,#fff)",
              borderRadius: 20,
              padding: "16px 18px",
              boxShadow:
                "0 0 0 0.5px rgba(60,60,67,0.06), 0 1px 1px rgba(20,20,30,0.02), 0 8px 20px -12px rgba(20,20,30,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--label,#8E8E93)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                inflow
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--blue,#007AFF)",
                }}
              >
                view all →
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {topIncome.map(([cat, cents]) => (
                <div
                  key={cat}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--ink-2,#1C1C1E)",
                      letterSpacing: "-0.012em",
                      textTransform: "capitalize",
                    }}
                  >
                    {cat}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--ink,#000)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {fmt(cents)}
                  </span>
                </div>
              ))}
              {topIncome.length === 0 && (
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--label,#8E8E93)",
                  }}
                >
                  quiet this month.
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}
