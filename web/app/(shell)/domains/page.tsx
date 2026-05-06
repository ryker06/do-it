"use client";

import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
import { DomainGlyph, ChevSvg, ArrowSvg } from "@/components/icons";
import type { DomainMomentum } from "@/lib/types";

const MOMENTUM: Record<DomainMomentum, string> = {
  strong: "Strong rhythm",
  stable: "Stable rhythm",
  weak: "Weak rhythm",
  inactive: "Quiet period",
};

export default function DomainsPage() {
  const { domains, hydrated } = useDoIt();
  void hydrated;

  return (
    <>
      <Topbar name="Domains" sub="how life is moving" />

      <div className="section-eyebrow">
        <span className="lbl">Five areas</span>
        <span className="rule" />
        <span className="meta">this week</span>
      </div>

      <div>
        {domains.map((d) => (
          <div key={d.id} className="dcard">
            <div className="dcard-head">
              <div className={`ddisc ${d.id} lg`}>
                <DomainGlyph id={d.id} />
              </div>
              <div className="dcard-body">
                <div className="dcard-name">{d.name}</div>
                <div className="dcard-meta">
                  <span className="rhythm">{MOMENTUM[d.momentum]}</span>
                  <span className="sep">·</span>
                  <ArrowSvg
                    dir={d.direction === "improving" ? "up" : "flat"}
                    stroke="#6E6E73"
                    size={9}
                  />
                  <span style={{ color: "#6E6E73", fontWeight: 600 }}>
                    {d.direction}
                  </span>
                  <span className="sep">·</span>
                  <span className="last">{d.lastEngagement}</span>
                </div>
              </div>
              <div className="dcard-chev">
                <ChevSvg />
              </div>
            </div>
            <div className="next">
              <span className="lbl">Next</span>
              <span className="vline" />
              <span className="text">{d.nextAction}</span>
              <span className="go">
                <ChevSvg size={8} stroke="#1C1C1E" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
