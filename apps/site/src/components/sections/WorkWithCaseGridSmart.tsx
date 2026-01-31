"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { WorkWithCaseGridProps } from "@kit/blocks";
import { WorkText, CaseGrid } from "@kit/blocks";
import { sectorLabel, type CaseStudyType, type SectorValue } from "@kit/schema";
import { useAdminCaseStudies } from "@/admin/AdminCaseStudyStore";
import { resolveCaseGridLayout } from "@/lib/caseGridLayout";

type CaseGridItem = WorkWithCaseGridProps["items"][number];
type NonEmptyArray<T> = [T, ...T[]];

function toNonEmptyArray<T>(
  items: T[] | undefined,
): NonEmptyArray<T> | undefined {
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
  const {
    layout,
    heading,
    text,
    text2,
    itemsSource,
    maxItems,
    caseStudySlugs,
    featuredCaseStudySlugs,
  } = props;
  const { items: adminItems } = useAdminCaseStudies();

  const items = useMemo(() => {
    const publicItems = adminItems.filter(
      (cs) => Boolean(cs.isPublic) && cs.status === "Published",
    );

    if (itemsSource === "manual") {
      const order = Array.isArray(caseStudySlugs) ? caseStudySlugs : [];
      if (order.length === 0) return [];
      const bySlug = new Map(publicItems.map((cs) => [cs.slug, cs]));
      const ordered = order
        .map((slug) => bySlug.get(slug))
        .filter((cs): cs is CaseStudyType => Boolean(cs));
      const mapped = ordered.map(toCaseGridItem);
      return typeof maxItems === "number" ? mapped.slice(0, maxItems) : mapped;
    }

    if (itemsSource !== "featured") {
      return publicItems.map(toCaseGridItem);
    }

    const featured = publicItems.filter((cs) => Boolean(cs.isFeaturedHome));
    let ordered = featured;

    if (
      Array.isArray(featuredCaseStudySlugs) &&
      featuredCaseStudySlugs.length
    ) {
      const bySlug = new Map(featured.map((cs) => [cs.slug, cs]));
      const orderedFeatured = featuredCaseStudySlugs
        .map((slug) => bySlug.get(slug))
        .filter((cs): cs is CaseStudyType => Boolean(cs));
      ordered = orderedFeatured.length ? orderedFeatured : featured;
    }

    if (typeof maxItems === "number" && ordered.length < maxItems) {
      const orderedSlugs = new Set(ordered.map((cs) => cs.slug));
      const filler = publicItems.filter((cs) => !orderedSlugs.has(cs.slug));
      ordered = [...ordered, ...filler];
    }

    const mapped = ordered.map(toCaseGridItem);
    return typeof maxItems === "number" ? mapped.slice(0, maxItems) : mapped;
  }, [
    adminItems,
    itemsSource,
    maxItems,
    caseStudySlugs,
    featuredCaseStudySlugs,
  ]);

  return (
    <section className="c-section">
      <div className="c-container c-stack">
        <WorkText heading={heading} text={text} text2={text2} />
        {/* <h2 className="type-h2 case-grid-section">Selected Case Studies</h2> */}
        {/* <h3 className="type-h3 case-grid-section">Selected Case Studies</h3> */}
        <CaseGrid
          layout={resolveCaseGridLayout(items.length, layout ?? "3col")}
          items={items}
        />
        <p className="type-h4 case-grid__more">
          SEE MORE OF OUR{" "}
          <Link href="/our-work" className="case-grid__more-link">
            OUR WORK
          </Link>
        </p>
      </div>
    </section>
  );
}
