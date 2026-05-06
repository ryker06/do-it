import type { DomainId } from "@/lib/types";

export function DomainGlyph({
  id,
  size = 19,
}: {
  id: DomainId;
  size?: number;
}) {
  const shared = {
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (id) {
    case "business":
      return (
        <svg {...shared}>
          <rect x="3" y="7" width="18" height="13" rx="2.2" />
          <path d="M9 7V5.5A1.5 1.5 0 0110.5 4h3A1.5 1.5 0 0115 5.5V7" />
          <path d="M3 13h18" />
        </svg>
      );
    case "religion":
      return (
        <svg {...shared}>
          <path d="M16.5 14.8a6.4 6.4 0 11-7.3-9.6 5.2 5.2 0 007.3 9.6z" />
          <path d="M17.5 5l.7 1.6 1.7.3-1.3 1.1.4 1.7L17.5 9l-1.5.7.4-1.7-1.3-1.1 1.7-.3z" />
        </svg>
      );
    case "learning":
      return (
        <svg {...shared}>
          <path d="M3 7l9-4 9 4-9 4z" />
          <path d="M7 9.5v4.5c0 1.5 2.5 3 5 3s5-1.5 5-3V9.5" />
          <path d="M21 7v6" />
        </svg>
      );
    case "fitness":
      return (
        <svg {...shared}>
          <rect x="2" y="9" width="3" height="6" rx="1" />
          <rect x="19" y="9" width="3" height="6" rx="1" />
          <rect x="5" y="10" width="2" height="4" rx="1" />
          <rect x="17" y="10" width="2" height="4" rx="1" />
          <path d="M7 12h10" strokeWidth="2.5" />
        </svg>
      );
    case "home":
      return (
        <svg {...shared}>
          <path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1z" />
        </svg>
      );
    case "food":
      return (
        <svg {...shared}>
          <path d="M12 3a5 5 0 015 5c0 2.5-1.5 4.5-3.5 5.3V20a1.5 1.5 0 01-3 0v-6.7C8.5 12.5 7 10.5 7 8a5 5 0 015-5z" />
          <path d="M9 3v4M12 3v4M15 3v4" />
        </svg>
      );
  }
}

export function ClockSvg({
  stroke = "#1C1C1E",
  size = 12,
}: {
  stroke?: string;
  size?: number;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={size} height={size}>
      <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="2" />
      <path
        d="M12 7v5l3 2"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CheckSvg({
  stroke = "#1C1C1E",
  size = 12,
  weight = 2.4,
}: {
  stroke?: string;
  size?: number;
  weight?: number;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={size} height={size}>
      <path
        d="M5 12l4 4L19 6"
        stroke={stroke}
        strokeWidth={weight}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlusSvg({
  stroke = "#1C1C1E",
  size = 12,
  weight = 2.6,
}: {
  stroke?: string;
  size?: number;
  weight?: number;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={size} height={size}>
      <path
        d="M12 5v14M5 12h14"
        stroke={stroke}
        strokeWidth={weight}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CrescentSvg({
  size = 17,
  fill = "#2F5A3E",
}: {
  size?: number;
  fill?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={size} height={size}>
      <path d="M16.5 14.5a6.5 6.5 0 11-7-9.5 5.5 5.5 0 007 9.5z" fill={fill} />
    </svg>
  );
}

export function ChevSvg({
  size = 9,
  stroke = "#6E6E73",
}: {
  size?: number;
  stroke?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={size} height={size}>
      <path
        d="M9 6l6 6-6 6"
        stroke={stroke}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowSvg({
  size = 9,
  stroke = "#6E6E73",
  dir = "up",
}: {
  size?: number;
  stroke?: string;
  dir?: "up" | "right" | "flat";
}) {
  if (dir === "flat")
    return (
      <svg viewBox="0 0 24 24" fill="none" width={size} height={size}>
        <path
          d="M4 12h16"
          stroke={stroke}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" fill="none" width={size} height={size}>
      <path
        d="M5 19L19 5M19 5h-9M19 5v9"
        stroke={stroke}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SparkSvg({
  size = 12,
  fill = "#8E8E93",
}: {
  size?: number;
  fill?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={fill}>
      <path
        d="M12 3l1.6 6.4L20 11l-6.4 1.6L12 19l-1.6-6.4L4 11l6.4-1.6z"
        opacity="0.7"
      />
    </svg>
  );
}
