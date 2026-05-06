"use client";

import Link from "next/link";

type Surface = {
  href: string;
  name: string;
  description: string;
};

const SURFACES: Surface[] = [
  {
    href: "/visions",
    name: "Visions",
    description: "What you are building toward",
  },
  {
    href: "/routines",
    name: "Routines",
    description: "Your daily and weekly rhythms",
  },
  {
    href: "/meal",
    name: "Meal",
    description: "Food blocks and shopping derivation",
  },
  { href: "/inbox", name: "Inbox", description: "Unscheduled captured blocks" },
  {
    href: "/money",
    name: "Money",
    description: "Subscriptions, expenses, income",
  },
  {
    href: "/reflect",
    name: "Reflect",
    description: "End-of-day prompts and entries",
  },
  {
    href: "/state",
    name: "State",
    description: "How you feel right now — one tap",
  },
  {
    href: "/insights",
    name: "Insights",
    description: "Quotes and lessons from learning",
  },
  {
    href: "/review",
    name: "Review",
    description: "Weekly checkpoint and one-pager",
  },
  { href: "/people", name: "People", description: "Calm relationship surface" },
  {
    href: "/wishlist",
    name: "Wishlist",
    description: "Things you want, priced and tracked",
  },
  {
    href: "/yesterday",
    name: "Yesterday",
    description: "What carried over from the day before",
  },
];

export default function MorePage() {
  return (
    <div style={{ position: "relative", zIndex: 2 }}>
      <div style={{ padding: "0 4px", marginBottom: 18 }}>
        <div className="greet-day">Surfaces</div>
        <div className="greet-name">
          More <span className="sub">· everything else</span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        {SURFACES.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              padding: "14px 14px",
              borderRadius: 18,
              background: "var(--card,#fff)",
              boxShadow:
                "0 0 0 0.5px rgba(60,60,67,0.07), 0 1px 1px rgba(20,20,30,0.02), 0 6px 16px -12px rgba(20,20,30,0.10)",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "var(--ink,#000)",
                letterSpacing: "-0.020em",
              }}
            >
              {s.name}
            </div>
            <div
              style={{
                fontSize: 11.5,
                fontWeight: 500,
                color: "var(--label-2,#6E6E73)",
                letterSpacing: "-0.005em",
                lineHeight: 1.3,
              }}
            >
              {s.description}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
