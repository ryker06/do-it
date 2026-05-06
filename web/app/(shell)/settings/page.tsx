"use client";

import { useRouter } from "next/navigation";
import { useDoIt } from "@/lib/store";
import { DomainGlyph } from "@/components/icons";

export default function SettingsPage() {
  const router = useRouter();
  const { domains, routines } = useDoIt();

  const DAYS = ["M", "T", "W", "T", "F", "S", "S"] as const;
  const WEEKDAYS: Record<string, number[]> = {
    r1: [0, 1, 2, 3, 4],
    r2: [5],
    r3: [4],
    r4: [6],
  };

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
          justifyContent: "space-between",
          padding: "0 4px",
          marginBottom: 14,
        }}
      >
        <div>
          <div className="greet-day">Settings</div>
          <div className="greet-name">
            Settings <span className="sub">· your system</span>
          </div>
        </div>
        <button
          onClick={() => router.back()}
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "var(--blue, #007aff)",
            letterSpacing: "-0.018em",
            padding: "6px 4px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Done
        </button>
      </div>

      {/* scroll */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          paddingBottom: 110,
          WebkitMaskImage:
            "linear-gradient(180deg, #000 0%, #000 92%, transparent 100%)",
          maskImage:
            "linear-gradient(180deg, #000 0%, #000 92%, transparent 100%)",
        }}
      >
        {/* PROFILE HERO */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "6px 0 20px",
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: "linear-gradient(180deg,#EAEAEF 0%, #DCDCE4 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0 0 0 0.5px rgba(60,60,67,0.10), 0 1px 1px rgba(20,20,30,0.02), 0 14px 30px -16px rgba(20,20,30,0.18), inset 0 1px 0 rgba(255,255,255,0.95)",
              position: "relative",
            }}
          >
            <img
              src="https://www.tapback.co/api/avatar/jay.webp?color=7"
              alt="Adam"
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                display: "block",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -2,
                right: -2,
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  "0 0 0 0.5px rgba(60,60,67,0.10), 0 2px 6px rgba(20,20,30,0.12)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width={14}
                height={14}
                fill="none"
                stroke="var(--ink-2,#1c1c1e)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 20h4l10-10-4-4L4 16v4z" />
                <path d="M14 6l4 4" />
              </svg>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 22,
              fontWeight: 700,
              color: "var(--ink,#000)",
              letterSpacing: "-0.03em",
            }}
          >
            Adam Lashin
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: 12.5,
              fontWeight: 500,
              color: "var(--label-2,#6e6e73)",
              letterSpacing: "-0.005em",
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width={11}
              height={11}
              fill="none"
              stroke="var(--label-2,#6e6e73)"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" />
              <circle cx="12" cy="10" r="2.4" />
            </svg>
            Kiel, Germany
          </div>
        </div>

        {/* PRAYER */}
        <SettingsSection label="Prayer" meta="5 daily anchors">
          <SettingsGroup>
            <SettingsRow
              iconBg="green"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  width={14}
                  height={14}
                  fill="none"
                  stroke="#fff"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16.5 14.8a6.4 6.4 0 11-7.3-9.6 5.2 5.2 0 007.3 9.6z" />
                </svg>
              }
              title="Calculation method"
              value="Muslim World League"
              hasChev
            />
            <SettingsRow
              iconBg="steel"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  width={14}
                  height={14}
                  fill="none"
                  stroke="#fff"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3l9 4.5v6c0 4.5-3.5 7.5-9 9.5-5.5-2-9-5-9-9.5v-6L12 3z" />
                </svg>
              }
              title="Madhab · Asr"
              value="Hanbali · standard"
              hasChev
            />
            <SettingsRow
              iconBg="dark"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  width={14}
                  height={14}
                  fill="none"
                  stroke="#fff"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="4" y="6" width="16" height="14" rx="2" />
                  <path d="M4 12h16" />
                  <path d="M9 3v4M15 3v4" />
                </svg>
              }
              title="Hard-anchor blocks"
              sub="Day plan respects prayer times"
              toggle
              toggleOn
            />
            <SettingsRow
              iconBg="blue"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  width={14}
                  height={14}
                  fill="none"
                  stroke="#fff"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 8a6 6 0 0112 0v4l2 4H4l2-4V8z" />
                  <path d="M10 19a2 2 0 004 0" />
                </svg>
              }
              title="5-min warning"
              sub="Soft heads-up before each prayer"
              toggle
              toggleOn
            />
          </SettingsGroup>
        </SettingsSection>

        {/* DOMAINS */}
        <SettingsSection label="Domains" meta={`${domains.length} active`}>
          <SettingsGroup>
            {domains.map((d) => (
              <button
                key={d.id}
                onClick={() => router.push(`/settings/domains/${d.id}`)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  minHeight: 46,
                  position: "relative",
                  width: "100%",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div
                  className={`ddisc sm ${d.id}`}
                  style={{ width: 30, height: 30 }}
                >
                  <DomainGlyph id={d.id} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14.5,
                      fontWeight: 500,
                      color: "var(--ink,#000)",
                      letterSpacing: "-0.018em",
                    }}
                  >
                    {d.name}
                  </div>
                </div>
                <ChevRight />
              </button>
            ))}
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                minHeight: 46,
                width: "100%",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "var(--inset,#f2f2f7)",
                  boxShadow:
                    "inset 0 0 0 0.5px var(--hairline-2,rgba(60,60,67,0.06))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width={16}
                  height={16}
                  fill="none"
                  stroke="var(--label-2,#6e6e73)"
                  strokeWidth={2}
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <div
                style={{
                  fontSize: 14.5,
                  fontWeight: 500,
                  color: "var(--label-2,#6e6e73)",
                  letterSpacing: "-0.018em",
                }}
              >
                Add domain
              </div>
              <ChevRight />
            </button>
          </SettingsGroup>
        </SettingsSection>

        {/* ROUTINES */}
        <SettingsSection label="Routines" meta={`${routines.length} templates`}>
          <SettingsGroup>
            {routines.map((r) => {
              const days = DAYS.map((d, i) => ({
                label: d,
                on: (WEEKDAYS[r.id] ?? []).includes(i),
              }));
              return (
                <button
                  key={r.id}
                  onClick={() => router.push(`/routines/${r.id}`)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    minHeight: 46,
                    position: "relative",
                    width: "100%",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 7,
                      background:
                        "linear-gradient(180deg,#2A2A30 0%, #0D0D12 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width={14}
                      height={14}
                      fill="none"
                      stroke="#fff"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 7v5l3 2" />
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                      fontSize: 14.5,
                      fontWeight: 500,
                      color: "var(--ink,#000)",
                      letterSpacing: "-0.018em",
                    }}
                  >
                    {r.name}
                  </div>
                  <div style={{ display: "flex", gap: 3, marginRight: 8 }}>
                    {days.map((day, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: 9.5,
                          fontWeight: 700,
                          color: day.on ? "#fff" : "var(--label-2,#6e6e73)",
                          letterSpacing: "0.04em",
                          width: 18,
                          height: 18,
                          borderRadius: 5,
                          background: day.on
                            ? "#0A0A0F"
                            : "var(--inset,#f2f2f7)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: day.on
                            ? "none"
                            : "inset 0 0 0 0.5px var(--hairline-2,rgba(60,60,67,0.06))",
                        }}
                      >
                        {day.label}
                      </span>
                    ))}
                  </div>
                  <ChevRight />
                </button>
              );
            })}
            <button
              onClick={() => router.push("/routines")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                minHeight: 46,
                width: "100%",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 7,
                  background: "var(--inset,#f2f2f7)",
                  boxShadow:
                    "inset 0 0 0 0.5px var(--hairline-2,rgba(60,60,67,0.06))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width={14}
                  height={14}
                  fill="none"
                  stroke="var(--label-2,#6e6e73)"
                  strokeWidth={2}
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <div
                style={{
                  fontSize: 14.5,
                  fontWeight: 500,
                  color: "var(--label-2,#6e6e73)",
                  letterSpacing: "-0.018em",
                }}
              >
                Add routine
              </div>
              <ChevRight />
            </button>
          </SettingsGroup>
        </SettingsSection>

        {/* NOTIFICATIONS */}
        <SettingsSection label="Notifications">
          <SettingsGroup>
            <SettingsRow
              iconBg="blue"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  width={14}
                  height={14}
                  fill="none"
                  stroke="#fff"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              }
              title="Block start"
              sub="Ping when an UP NEXT begins"
              toggle
              toggleOn
            />
            <SettingsRow
              iconBg="green"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  width={14}
                  height={14}
                  fill="none"
                  stroke="#fff"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 8a6 6 0 0112 0v4l2 4H4l2-4V8z" />
                </svg>
              }
              title="Prayer 5-min warn"
              sub="Soft heads-up before adhan"
              toggle
              toggleOn
            />
            <SettingsRow
              iconBg="gray"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  width={14}
                  height={14}
                  fill="none"
                  stroke="#fff"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              }
              title="Still paused?"
              sub="Quiet nudge after 5 min on hold"
              toggle
            />
          </SettingsGroup>
        </SettingsSection>

        {/* SYNC */}
        <SettingsSection label="Notion sync" metaOk="connected">
          <SettingsGroup>
            <SettingsRow
              iconBg="dark"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  width={14}
                  height={14}
                  fill="none"
                  stroke="#fff"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <path d="M9 8v8M9 8l6 8M15 8v8" />
                </svg>
              }
              title="Database"
              sub="Do It · 9f12…a4d7"
              syncStatus
            />
            <SettingsRow
              iconBg="gray"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  width={14}
                  height={14}
                  fill="none"
                  stroke="#fff"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12a9 9 0 11-3-6.7" />
                  <path d="M21 4v5h-5" />
                </svg>
              }
              title="Last sync"
              sub="2 minutes ago · 9:40"
            />
            <SettingsRow
              iconBg="blue"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  width={14}
                  height={14}
                  fill="none"
                  stroke="#fff"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12a9 9 0 11-3-6.7" />
                  <path d="M21 4v5h-5" />
                </svg>
              }
              title="Re-sync now"
              titleBlue
              hasChev
            />
          </SettingsGroup>
          <div
            style={{
              padding: "8px 14px 0",
              fontSize: 11.5,
              fontWeight: 500,
              color: "var(--label,#8e8e93)",
              letterSpacing: "-0.005em",
              lineHeight: 1.35,
            }}
          >
            Tasks, blocks, and domain rhythm flow both ways. Notion stays the
            source of truth.
          </div>
        </SettingsSection>

        {/* ACCOUNT */}
        <SettingsSection label="Account">
          <SettingsGroup>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 14px",
                minHeight: 46,
                width: "100%",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  fontSize: 14.5,
                  fontWeight: 500,
                  color: "#FF3B30",
                  letterSpacing: "-0.018em",
                }}
              >
                Sign out
              </span>
            </button>
          </SettingsGroup>
          <div
            style={{
              textAlign: "center",
              fontSize: 11,
              fontWeight: 500,
              color: "var(--label,#8e8e93)",
              letterSpacing: "0.005em",
              paddingTop: 14,
            }}
          >
            Do It · v0.4.2 (build 118)
          </div>
        </SettingsSection>
      </div>
    </div>
  );
}

function SettingsSection({
  label,
  meta,
  metaOk,
  children,
}: {
  label: string;
  meta?: string;
  metaOk?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 10px",
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            color: "var(--label,#8e8e93)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
        <span
          style={{
            flex: 1,
            height: 1,
            background: "var(--hairline-2,rgba(60,60,67,0.06))",
          }}
        />
        {meta && (
          <span
            style={{
              fontSize: 11,
              color: "var(--label-2,#6e6e73)",
              fontWeight: 600,
              letterSpacing: "-0.005em",
            }}
          >
            {meta}
          </span>
        )}
        {metaOk && (
          <span
            style={{
              fontSize: 11,
              color: "var(--green-deep,#248a3d)",
              fontWeight: 600,
              letterSpacing: "-0.005em",
            }}
          >
            {metaOk}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function SettingsGroup({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--card,#fff)",
        borderRadius: 18,
        boxShadow:
          "0 0 0 0.5px rgba(60,60,67,0.05), 0 1px 1px rgba(20,20,30,0.02), 0 6px 16px -12px rgba(20,20,30,0.10)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {children}
    </div>
  );
}

const BG: Record<string, string> = {
  gray: "linear-gradient(180deg,#9A9AA1 0%, #7E7E86 100%)",
  blue: "linear-gradient(180deg,#3B8DFF 0%, #0E66E6 100%)",
  green: "linear-gradient(180deg,#3FCB66 0%, #29A74A 100%)",
  steel: "linear-gradient(180deg,#7C8FA0 0%, #5C7184 100%)",
  dark: "linear-gradient(180deg,#2A2A30 0%, #0D0D12 100%)",
};

function SettingsRow({
  iconBg,
  icon,
  title,
  sub,
  value,
  hasChev,
  toggle,
  toggleOn,
  titleBlue,
  syncStatus,
}: {
  iconBg?: string;
  icon?: React.ReactNode;
  title: string;
  sub?: string;
  value?: string;
  hasChev?: boolean;
  toggle?: boolean;
  toggleOn?: boolean;
  titleBlue?: boolean;
  syncStatus?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        minHeight: 46,
        position: "relative",
      }}
    >
      {icon && (
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 7,
            background: iconBg
              ? (BG[iconBg] ?? iconBg)
              : "var(--inset,#f2f2f7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14.5,
            fontWeight: 500,
            color: titleBlue ? "var(--blue,#007aff)" : "var(--ink,#000)",
            letterSpacing: "-0.018em",
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
        {sub && (
          <div
            style={{
              fontSize: 11.5,
              fontWeight: 500,
              color: "var(--label,#8e8e93)",
              letterSpacing: "-0.005em",
              lineHeight: 1.15,
            }}
          >
            {sub}
          </div>
        )}
      </div>
      {value && (
        <div
          style={{
            fontSize: 13.5,
            fontWeight: 500,
            color: "var(--label-2,#6e6e73)",
            letterSpacing: "-0.014em",
            maxWidth: 160,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textAlign: "right",
          }}
        >
          {value}
        </div>
      )}
      {syncStatus && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: 11.5,
            fontWeight: 600,
            color: "var(--green-deep,#248a3d)",
            letterSpacing: "-0.005em",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--green,#34c759)",
              boxShadow: "0 0 0 3px var(--green-soft,rgba(52,199,89,0.14))",
              display: "block",
            }}
          />
          live
        </div>
      )}
      {toggle && (
        <div
          style={{
            width: 42,
            height: 25,
            borderRadius: 999,
            background: toggleOn ? "var(--green,#34c759)" : "#E5E5EA",
            position: "relative",
            flexShrink: 0,
            boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.06)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 2,
              left: toggleOn ? 19 : 2,
              width: 21,
              height: 21,
              borderRadius: "50%",
              background: "#fff",
              boxShadow:
                "0 0 0 0.5px rgba(60,60,67,0.10), 0 2px 4px rgba(20,20,30,0.18), 0 1px 1px rgba(20,20,30,0.06)",
              transition: "left 0.2s ease",
            }}
          />
        </div>
      )}
      {hasChev && <ChevRight />}
    </div>
  );
}

function ChevRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={8}
      height={13}
      fill="none"
      stroke="rgba(60,60,67,0.30)"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
