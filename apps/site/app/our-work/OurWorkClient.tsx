//apps/site/app/our-work/OurWorkClient.tsx

// update: simplified public Our Work layout (title + intro + case grid)
"use client";

import "@styles/work.css";
import { useMemo } from "react";
import { CaseGrid, type CaseGridProps } from "@kit/blocks";

export type WorkOutcome = {
  label: string;
  description?: string;
};

export type WorkCase = {
  slug: string;
  sector: string;
  client: string;
  featured: boolean;
  summary: string;
  outcomes?: WorkOutcome[];
  imageUrl?: string;
};

type CaseGridItem = CaseGridProps["items"][number];

function toCaseGridItem(cs: WorkCase): CaseGridItem {
  return {
    slug: cs.slug,
    imageUrl: cs.imageUrl ?? "/img/temp.svg",
    client: cs.client,
    summary: cs.summary,
    sectorsReadable: cs.sector,
  };
}

export function OurWorkClient({ cases }: { cases: WorkCase[] }) {
  const featured = useMemo(() => {
    const flagged = cases.filter((c) => c.featured);
    if (flagged.length >= 6) return flagged;
    if (flagged.length === 0) return cases.slice(0, 6);
    const flaggedSlugs = new Set(flagged.map((c) => c.slug));
    const filler = cases.filter((c) => !flaggedSlugs.has(c.slug));
    return [...flagged, ...filler].slice(0, 6);
  }, [cases]);

  if (!featured.length) {
    return (
      <main>
        <section className="c-section work-section">
          <div className="c-container">
            <h1 className="type-h1">Our Work</h1>
            <p className="type-body">Case studies coming soon.</p>
          </div>
        </section>
      </main>
    );
  }

  const gridItems = featured.map(toCaseGridItem);

  return (
    <main>
      <section className="c-section work-section">
        <div className="c-container c-stack">
          <header className="work-header">
            <h1 className="type-h1">Our Work</h1>
            <p className="type-body work-header__intro">
              A quick look at the engagements we highlight most often, spanning
              geospatial, emergency management, government contracting, and
              nonprofit work.
            </p>
          </header>

          <CaseGrid layout="3col" items={gridItems} />
        </div>
      </section>
    </main>
  );
}
