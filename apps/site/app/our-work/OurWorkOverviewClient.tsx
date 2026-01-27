// apps/site/app/our-work/OurWorkOverviewClient.tsx
"use client";

import { useMemo } from "react";
import { CaseGrid, type CaseGridProps } from "@kit/blocks";
import {
  sectorLabel,
  type CaseStudyType,
  type SectorValue,
} from "@kit/schema";
import { useAdminCaseStudies } from "../admin/AdminCaseStudyStore";

type CaseGridItem = CaseGridProps["items"][number];
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

export function OurWorkOverviewClient() {
  const { items: adminItems } = useAdminCaseStudies();

  const items = useMemo(() => {
    const publicItems = adminItems.filter(
      (cs) => Boolean(cs.isPublic) && cs.status === "Published"
    );
    const featured = publicItems.filter((cs) => Boolean(cs.isFeaturedHome));
    if (featured.length === 0) return [];

    let ordered = featured;
    if (featured.length < 6) {
      const featuredSlugs = new Set(featured.map((cs) => cs.slug));
      const filler = publicItems.filter((cs) => !featuredSlugs.has(cs.slug));
      ordered = [...featured, ...filler].slice(0, 6);
    }

    return ordered.slice(0, 6).map(toCaseGridItem);
  }, [adminItems]);

  return (
    <main>
      <section className="c-section">
        <div className="c-container c-stack">
          <header className="c-stack">
            <h1 className="type-h1">Our Work</h1>
            <p className="type-body">
              Explore a selection of featured case studies that show how we help
              clients move policy forward in Washington.
            </p>
          </header>
          <CaseGrid layout="3col" items={items} />
        </div>
      </section>
    </main>
  );
}
