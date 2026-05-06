"use client";

import { useEffect, useState } from "react";

export function DesktopTitlebar({
  action,
}: {
  action?: { label: string; href?: string; onClick?: () => void };
}) {
  const [sub, setSub] = useState("ready when you are.");

  useEffect(() => {
    function tick() {
      const h = new Date().getHours();
      if (h >= 21 || h < 5) setSub("wind down.");
      else if (h >= 17) setSub("evening push.");
      else setSub("ready when you are.");
    }
    tick();
    const t = setInterval(tick, 60_000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="titlebar-desktop">
      <span className="greet">
        adam. <span className="sub">{sub}</span>
      </span>
      <div className="actions">
        {action &&
          (action.href ? (
            <a href={action.href} className="ax">
              {action.label}
            </a>
          ) : (
            <button className="ax" onClick={action.onClick}>
              {action.label}
            </button>
          ))}
        <span
          className="ax"
          style={{ fontFamily: "SF Mono, ui-monospace, monospace" }}
        >
          ⌘K search
        </span>
      </div>
    </div>
  );
}
