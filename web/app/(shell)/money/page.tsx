"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
import { useIsDesktop } from "@/lib/useIsDesktop";
import type { DomainId, Transaction } from "@/lib/types";

function fmt(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

type TabId = "subscriptions" | "outflow" | "inflow" | "all";

const TABS: { id: TabId; label: string }[] = [
  { id: "subscriptions", label: "subscriptions" },
  { id: "outflow", label: "outflow" },
  { id: "inflow", label: "inflow" },
  { id: "all", label: "all" },
];

const DOMAIN_TINT: Record<DomainId, { bg: string; color: string }> = {
  business: { bg: "#E2EEFF", color: "#1748A8" },
  religion: { bg: "#E2F4E6", color: "#1F5C2C" },
  learning: { bg: "#FFE0E8", color: "#7A2A3C" },
  fitness: { bg: "#FFD9E0", color: "#7A2A3C" },
  home: { bg: "#EAEFF3", color: "#36475A" },
  food: { bg: "#FFF0DD", color: "#7A4A1A" },
};

function daysUntil(isoDate: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(isoDate);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / 86400_000);
}

function HeroStats({
  totalIn,
  totalOut,
  net,
  now,
}: {
  totalIn: number;
  totalOut: number;
  net: number;
  now: Date;
}) {
  return (
    <div
      style={{
        margin: "0 0 16px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 8,
      }}
    >
      {/* IN */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 20,
          padding: "14px 14px 16px",
          background: "linear-gradient(180deg,#E2F4E6 0%,#CDEBD3 100%)",
          boxShadow:
            "0 0 0 0.5px rgba(60,60,67,0.06),0 1px 1px rgba(20,20,30,0.02),0 12px 28px -16px rgba(20,20,30,0.10),0 28px 50px -32px rgba(20,20,30,0.14)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: 124,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 20% 28%,rgba(255,255,255,0.55) 1.5px,transparent 2px)",
            backgroundSize: "14px 14px",
            opacity: 0.3,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#1F5C2C",
            position: "relative",
          }}
        >
          in
        </div>
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#0B0B0F",
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1,
              marginTop: 8,
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#6E6E73",
                marginRight: 1,
              }}
            >
              $
            </span>
            {fmt(totalIn).replace(/[^0-9,]/g, "")}
          </div>
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: "#1F5C2C",
              marginTop: 6,
              letterSpacing: "-0.005em",
            }}
          >
            this month
          </div>
        </div>
      </div>

      {/* OUT */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 20,
          padding: "14px 14px 16px",
          background: "linear-gradient(180deg,#FFE7EC 0%,#FFD9E0 100%)",
          boxShadow:
            "0 0 0 0.5px rgba(60,60,67,0.06),0 1px 1px rgba(20,20,30,0.02),0 12px 28px -16px rgba(20,20,30,0.10),0 28px 50px -32px rgba(20,20,30,0.14)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: 124,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 20% 28%,rgba(255,255,255,0.55) 1.5px,transparent 2px)",
            backgroundSize: "14px 14px",
            opacity: 0.3,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#7A2A3C",
            position: "relative",
          }}
        >
          out
        </div>
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#0B0B0F",
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1,
              marginTop: 8,
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#6E6E73",
                marginRight: 1,
              }}
            >
              $
            </span>
            {fmt(totalOut).replace(/[^0-9,]/g, "")}
          </div>
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: "#7A2A3C",
              marginTop: 6,
              letterSpacing: "-0.005em",
            }}
          >
            spending
          </div>
        </div>
      </div>

      {/* NET */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 20,
          padding: "14px 14px 16px",
          background: "#FFFFFF",
          boxShadow:
            "0 0 0 0.5px rgba(60,60,67,0.06),0 2px 3px rgba(20,20,30,0.04),0 18px 38px -18px rgba(20,20,30,0.18),0 36px 64px -32px rgba(20,20,30,0.18)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: 124,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 14,
            right: 14,
            bottom: -6,
            height: 8,
            borderRadius: "0 0 14px 14px",
            background: "#FBFAF8",
            boxShadow: "0 0 0 0.5px rgba(60,60,67,0.10)",
            zIndex: -1,
          }}
        />
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#8E8E93",
          }}
        >
          net
        </div>
        <div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1,
              marginTop: 8,
              color: net >= 0 ? "#1F5C2C" : "#7A2A3C",
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#6E6E73",
                marginRight: 1,
              }}
            >
              {net >= 0 ? "+" : "-"}$
            </span>
            {fmt(Math.abs(net)).replace(/[^0-9,]/g, "")}
          </div>
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: net >= 0 ? "#1F5C2C" : "#7A2A3C",
              marginTop: 6,
              letterSpacing: "-0.005em",
            }}
          >
            {net >= 0 ? "running ahead" : "running quiet"}
          </div>
        </div>
      </div>
    </div>
  );
}

function SubscriptionList() {
  const { subscriptions } = useDoIt();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {subscriptions.length === 0 && (
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#8E8E93",
            textAlign: "center",
            padding: "32px 0",
          }}
        >
          nothing yet · add subscriptions
        </div>
      )}
      {[...subscriptions]
        .sort(
          (a, b) =>
            new Date(a.nextChargeISO).getTime() -
            new Date(b.nextChargeISO).getTime(),
        )
        .map((sub) => {
          const days = daysUntil(sub.nextChargeISO);
          const amtMonthly =
            sub.cadence === "yearly"
              ? Math.round(sub.amountCents / 12)
              : sub.cadence === "weekly"
                ? sub.amountCents * 4
                : sub.amountCents;
          return (
            <div
              key={sub.id}
              style={{
                display: "grid",
                gridTemplateColumns: "38px 1fr auto",
                gap: 12,
                alignItems: "center",
                padding: "12px 4px",
                borderBottom: "0.5px solid rgba(60,60,67,0.06)",
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: "#FBFAF8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  lineHeight: 1,
                  boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
                  flexShrink: 0,
                }}
              >
                📦
              </div>
              <div>
                <div
                  style={{
                    fontSize: 14.5,
                    fontWeight: 700,
                    color: "#0B0B0F",
                    letterSpacing: "-0.012em",
                  }}
                >
                  {sub.name}
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: "#8E8E93",
                    fontWeight: 600,
                    marginTop: 2,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {sub.cadence} ·{" "}
                  {days <= 0
                    ? "due today"
                    : days === 1
                      ? "due tomorrow"
                      : `${days}d`}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: "#0B0B0F",
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "-0.012em",
                  }}
                >
                  {fmt(sub.amountCents, sub.currency)}
                </div>
                {sub.cadence !== "monthly" && (
                  <div
                    style={{
                      fontSize: 10.5,
                      color: "#8E8E93",
                      fontWeight: 600,
                      marginTop: 2,
                    }}
                  >
                    {fmt(amtMonthly)}/mo
                  </div>
                )}
              </div>
            </div>
          );
        })}
      <Link href="/money/subscriptions" style={{ textDecoration: "none" }}>
        <div
          style={{
            textAlign: "center",
            padding: "14px 0",
            fontSize: 13,
            fontWeight: 600,
            color: "#0A84FF",
            letterSpacing: "-0.005em",
          }}
        >
          manage subscriptions →
        </div>
      </Link>
    </div>
  );
}

function TxList({ txs, emptyText }: { txs: Transaction[]; emptyText: string }) {
  const sorted = [...txs].sort((a, b) => b.dateISO.localeCompare(a.dateISO));

  if (sorted.length === 0) {
    return (
      <div
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: "#8E8E93",
          textAlign: "center",
          padding: "32px 0",
        }}
      >
        {emptyText}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {sorted.map((tx) => {
        const isIncome = tx.kind === "income";
        const domainTint = tx.domain ? DOMAIN_TINT[tx.domain] : null;
        return (
          <div
            key={tx.id}
            style={{
              display: "grid",
              gridTemplateColumns: "38px 1fr auto",
              gap: 12,
              alignItems: "center",
              padding: "12px 4px",
              borderBottom: "0.5px solid rgba(60,60,67,0.06)",
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: isIncome ? "#E2F4E6" : "#FFE7EC",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                lineHeight: 1,
                boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.08)",
                flexShrink: 0,
              }}
            >
              {isIncome ? "↑" : "↓"}
            </div>
            <div>
              <div
                style={{
                  fontSize: 14.5,
                  fontWeight: 700,
                  color: "#0B0B0F",
                  letterSpacing: "-0.012em",
                }}
              >
                {tx.category}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 3,
                }}
              >
                <span
                  style={{
                    fontSize: 11.5,
                    color: "#8E8E93",
                    fontWeight: 600,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {tx.dateISO}
                </span>
                {domainTint && tx.domain && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: domainTint.bg,
                      color: domainTint.color,
                    }}
                  >
                    {tx.domain}
                  </span>
                )}
              </div>
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: isIncome ? "#1F5C2C" : "#0B0B0F",
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.012em",
              }}
            >
              {isIncome ? "+" : ""}
              {fmt(tx.amountCents, tx.currency)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TabContent({
  tab,
  thisMonth,
}: {
  tab: TabId;
  thisMonth: Transaction[];
}) {
  if (tab === "subscriptions") return <SubscriptionList />;
  if (tab === "outflow")
    return (
      <TxList
        txs={thisMonth.filter((t) => t.kind === "expense")}
        emptyText="no expenses this month"
      />
    );
  if (tab === "inflow")
    return (
      <TxList
        txs={thisMonth.filter((t) => t.kind === "income")}
        emptyText="no income logged this month"
      />
    );
  return <TxList txs={thisMonth} emptyText="no transactions this month" />;
}

function MoneyInner() {
  const { transactions } = useDoIt();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDesktop = useIsDesktop();

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

  // URL param for desktop, local state for mobile
  const urlTab = searchParams.get("tab") as TabId | null;
  const [mobileTab, setMobileTab] = useState<TabId>("subscriptions");

  const activeTab: TabId = isDesktop ? (urlTab ?? "subscriptions") : mobileTab;

  function selectTab(id: TabId) {
    if (isDesktop) {
      router.push(`/money?tab=${id}`, { scroll: false });
    } else {
      setMobileTab(id);
    }
  }

  const heroStats = (
    <HeroStats totalIn={totalIn} totalOut={totalOut} net={net} now={now} />
  );

  if (isDesktop) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100dvh - 44px)",
          overflow: "hidden",
        }}
      >
        {/* Hero stats — full width at top */}
        <div style={{ padding: "20px 24px 0", flexShrink: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              padding: "4px 0 12px",
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#0B0B0F",
                lineHeight: 1,
              }}
            >
              money
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 12, color: "#8E8E93", fontWeight: 600 }}>
                {now.toLocaleString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <Link href="/money/expenses" style={{ textDecoration: "none" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "#0B0B0F",
                    color: "#fff",
                    borderRadius: 999,
                    padding: "7px 12px 7px 10px",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "-0.012em",
                    boxShadow:
                      "0 1px 0 rgba(255,255,255,0.08) inset,0 0 0 0.5px rgba(0,0,0,0.5),0 8px 20px -8px rgba(10,10,20,0.4)",
                  }}
                >
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.16)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                    }}
                  >
                    +
                  </span>
                  add transaction
                </div>
              </Link>
            </div>
          </div>
          {heroStats}
        </div>

        {/* Master/detail below hero */}
        <div className="md-layout" style={{ flex: 1, marginTop: 0 }}>
          {/* LEFT — tab rail 320px */}
          <div className="md-list" style={{ width: 320, padding: "12px 0" }}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => selectTab(tab.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: isActive ? "calc(100% - 16px)" : "100%",
                    padding: "10px 16px",
                    background: isActive ? "var(--ink,#0B0B0F)" : "transparent",
                    color: isActive ? "#fff" : "#0B0B0F",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: 14,
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: "-0.012em",
                    borderRadius: isActive ? 10 : 0,
                    margin: isActive ? "0 8px" : "0",
                    textAlign: "left",
                    transition: "background 0.15s",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* RIGHT — content */}
          <div className="md-detail" style={{ padding: "16px 24px" }}>
            <TabContent tab={activeTab} thisMonth={thisMonth} />
          </div>
        </div>
      </div>
    );
  }

  // Mobile layout — unchanged
  return (
    <>
      <Topbar name="money." sub="this month's picture." />

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          padding: "4px 0 6px",
        }}
      >
        <div
          style={{
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#0B0B0F",
            lineHeight: 1,
          }}
        >
          money
        </div>
        <div style={{ fontSize: 12, color: "#8E8E93", fontWeight: 600 }}>
          {now.toLocaleString("en-US", { month: "long", year: "numeric" })}
        </div>
      </div>

      <Link href="/money/expenses" style={{ textDecoration: "none" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#0B0B0F",
            color: "#fff",
            borderRadius: 999,
            padding: "10px 14px 10px 12px",
            fontSize: 13.5,
            fontWeight: 700,
            letterSpacing: "-0.012em",
            marginBottom: 16,
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.08) inset,0 0 0 0.5px rgba(0,0,0,0.5),0 18px 38px -18px rgba(10,10,20,0.55)",
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.16)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            +
          </div>
          add transaction
        </div>
      </Link>

      {heroStats}

      {/* ink-underline tab toggle */}
      <div
        style={{
          display: "flex",
          gap: 0,
          borderBottom: "0.5px solid rgba(60,60,67,0.10)",
          marginBottom: 16,
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => selectTab(tab.id)}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "10px 0 14px",
              fontSize: 12.5,
              fontWeight: 700,
              letterSpacing: "-0.012em",
              color: activeTab === tab.id ? "#0B0B0F" : "#8E8E93",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              position: "relative",
            }}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div
                style={{
                  position: "absolute",
                  left: "18%",
                  right: "18%",
                  bottom: -0.5,
                  height: 2,
                  background: "#0B0B0F",
                  borderRadius: 2,
                }}
              />
            )}
          </button>
        ))}
      </div>

      <div style={{ paddingBottom: 110 }}>
        <TabContent tab={activeTab} thisMonth={thisMonth} />
      </div>
    </>
  );
}

export default function MoneyPage() {
  return (
    <Suspense>
      <MoneyInner />
    </Suspense>
  );
}
