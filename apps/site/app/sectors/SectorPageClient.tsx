// apps/site/app/sectors/SectorPageClient.tsx
"use client";

import { useMemo } from "react";
import { CaseGrid, type CaseGridProps } from "@kit/blocks";
import {
  DEFAULT_HERO_IMAGE_URL,
  sectorLabel,
  type CaseStudyType,
  type SectorValue,
} from "@kit/schema";
import { useAdminCaseStudies } from "../admin/AdminCaseStudyStore";

type CaseGridItemFromProps = CaseGridProps["items"][number];

function toGridItem(cs: CaseStudyType): CaseGridItemFromProps {
  const sectorsForGrid: [SectorValue, ...SectorValue[]] = [
    cs.primarySector,
    ...cs.sectors.filter((s) => s !== cs.primarySector),
  ];

  return {
    slug: cs.slug,
    title: (cs.client ?? cs.title ?? "Untitled").trim() || "Untitled",
    client: cs.client ?? undefined,
    summary: cs.summaryShort ?? undefined,
    brief: cs.brief ?? undefined,
    imageUrl: cs.heroImageUrl ?? DEFAULT_HERO_IMAGE_URL,
    primarySector: cs.primarySector,
    sectors: sectorsForGrid,
  };
}

export function SectorPageClient({ sector }: { sector: SectorValue }) {
  const { items } = useAdminCaseStudies();

  const filtered = useMemo(() => {
    const publicItems = items.filter(
      (cs) => cs.isPublic && cs.status === "Published",
    );
    return publicItems.filter((cs) => cs.sectors?.includes(sector));
  }, [items, sector]);

  const gridItems = useMemo(() => filtered.map(toGridItem), [filtered]);

  return (
    <main className="c-page">
      <section className="c-container c-stack gap5">
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div className="c-stack" style={{ gap: ".35rem" }}>
            <h1 className="type-h2">{sectorLabel(sector)}</h1>
            <p className="muted" style={{ maxWidth: 760 }}>
              Showing {filtered.length} published case stud
              {filtered.length === 1 ? "y" : "ies"} in the {sectorLabel(sector)}{" "}
              category.
            </p>
          </div>
        </header>

        {gridItems.length === 0 ? (
          <div className="muted">No case studies in this category yet.</div>
        ) : (
          <CaseGrid layout="layout-3" items={gridItems} />
        )}
      </section>
    </main>
  );
}
