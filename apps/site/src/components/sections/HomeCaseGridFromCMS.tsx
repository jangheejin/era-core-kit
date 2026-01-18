// apps/site/src/components/sections/HomeCaseGridFromCMS.tsx
"use client";

import { useMockCMS } from "@/cms/mockCmsStore";
import { CaseGrid, WorkText, type CaseGridProps } from "@kit/blocks";
//import type { CaseGridItem } from "@kit/blocks"; 
import { type SectorValue, DEFAULT_HERO_IMAGE_URL, } from "@kit/schema";

//implementing single-item type 
type CaseGridItemFromProps = CaseGridProps["items"][number];

export function HomeCaseGridFromCMS() {
  //const { caseStudies } = useMockCMS();
  const { caseStudies, addCaseStudy } = useMockCMS();
  const SECTOR_SEPARATOR = ", "; // or " · "

  // If there are zero items, you can fall back to nothing or a gentle message
  //if (!items.length) return null;

  if (!caseStudies || caseStudies.length === 0) {
    // No CMS items → nothing to preview
    return null;
  }

  // Map the case studies in the store to the card props that CaseGrid expects
  //const items: CaseGridProps["items"] = caseStudies.map((cs) => {
  const items = caseStudies.map((cs): CaseGridItemFromProps => {
    // make a non-empty sectors tuple (primary first)
    const sectorsForGrid: [SectorValue, ...SectorValue[]] = [
      cs.primarySector,
      ...cs.sectors.filter((s) => s !== cs.primarySector),
    ];
  
    return {
      //title: cs.title,
      title: (cs.client ?? cs.title ?? "Untitled").trim() || "Untitled",
      summary: cs.summaryShort ?? "",
      imageUrl: cs.heroImageUrl ?? DEFAULT_HERO_IMAGE_URL,
      slug: cs.slug,
      client: cs.client ?? undefined,
      brief: cs.brief ?? undefined,
      primarySector: cs.primarySector,
      sectors: sectorsForGrid,
    };
  });
  
/*   const items: CaseGridProps["items"] = caseStudies.map((cs) => ({
  //const items = caseStudies.map((cs) => ({
    title: cs.title,
    summary: cs.summaryShort ?? "", 
    imageUrl: cs.heroImageUrl ?? "/img/temp.svg", // fallback if you don’t have one
    slug: cs.slug,
    client: cs.client ?? undefined,
    brief: cs.brief ?? undefined,
    //sector: cs.sectors?.join(SECTOR_SEPARATOR) ?? "",
    sectors: cs.sectors ?? [],
    sectorsReadable: (cs.sectors ?? []).join(SECTOR_SEPARATOR) ?? "",
//    sectorsReadable: cs.sectors?.join(SECTOR_SEPARATOR) ?? "",
    //sector: cs.sectors?.[0] ?? "",//only returns the first or primary sector
  })); */

  return (
    <section className="c-section">
      <div className="c-container c-stack">
        <WorkText
          heading="Our Work"
          text="This grid is pulling directly from the CMS demo. Any case study you add in the admin UI (this session) shows up here."
        />
        <CaseGrid layout="3col" items={items} />
      </div>
    </section>
  );
}
