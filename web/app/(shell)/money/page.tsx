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
      <Topbar name="Money" sub="this month's picture" />

      {/* Overview sentence */}
      <div
        style={{
          background: "var(--card,#fff)",
          borderRadius: 20,
          padding: "18px 18px",
          marginBottom: 18,
          boxShadow:
            "0 0 0 0.5px rgba(60,60,67,0.06), 0 1px 1px rgba(20,20,30,0.02), 0 8px 20px -12px rgba(20,20,30,0.08)",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--label,#8E8E93)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          This month
        </div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: "var(--ink-2,#1C1C1E)",
            letterSpacing: "-0.014em",
            lineHeight: 1.6,
          }}
        >
          in{" "}
          <span style={{ fontWeight: 700, color: "var(--ink,#000)" }}>
            {fmt(totalIn)}
          </span>{" "}
          · out{" "}
          <span style={{ fontWeight: 700, color: "var(--ink,#000)" }}>
            {fmt(totalOut)}
          </span>{" "}
          · net{" "}
          <span style={{ fontWeight: 700, color: "var(--ink,#000)" }}>
            {net >= 0 ? "+" : ""}
            {fmt(net)}
          </span>
        </div>
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
                Subscriptions
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
                Outflow
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--blue,#007AFF)",
                }}
              >
                View all →
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
                  Quiet this month
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
                Inflow
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--blue,#007AFF)",
                }}
              >
                View all →
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
                  Quiet this month
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}
