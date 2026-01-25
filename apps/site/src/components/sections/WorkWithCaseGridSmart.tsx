"use client";

import { useMemo } from "react";
import type { WorkWithCaseGridProps } from "@kit/blocks";
import { WorkText, CaseGrid } from "@kit/blocks";
import { sectorLabel, type CaseStudyType, type SectorValue } from "@kit/schema";
import { useAdminCaseStudies } from "@/admin/AdminCaseStudyStore";

type CaseGridItem = WorkWithCaseGridProps["items"][number];
type NonEmptyArray<T> = [T, ...T[]];

function toNonEmptyArray<T>(items: T[] | undefined): NonEmptyArray<T> | undefined {
  if (!Array.isArray(items) || items.length === 0) return undefined;
  const first = items[0];
  if (first == null) return undefined;
  return [first, ...items.slice(1)];
}

function toCaseGridItem(cs: CaseStudyType): CaseGridItem {
  const primary: SectorValue | undefined = cs.primarySector ?? cs.sectors?.[0];
  const sectors = toNonEmptyArray(cs.sectors);

  return {
    slug: cs.slug,
    imageUrl: cs.heroImageUrl,
    client: cs.client,
    summary: cs.summaryShort ?? undefined,
    primarySector: primary,
    primarySectorReadable: primary ? sectorLabel(primary) : undefined,
    sectors,
    sectorsReadable: sectors
      ? sectors.map((s) => sectorLabel(s)).join(" · ")
      : undefined,
  };
}

export function WorkWithCaseGridSmart(props: WorkWithCaseGridProps) {
  const { layout, heading, text, text2, itemsSource, maxItems } = props;
  const { items: adminItems } = useAdminCaseStudies();

  const items = useMemo(() => {
    const publicItems = adminItems.filter(
      (cs) => Boolean(cs.isPublic) && cs.status === "Published"
    );

    if (itemsSource !== "featured") {
      return publicItems.map(toCaseGridItem);
    }

    const featured = publicItems.filter((cs) => Boolean(cs.isFeaturedHome));
    let ordered = featured;

    if (typeof maxItems === "number" && featured.length < maxItems) {
      const featuredSlugs = new Set(featured.map((cs) => cs.slug));
      const filler = publicItems.filter((cs) => !featuredSlugs.has(cs.slug));
      ordered = [...featured, ...filler];
    }

    const mapped = ordered.map(toCaseGridItem);
    return typeof maxItems === "number" ? mapped.slice(0, maxItems) : mapped;
  }, [adminItems, itemsSource, maxItems]);

  return (
    <section className="c-section">
      <div className="c-container c-stack">
        <WorkText heading={heading} text={text} text2={text2} />
        {/* <h2 className="type-h2 case-grid-section">Selected Case Studies</h2> */}
        {/* <h3 className="type-h3 case-grid-section">Selected Case Studies</h3> */}
        <CaseGrid layout={layout} items={items} />
      </div>
    </section>
  );
}
