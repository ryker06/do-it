"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDoIt } from "@/lib/store";
import { DomainGlyph } from "@/components/icons";
import type { DomainId } from "@/lib/types";

const DOMAIN_BG: Record<DomainId, string> = {
  business: "linear-gradient(180deg,#E1ECFF 0%, #C9DBFF 100%)",
  religion: "linear-gradient(180deg,#E2F4E6 0%, #C0E5C8 100%)",
  learning: "linear-gradient(180deg,#FFE3EB 0%, #FFCFDC 100%)",
  fitness: "linear-gradient(180deg,#FFD0DA 0%, #FFB6C5 100%)",
  home: "linear-gradient(180deg,#E5ECF0 0%, #CFDCE3 100%)",
  food: "linear-gradient(180deg,#FFF3E0 0%, #FFE0B2 100%)",
};

const DOMAIN_IDS: DomainId[] = [
  "business",
  "religion",
  "learning",
  "fitness",
  "home",
  "food",
];
const DOMAIN_NAMES: Record<DomainId, string> = {
  business: "Business",
  religion: "Religion",
  learning: "Learning",
  fitness: "Fitness",
  home: "Home",
  food: "Food",
};

export function ClientView({ id }: { id: string }) {
  const router = useRouter();
  const { visions, updateVision, deleteVision } = useDoIt();

  const visionId = id;
  const vision = visions.find((v) => v.id === visionId);

  const [title, setTitle] = useState(vision?.title ?? "");
  const [blurb, setBlurb] = useState(vision?.blurb ?? "");
  const [description, setDescription] = useState(vision?.description ?? "");
  const [domainId, setDomainId] = useState<DomainId>(
    vision?.domainId ?? "business",
  );
  const [deadline, setDeadline] = useState(vision?.deadline ?? "");
  const [targetMetric, setTargetMetric] = useState(vision?.targetMetric ?? "");

  if (!vision) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "var(--label,#8E8E93)",
          }}
        >
          Vision not found
        </div>
      </div>
    );
  }

  function save() {
    updateVision(visionId, {
      title,
      blurb,
      description,
      domainId,
      deadline: deadline || undefined,
      targetMetric: targetMetric || undefined,
    });
    router.back();
  }

  function remove() {
    deleteVision(visionId);
    router.push("/visions");
  }

  return (
    <div
      style={{
        position: "relative",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--stage,#F2F2F7)",
      }}
    >
      {/* topbar */}
      <div
        style={{
          position: "relative",
          zIndex: 4,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 0 6px",
          height: 42,
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow:
              "inset 0 0 0 0.5px var(--hairline-2,rgba(60,60,67,0.06)), 0 1px 2px rgba(20,20,30,0.05)",
            border: "none",
            cursor: "pointer",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={11}
            height={11}
            fill="none"
            stroke="var(--ink-2,#1C1C1E)"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--label,#8E8E93)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            flex: 1,
            textAlign: "center",
            marginLeft: -34,
          }}
        >
          Edit vision
        </div>
        <div className="me-avatar">
          <img
            src="https://www.tapback.co/api/avatar/jay.webp?color=7"
            alt="Adam"
          />
        </div>
        <button
          onClick={() => router.back()}
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "var(--label-2,#6E6E73)",
            letterSpacing: "-0.018em",
            background: "none",
            border: 0,
            cursor: "pointer",
            padding: "8px 4px",
          }}
        >
          Cancel
        </button>
      </div>

      {/* scroll */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          flex: 1,
          overflowY: "auto",
          padding: "6px 0 130px",
          WebkitMaskImage:
            "linear-gradient(180deg, #000 0%, #000 94%, transparent 100%)",
          maskImage:
            "linear-gradient(180deg, #000 0%, #000 94%, transparent 100%)",
        }}
      >
        {/* preview tile */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 6px",
            margin: "8px 0 10px",
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "var(--label,#8E8E93)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            Preview
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
              fontSize: 10,
              fontWeight: 700,
              color: "var(--label-2,#6E6E73)",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#34C759",
                marginRight: 5,
                verticalAlign: "middle",
                boxShadow: "0 0 0 2px rgba(52,199,89,0.15)",
              }}
            />
            Live
          </span>
        </div>

        <div
          style={{
            position: "relative",
            borderRadius: 24,
            padding: 18,
            marginBottom: 24,
            background: "var(--card,#fff)",
            boxShadow:
              "0 0 0 0.5px rgba(60,60,67,0.06), 0 1px 1px rgba(20,20,30,0.02), 0 12px 28px -14px rgba(20,20,30,0.10), 0 26px 50px -28px rgba(20,20,30,0.14)",
            overflow: "hidden",
            isolation: "isolate",
            minHeight: 158,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 24,
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 0.5px rgba(60,60,67,0.05)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
          {/* aura */}
          <div
            style={{
              position: "absolute",
              right: -80,
              top: -90,
              width: 420,
              height: 340,
              borderRadius: "50%",
              filter: "blur(36px)",
              opacity: 0.85,
              zIndex: 0,
              pointerEvents: "none",
              background: DOMAIN_BG[domainId],
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 3,
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 48,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 8px 4px 7px",
                background: "rgba(255,255,255,0.7)",
                borderRadius: 999,
                boxShadow:
                  "inset 0 0 0 0.5px var(--hairline,rgba(60,60,67,0.10))",
                fontSize: 9.5,
                fontWeight: 700,
                color: "var(--ink-2,#1C1C1E)",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width={9}
                height={9}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              </svg>
              Vision
            </div>
          </div>
          <div style={{ position: "relative", zIndex: 3 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: DOMAIN_BG[domainId],
                boxShadow:
                  "inset 0 0 0 0.5px rgba(20,20,30,0.06), 0 1px 2px rgba(20,20,30,0.04)",
                color: "var(--glyph,#0A0A0F)",
                marginBottom: 12,
              }}
            >
              <DomainGlyph id={domainId} size={22} />
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "var(--ink,#000)",
                letterSpacing: "-0.035em",
                lineHeight: 1.1,
                marginBottom: 4,
              }}
            >
              {title || "Vision title"}
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--label-2,#6E6E73)",
                letterSpacing: "-0.01em",
                lineHeight: 1.35,
              }}
            >
              {blurb || "Short tagline"}
            </div>
          </div>
        </div>

        {/* fields */}
        <div
          style={{
            background: "var(--card,#fff)",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow:
              "0 0 0 0.5px rgba(60,60,67,0.05), 0 1px 1px rgba(20,20,30,0.02), 0 6px 16px -12px rgba(20,20,30,0.10)",
            marginBottom: 14,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 20,
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 0.5px rgba(60,60,67,0.05)",
              pointerEvents: "none",
            }}
          />
          {/* title field */}
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "0.5px solid var(--hairline-2,rgba(60,60,67,0.06))",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "var(--label,#8E8E93)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Title
            </div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Vision name"
              style={{
                width: "100%",
                fontSize: 17,
                fontWeight: 600,
                color: "var(--ink,#000)",
                letterSpacing: "-0.024em",
                background: "transparent",
                border: "none",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
          </div>
          {/* blurb field */}
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "0.5px solid var(--hairline-2,rgba(60,60,67,0.06))",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "var(--label,#8E8E93)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Tagline
            </div>
            <input
              value={blurb}
              onChange={(e) => setBlurb(e.target.value)}
              placeholder="One-line description"
              style={{
                width: "100%",
                fontSize: 15,
                fontWeight: 500,
                color: "var(--ink-2,#1C1C1E)",
                letterSpacing: "-0.018em",
                background: "transparent",
                border: "none",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
          </div>
          {/* description */}
          <div style={{ padding: "14px 16px" }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "var(--label,#8E8E93)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Description
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this vision mean to you?"
              rows={3}
              style={{
                width: "100%",
                fontSize: 14,
                fontWeight: 500,
                color: "var(--ink-2,#1C1C1E)",
                letterSpacing: "-0.012em",
                lineHeight: 1.5,
                background: "transparent",
                border: "none",
                outline: "none",
                resize: "none",
                fontFamily: "inherit",
              }}
            />
          </div>
        </div>

        {/* deadline + metric */}
        <div
          style={{
            background: "var(--card,#fff)",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow:
              "0 0 0 0.5px rgba(60,60,67,0.05), 0 1px 1px rgba(20,20,30,0.02), 0 6px 16px -12px rgba(20,20,30,0.10)",
            marginBottom: 14,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 20,
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 0.5px rgba(60,60,67,0.05)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "0.5px solid var(--hairline-2,rgba(60,60,67,0.06))",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "var(--label,#8E8E93)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Deadline
            </div>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              style={{
                width: "100%",
                fontSize: 15,
                fontWeight: 500,
                color: "var(--ink-2,#1C1C1E)",
                letterSpacing: "-0.012em",
                background: "transparent",
                border: "none",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
          </div>
          <div style={{ padding: "14px 16px" }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "var(--label,#8E8E93)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Target metric
            </div>
            <input
              value={targetMetric}
              onChange={(e) => setTargetMetric(e.target.value)}
              placeholder="e.g. deadlift 180kg"
              style={{
                width: "100%",
                fontSize: 15,
                fontWeight: 500,
                color: "var(--ink-2,#1C1C1E)",
                letterSpacing: "-0.012em",
                background: "transparent",
                border: "none",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
          </div>
        </div>

        {/* domain picker */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "var(--label,#8E8E93)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            padding: "0 4px",
            margin: "0 0 10px",
          }}
        >
          Domain
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 22,
          }}
        >
          {DOMAIN_IDS.map((did) => {
            const active = domainId === did;
            return (
              <button
                key={did}
                onClick={() => setDomainId(did)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 12px 8px 9px",
                  borderRadius: 999,
                  background: active ? "#0A0A0F" : "var(--card,#fff)",
                  boxShadow: active
                    ? "0 1px 2px rgba(20,20,30,0.18)"
                    : "0 0 0 0.5px rgba(60,60,67,0.10), 0 1px 2px rgba(20,20,30,0.04)",
                  border: "none",
                  cursor: "pointer",
                  color: active ? "#fff" : "var(--ink-2,#1C1C1E)",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "-0.012em",
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: DOMAIN_BG[did],
                    flexShrink: 0,
                  }}
                />
                {DOMAIN_NAMES[did]}
              </button>
            );
          })}
        </div>

        {/* danger zone */}
        <button
          onClick={remove}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 16,
            background: "rgba(255,69,58,0.08)",
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
            color: "#FF453A",
            letterSpacing: "-0.012em",
          }}
        >
          Delete vision
        </button>
      </div>

      {/* save bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 84,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "14px 0 0",
          background: "rgba(242,242,247,0.88)",
          backdropFilter: "saturate(200%) blur(28px)",
          WebkitBackdropFilter: "saturate(200%) blur(28px)",
          borderTop: "0.5px solid var(--hairline,rgba(60,60,67,0.10))",
          zIndex: 3,
        }}
      >
        <button
          onClick={save}
          style={{
            width: "100%",
            height: 50,
            borderRadius: 999,
            background: "linear-gradient(180deg,#1C1C1E 0%, #0A0A0F 100%)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "-0.018em",
            border: "none",
            cursor: "pointer",
            boxShadow:
              "0 0 0 0.5px rgba(0,0,0,0.30), 0 1px 0 rgba(255,255,255,0.08) inset, 0 10px 24px -10px rgba(20,20,30,0.45)",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={13}
            height={13}
            fill="none"
            stroke="#fff"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12l4 4L19 6" />
          </svg>
          Save vision
        </button>
      </div>
    </div>
  );
}
