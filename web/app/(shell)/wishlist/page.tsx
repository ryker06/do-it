"use client";

import { useState, useCallback } from "react";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
import RightDrawer from "@/components/RightDrawer";
import type {
  WishlistCategory,
  WishlistPriority,
  WishlistStatus,
  WishlistItem,
} from "@/lib/types";

// ── palette constants ─────────────────────────────────────────────────────────
const SHADOW_SOFT =
  "0 0 0 0.5px rgba(60,60,67,0.05),0 1px 1px rgba(20,20,30,0.02),0 8px 22px -14px rgba(20,20,30,0.12)";
const SHADOW_CHIP =
  "0 0 0 0.5px rgba(60,60,67,0.06),0 1px 2px rgba(20,20,30,0.04),0 1px 0 rgba(255,255,255,0.7) inset";
const SHADOW_PRESS_INK =
  "0 1px 0 rgba(255,255,255,0.08) inset,0 0 0 0.5px rgba(0,0,0,0.5),0 18px 38px -18px rgba(10,10,20,0.55)";
const HAIRLINE = "rgba(60,60,67,0.10)";

// ── category tints ────────────────────────────────────────────────────────────
const CAT_TINT: Record<
  WishlistCategory,
  {
    bg: string;
    color: string;
    label: string;
    gradStart: string;
    gradEnd: string;
    svgStroke: string;
  }
> = {
  gear: {
    bg: "#E2EEFF",
    color: "#1748A8",
    label: "gear",
    gradStart: "#E2EEFF",
    gradEnd: "#F0F6FF",
    svgStroke: "#1748A8",
  },
  books: {
    bg: "#FFE0E8",
    color: "#7A2A3C",
    label: "books",
    gradStart: "#FFE7EC",
    gradEnd: "#FFF1F4",
    svgStroke: "#7A2A3C",
  },
  experiences: {
    bg: "#C7F0CF",
    color: "#1F5C2C",
    label: "experiences",
    gradStart: "#E2F4E6",
    gradEnd: "#F0F8F2",
    svgStroke: "#1F5C2C",
  },
  tools: {
    bg: "#EAEFF3",
    color: "#36475A",
    label: "tools",
    gradStart: "#EAEFF3",
    gradEnd: "#F4F6F8",
    svgStroke: "#36475A",
  },
  other: {
    bg: "#FFF0DD",
    color: "#7A4A1A",
    label: "other",
    gradStart: "#FFF0DD",
    gradEnd: "#FFF8EC",
    svgStroke: "#7A4A1A",
  },
};

// ── priority chips ────────────────────────────────────────────────────────────
const PRI_CHIP: Record<WishlistPriority, { bg: string; color: string }> = {
  high: { bg: "#FFD9E0", color: "#7A2A3C" },
  medium: { bg: "#C7F0CF", color: "#1F5C2C" },
  low: { bg: "#FBFAF8", color: "#6E6E73" },
};

// ── category SVG covers ───────────────────────────────────────────────────────
function CatSvg({ cat }: { cat: WishlistCategory }) {
  const t = CAT_TINT[cat];
  const grad = `linear-gradient(180deg,${t.gradStart} 0%,${t.gradEnd} 100%)`;
  return (
    <div
      style={{
        height: 120,
        background: grad,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {cat === "gear" && (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          width={64}
          height={64}
          style={{ opacity: 0.85 }}
        >
          <rect
            x="10"
            y="22"
            width="44"
            height="24"
            rx="6"
            fill="#fff"
            stroke={t.svgStroke}
            strokeWidth={2}
          />
          <circle cx="32" cy="34" r="6" fill={t.svgStroke} />
        </svg>
      )}
      {cat === "books" && (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          width={64}
          height={64}
          style={{ opacity: 0.85 }}
        >
          <rect
            x="14"
            y="10"
            width="36"
            height="48"
            rx="3"
            fill="#FFE0E8"
            stroke={t.svgStroke}
            strokeWidth={2}
          />
          <path d="M14 10v48" stroke={t.svgStroke} strokeWidth={2} />
          <path
            d="M22 22h20M22 30h20M22 38h14"
            stroke={t.svgStroke}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </svg>
      )}
      {cat === "experiences" && (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          width={64}
          height={64}
          style={{ opacity: 0.85 }}
        >
          <circle
            cx="32"
            cy="32"
            r="20"
            fill="#C7F0CF"
            stroke={t.svgStroke}
            strokeWidth={2}
          />
          <path
            d="M12 32h40M32 12c5 6 5 34 0 40M32 12c-5 6-5 34 0 40"
            stroke={t.svgStroke}
            strokeWidth={1.5}
          />
        </svg>
      )}
      {cat === "tools" && (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          width={64}
          height={64}
          style={{ opacity: 0.85 }}
        >
          <rect
            x="8"
            y="14"
            width="48"
            height="32"
            rx="3"
            fill="#fff"
            stroke={t.svgStroke}
            strokeWidth={2}
          />
          <rect x="4" y="46" width="56" height="4" rx="1" fill={t.svgStroke} />
          <rect x="14" y="20" width="36" height="20" rx="1" fill="#EAEFF3" />
        </svg>
      )}
      {cat === "other" && (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          width={64}
          height={64}
          style={{ opacity: 0.85 }}
        >
          <circle
            cx="32"
            cy="32"
            r="16"
            fill="#FFD9A6"
            stroke={t.svgStroke}
            strokeWidth={2}
          />
          <path
            d="M32 22v10l6 4"
            stroke={t.svgStroke}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
}

// ── format helpers ─────────────────────────────────────────────────────────────
function fmtCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function fmtCentsCompact(cents: number): string {
  const n = cents / 100;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n.toLocaleString("en-US")}`;
}

function timeAgo(ts: number): string {
  const d = Math.floor((Date.now() - ts) / 86400000);
  if (d === 0) return "today";
  if (d === 1) return "1 day ago";
  return `${d} days ago`;
}

// ── status filter tabs ────────────────────────────────────────────────────────
type StatusFilter = WishlistStatus | "all";
type CatFilter = WishlistCategory | "all";

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
  { label: "all", value: "all" },
  { label: "wanted", value: "wanted" },
  { label: "bought", value: "bought" },
];

const CAT_TABS: { label: string; value: CatFilter }[] = [
  { label: "all", value: "all" },
  { label: "gear", value: "gear" },
  { label: "books", value: "books" },
  { label: "experiences", value: "experiences" },
  { label: "tools", value: "tools" },
  { label: "other", value: "other" },
];

// ── wishlist card ─────────────────────────────────────────────────────────────
function WishCard({
  item,
  isBought,
  onTap,
}: {
  item: WishlistItem;
  isBought: boolean;
  onTap: () => void;
}) {
  const cat = item.category ?? "other";
  const catT = CAT_TINT[cat];
  const pri = item.priority ?? "low";
  const priT = PRI_CHIP[pri];

  return (
    <div
      onClick={onTap}
      style={{
        position: "relative",
        background: "#FFFFFF",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: SHADOW_SOFT,
        display: "flex",
        flexDirection: "column",
        opacity: isBought ? 0.55 : 1,
        cursor: "pointer",
      }}
    >
      {/* green tick for bought */}
      {isBought && (
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "#C7F0CF",
            color: "#1F5C2C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 800,
            boxShadow: SHADOW_CHIP,
            zIndex: 2,
          }}
        >
          ✓
        </div>
      )}

      {/* cover */}
      {item.coverImage?.kind === "url" ? (
        <div style={{ height: 120, position: "relative", overflow: "hidden" }}>
          {/* camera icon */}
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "rgba(20,20,30,0.55)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              zIndex: 2,
            }}
          >
            📷
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.coverImage.value}
            alt={item.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          <CatSvg cat={cat} />
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "rgba(20,20,30,0.55)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              zIndex: 2,
            }}
          >
            📷
          </div>
        </div>
      )}

      {/* body */}
      <div
        style={{
          padding: "12px 14px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          position: "relative",
        }}
      >
        {/* priority chip — absolute, top of body */}
        {!isBought && (
          <div
            style={{
              position: "absolute",
              top: -12,
              right: 8,
              padding: "5px 10px",
              borderRadius: 999,
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              background: priT.bg,
              color: priT.color,
              transform: "rotate(-7deg)",
              boxShadow: SHADOW_CHIP,
              zIndex: 3,
            }}
          >
            {pri}
          </div>
        )}

        {/* name */}
        <div
          style={{
            fontSize: 14.5,
            fontWeight: 800,
            letterSpacing: "-0.022em",
            color: "#0B0B0F",
            lineHeight: 1.2,
          }}
        >
          {item.name}
        </div>

        {/* price */}
        <div
          style={{
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.012em",
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: "#8E8E93",
              fontWeight: 700,
              marginRight: 1,
            }}
          >
            $
          </span>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#0B0B0F" }}>
            {(item.expectedAmountCents / 100).toLocaleString("en-US")}
          </span>
        </div>

        {/* foot: category pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <span
            style={{
              fontSize: 9.5,
              fontWeight: 800,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "3px 7px",
              borderRadius: 6,
              background: catT.bg,
              color: catT.color,
            }}
          >
            {catT.label}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── item detail drawer ────────────────────────────────────────────────────────
function ItemDrawer({
  item,
  onClose,
  onMarkBought,
  onRemove,
}: {
  item: WishlistItem;
  onClose: () => void;
  onMarkBought: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const cat = item.category ?? "other";
  const catT = CAT_TINT[cat];
  const pri = item.priority ?? "low";
  const priT = PRI_CHIP[pri];
  const isBought = item.status === "bought";

  return (
    <RightDrawer onClose={onClose} width={380}>
      <div style={{ padding: "24px 22px 32px" }}>
        {/* cover preview */}
        <div
          style={{
            borderRadius: 18,
            overflow: "hidden",
            height: 160,
            marginBottom: 14,
            position: "relative",
          }}
        >
          {item.coverImage?.kind === "url" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.coverImage.value}
              alt={item.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <CatSvg cat={cat} />
          )}
          {/* priority chip bottom-left */}
          {!isBought && (
            <div
              style={{
                position: "absolute",
                bottom: 12,
                left: 14,
                padding: "5px 10px",
                borderRadius: 999,
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                background: priT.bg,
                color: priT.color,
                transform: "rotate(-7deg)",
                boxShadow: SHADOW_CHIP,
              }}
            >
              {pri} priority
            </div>
          )}
        </div>

        {/* item name */}
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "-0.025em",
            color: "#0B0B0F",
            lineHeight: 1.1,
          }}
        >
          {item.name}
        </div>

        {/* category + time ago */}
        <div
          style={{
            fontSize: 13,
            color: "#8E8E93",
            fontWeight: 600,
            marginTop: 4,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 9.5,
              fontWeight: 800,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "3px 7px",
              borderRadius: 6,
              background: catT.bg,
              color: catT.color,
            }}
          >
            {catT.label}
          </span>
          <span>added {timeAgo(item.createdAt)}</span>
        </div>

        {/* expected price field */}
        <div style={{ marginTop: 16 }}>
          <div
            style={{
              fontSize: 10.5,
              color: "#8E8E93",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            expected price
          </div>
          <div
            style={{
              background: "#FBFAF8",
              borderRadius: 14,
              padding: "11px 14px",
              boxShadow: `inset 0 0 0 0.5px ${HAIRLINE}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: 14,
                  color: "#8E8E93",
                  fontWeight: 700,
                  marginRight: 2,
                }}
              >
                $
              </span>
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  fontVariantNumeric: "tabular-nums",
                  color: "#0B0B0F",
                }}
              >
                {(item.expectedAmountCents / 100).toLocaleString("en-US")}
              </span>
            </div>
            <span style={{ color: "#8E8E93", fontSize: 13 }}>edit</span>
          </div>
        </div>

        {/* link field */}
        {item.url && (
          <div style={{ marginTop: 12 }}>
            <div
              style={{
                fontSize: 10.5,
                color: "#8E8E93",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              link
            </div>
            <div
              style={{
                background: "#FBFAF8",
                borderRadius: 14,
                padding: "11px 14px",
                boxShadow: `inset 0 0 0 0.5px ${HAIRLINE}`,
                fontSize: 13,
                fontWeight: 500,
                color: "#0A84FF",
                lineHeight: 1.4,
                wordBreak: "break-all",
              }}
            >
              {item.url} →
            </div>
          </div>
        )}

        {/* note / why field */}
        {item.note && (
          <div style={{ marginTop: 12 }}>
            <div
              style={{
                fontSize: 10.5,
                color: "#8E8E93",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              why
            </div>
            <div
              style={{
                background: "#FBFAF8",
                borderRadius: 14,
                padding: "11px 14px",
                boxShadow: `inset 0 0 0 0.5px ${HAIRLINE}`,
                fontSize: 14,
                fontWeight: 500,
                color: "#1C1C1E",
                lineHeight: 1.45,
              }}
            >
              {item.note}
            </div>
          </div>
        )}

        {/* CTA buttons */}
        {!isBought && (
          <button
            onClick={() => {
              onMarkBought(item.id);
              onClose();
            }}
            style={{
              width: "100%",
              padding: "12px 0",
              borderRadius: 14,
              background: "#C7F0CF",
              color: "#1F5C2C",
              border: "none",
              fontSize: 13.5,
              fontWeight: 700,
              letterSpacing: "-0.012em",
              cursor: "pointer",
              fontFamily: "inherit",
              marginTop: 16,
              boxShadow: "inset 0 0 0 0.5px rgba(31,92,44,0.18)",
            }}
          >
            → mark bought · creates expense
          </button>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button
            style={{
              flex: 1,
              padding: "12px 0",
              borderRadius: 14,
              background: "#FBFAF8",
              color: "#0B0B0F",
              border: "none",
              fontSize: 13.5,
              fontWeight: 700,
              letterSpacing: "-0.012em",
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: `inset 0 0 0 0.5px ${HAIRLINE}`,
            }}
          >
            edit
          </button>
          <button
            onClick={() => {
              onRemove(item.id);
              onClose();
            }}
            style={{
              flex: 1,
              padding: "12px 0",
              borderRadius: 14,
              background: "#FBFAF8",
              color: "#7A2A3C",
              border: "none",
              fontSize: 13.5,
              fontWeight: 700,
              letterSpacing: "-0.012em",
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: `inset 0 0 0 0.5px ${HAIRLINE}`,
            }}
          >
            remove
          </button>
        </div>
      </div>
    </RightDrawer>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────
export default function WishlistPage() {
  const { wishlist, addWishlistItem, removeWishlistItem, markWishlistBought } =
    useDoIt();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [catFilter, setCatFilter] = useState<CatFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // add strip state
  const [addName, setAddName] = useState("");
  const [addPrice, setAddPrice] = useState("");
  const [addExpanded, setAddExpanded] = useState(false);
  const [addCat, setAddCat] = useState<WishlistCategory>("other");
  const [addPri, setAddPri] = useState<WishlistPriority>("medium");

  const wanted = wishlist.filter((w) => w.status === "wanted");
  const bought = wishlist.filter((w) => w.status === "bought");
  const totalWantedCents = wanted.reduce(
    (s, w) => s + w.expectedAmountCents,
    0,
  );
  const totalBoughtCents = bought.reduce(
    (s, w) => s + w.expectedAmountCents,
    0,
  );

  // filtered visible list
  const visibleWanted = wanted.filter(
    (w) =>
      (statusFilter === "all" || statusFilter === "wanted") &&
      (catFilter === "all" || w.category === catFilter),
  );
  const visibleBought = bought.filter(
    (w) =>
      (statusFilter === "all" || statusFilter === "bought") &&
      (catFilter === "all" || w.category === catFilter),
  );
  const showWanted = statusFilter !== "bought";
  const showBought = statusFilter !== "wanted";

  const selectedItem = selectedId
    ? wishlist.find((w) => w.id === selectedId)
    : null;

  const handleAdd = useCallback(() => {
    const name = addName.trim();
    const cents = Math.round(parseFloat(addPrice) * 100);
    if (!name || isNaN(cents) || cents <= 0) return;
    addWishlistItem({
      name,
      expectedAmountCents: cents,
      currency: "USD",
      category: addCat,
      priority: addPri,
      status: "wanted",
    });
    setAddName("");
    setAddPrice("");
    setAddExpanded(false);
  }, [addName, addPrice, addCat, addPri, addWishlistItem]);

  const handleClose = useCallback(() => setSelectedId(null), []);

  return (
    <>
      <Topbar
        name="buy the body, not the cart."
        sub={`${wanted.length} wanted · ${bought.length} bought this year`}
      />

      {/* heading row */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 6,
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
          wishlist.
        </div>
        <div
          style={{
            fontSize: 12,
            color: "#8E8E93",
            fontWeight: 600,
            letterSpacing: "-0.005em",
          }}
        >
          {wanted.length}
        </div>
      </div>

      {/* total spend phrase */}
      {totalWantedCents > 0 && (
        <div
          style={{
            fontSize: 13.5,
            color: "#1C1C1E",
            fontWeight: 600,
            letterSpacing: "-0.005em",
            lineHeight: 1.45,
            borderBottom: `0.5px solid rgba(60,60,67,0.06)`,
            paddingBottom: 12,
            marginBottom: 14,
          }}
        >
          <b
            style={{
              color: "#0B0B0F",
              fontWeight: 800,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {fmtCentsCompact(totalWantedCents)}
          </b>{" "}
          across {wanted.length} {wanted.length === 1 ? "item" : "items"}.{" "}
          <span style={{ color: "#1F5C2C", fontWeight: 800 }}>
            → keep stacking.
          </span>
        </div>
      )}

      {/* add strip */}
      <div
        style={{
          marginBottom: 12,
          display: "grid",
          gridTemplateColumns: "30px 1fr 90px",
          gap: 8,
          alignItems: "center",
          background: "#FBFAF8",
          borderRadius: 16,
          padding: "10px 12px",
          boxShadow: `inset 0 0 0 0.5px ${HAIRLINE}`,
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "#0B0B0F",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            flexShrink: 0,
          }}
          onClick={() => setAddExpanded((v) => !v)}
        >
          +
        </div>
        <input
          value={addName}
          onChange={(e) => setAddName(e.target.value)}
          onFocus={() => setAddExpanded(true)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="wishlist · name"
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: 13.5,
            fontWeight: 600,
            color: "#0B0B0F",
            letterSpacing: "-0.005em",
            fontFamily: "inherit",
          }}
        />
        <input
          value={addPrice}
          onChange={(e) => setAddPrice(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="$ — — —"
          type="number"
          min="0"
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: 13,
            fontWeight: 700,
            color: "#8E8E93",
            textAlign: "right",
            fontVariantNumeric: "tabular-nums",
            fontFamily: "inherit",
            width: "100%",
          }}
        />
      </div>

      {/* expanded add controls */}
      {addExpanded && (
        <div
          style={{
            marginBottom: 12,
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <select
            value={addCat}
            onChange={(e) => setAddCat(e.target.value as WishlistCategory)}
            style={{
              flex: 1,
              fontSize: 12,
              fontWeight: 600,
              color: "#1C1C1E",
              background: "#FBFAF8",
              border: "none",
              outline: "none",
              borderRadius: 10,
              padding: "7px 10px",
              fontFamily: "inherit",
              boxShadow: `inset 0 0 0 0.5px ${HAIRLINE}`,
            }}
          >
            {CAT_TABS.slice(1).map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <select
            value={addPri}
            onChange={(e) => setAddPri(e.target.value as WishlistPriority)}
            style={{
              width: 88,
              fontSize: 12,
              fontWeight: 600,
              color: "#1C1C1E",
              background: "#FBFAF8",
              border: "none",
              outline: "none",
              borderRadius: 10,
              padding: "7px 10px",
              fontFamily: "inherit",
              boxShadow: `inset 0 0 0 0.5px ${HAIRLINE}`,
            }}
          >
            <option value="low">low</option>
            <option value="medium">med</option>
            <option value="high">high</option>
          </select>
          <button
            onClick={handleAdd}
            style={{
              padding: "7px 16px",
              borderRadius: 10,
              background: "#0B0B0F",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              flexShrink: 0,
              boxShadow: SHADOW_PRESS_INK,
            }}
          >
            add
          </button>
        </div>
      )}

      {/* status filter chips */}
      <div
        style={{
          display: "flex",
          gap: 6,
          overflowX: "auto",
          scrollbarWidth: "none",
          paddingBottom: 6,
        }}
      >
        {STATUS_TABS.map((t) => {
          const active = statusFilter === t.value;
          return (
            <button
              key={t.value}
              onClick={() => setStatusFilter(t.value)}
              style={{
                flexShrink: 0,
                background: active ? "#0B0B0F" : "#FFFFFF",
                borderRadius: 999,
                padding: "7px 12px",
                fontSize: 12.5,
                fontWeight: 700,
                color: active ? "#fff" : "#1C1C1E",
                letterSpacing: "-0.005em",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: active ? "none" : `inset 0 0 0 0.5px ${HAIRLINE}`,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* category filter chips */}
      <div
        style={{
          display: "flex",
          gap: 6,
          overflowX: "auto",
          scrollbarWidth: "none",
          paddingTop: 8,
          paddingBottom: 14,
        }}
      >
        {CAT_TABS.map((t) => {
          const active = catFilter === t.value;
          return (
            <button
              key={t.value}
              onClick={() => setCatFilter(t.value)}
              style={{
                flexShrink: 0,
                background: active ? "#0B0B0F" : "#FFFFFF",
                borderRadius: 999,
                padding: "7px 12px",
                fontSize: 12.5,
                fontWeight: 700,
                color: active ? "#fff" : "#1C1C1E",
                letterSpacing: "-0.005em",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: active ? "none" : `inset 0 0 0 0.5px ${HAIRLINE}`,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* WANTED grid */}
      {showWanted && visibleWanted.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 0,
          }}
        >
          {visibleWanted.map((item) => (
            <WishCard
              key={item.id}
              item={item}
              isBought={false}
              onTap={() => setSelectedId(item.id)}
            />
          ))}
        </div>
      )}

      {/* empty state for wanted */}
      {showWanted && visibleWanted.length === 0 && (
        <div
          style={{
            padding: "32px 0 16px",
            textAlign: "center",
            fontSize: 14,
            fontWeight: 500,
            color: "#8E8E93",
            letterSpacing: "-0.01em",
          }}
        >
          nothing wanted. add something.
        </div>
      )}

      {/* BOUGHT section */}
      {showBought && visibleBought.length > 0 && (
        <>
          <div
            style={{
              padding: "24px 0 8px",
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "#8E8E93",
                fontWeight: 800,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              bought · this year
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#8E8E93",
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {bought.length} {bought.length === 1 ? "item" : "items"} ·{" "}
              {fmtCentsCompact(totalBoughtCents)}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              paddingBottom: 110,
            }}
          >
            {visibleBought.map((item) => (
              <WishCard
                key={item.id}
                item={item}
                isBought={true}
                onTap={() => setSelectedId(item.id)}
              />
            ))}
          </div>
        </>
      )}

      {/* bottom padding when no bought section */}
      {(!showBought || visibleBought.length === 0) && (
        <div style={{ height: 110 }} />
      )}

      {/* item detail drawer */}
      {selectedItem && (
        <ItemDrawer
          item={selectedItem}
          onClose={handleClose}
          onMarkBought={markWishlistBought}
          onRemove={removeWishlistItem}
        />
      )}
    </>
  );
}
