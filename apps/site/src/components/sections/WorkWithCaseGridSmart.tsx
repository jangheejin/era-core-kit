"use client";

import { useMemo } from "react";
import type { WorkWithCaseGridProps } from "@kit/blocks";
import { WorkText, CaseGrid } from "@kit/blocks";
import { sectorLabel, type CaseStudyType, type SectorValue } from "@kit/schema";
import { useAdminCaseStudies } from "@/admin/AdminCaseStudyStore";

type CaseGridItem = WorkWithCaseGridProps["items"][number];

function toCaseGridItem(cs: CaseStudyType): CaseGridItem {
  const primary: SectorValue | undefined = cs.primarySector ?? cs.sectors?.[0];

  return {
    slug: cs.slug,
    imageUrl: cs.heroImageUrl,
    client: cs.client,
    summary: cs.summaryShort ?? undefined,
    primarySector: primary,
    primarySectorReadable: primary ? sectorLabel(primary) : undefined,
    sectors: (cs.sectors ?? []) as any,
    sectorsReadable: Array.isArray(cs.sectors)
      ? cs.sectors.map((s) => sectorLabel(s)).join(" · ")
      : undefined,
  };
}

export function WorkWithCaseGridSmart(props: WorkWithCaseGridProps) {
  const { items: fallbackItems, layout, heading, text, text2, itemsSource, maxItems } = props;
  const { items: adminItems } = useAdminCaseStudies();

  const items = useMemo(() => {
    if (itemsSource !== "featured") return fallbackItems;

    const featured = adminItems
      .filter((cs) => Boolean(cs.isPublic) && Boolean(cs.isFeaturedHome))
      .map(toCaseGridItem);

    const limited = typeof maxItems === "number" ? featured.slice(0, maxItems) : featured;

    // If nothing is marked featured, fall back (so you don’t get a blank section by accident).
    return limited.length ? limited : fallbackItems;
  }, [adminItems, fallbackItems, itemsSource, maxItems]);

  return (
    <section className="c-section">
      <div className="c-container c-stack">
        <WorkText heading={heading} text={text} text2={text2} />
        <h2 className="type-h2 case-grid-section">Selected Case Studies</h2>
        {/* <h3 className="type-h3 case-grid-section">Selected Case Studies</h3> */}
        <CaseGrid layout={layout} items={items} />
      </div>
    </section>
  );
}
