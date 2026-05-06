"use client";

import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
import { DomainGlyph, SparkSvg } from "@/components/icons";

export default function VisionsPage() {
  const { visions, domains } = useDoIt();

  const hero = visions.find((v) => v.id === "v7") ?? visions[0];
  const grid = visions.filter((v) => v.id !== hero.id);

  return (
    <>
      <Topbar name="Visions" sub="where you're headed" />

      <div className="section-eyebrow">
        <span className="lbl">What you&apos;re building</span>
        <span className="rule" />
        <span className="meta">{visions.length} threads</span>
      </div>

      <div className="viz-hero">
        <div className="pin">⌖ The spine</div>
        <div className="row1">
          <div className="ddisc learning lg">
            <DomainGlyph id={hero.domainId} />
          </div>
          <div style={{ flex: 1 }}>
            <div
              className="title"
              style={{
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: "-0.038em",
                lineHeight: 1.05,
              }}
            >
              {hero.title}
            </div>
          </div>
        </div>
        <div className="blurb">{hero.blurb}</div>
      </div>

      <div className="viz-grid">
        {grid.map((v) => {
          const d = domains.find((x) => x.id === v.domainId);
          return (
            <div key={v.id} className="viz-tile">
              <div className="spark">
                <SparkSvg />
              </div>
              <div className={`ddisc ${v.domainId} sm`}>
                <DomainGlyph id={v.domainId} />
              </div>
              <div className="name">{v.title}</div>
              <div className="tag">{shorten(v.blurb)}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function shorten(s: string): string {
  if (s.length <= 60) return s;
  return s.slice(0, 57) + "…";
}
