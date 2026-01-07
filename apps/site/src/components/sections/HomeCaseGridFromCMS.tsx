// apps/site/src/components/sections/HomeCaseGridFromCMS.tsx
"use client";

import { useMockCMS } from "@/cms/mockCmsStore";
import { CaseGrid, WorkText } from "@kit/blocks";
import { title } from "process";

export function HomeCaseGridFromCMS() {
  //const { caseStudies } = useMockCMS();
  const { caseStudies, addCaseStudy } = useMockCMS();

  // Map the case studies in the store to the card props your CaseGrid expects
  const items = caseStudies.map((cs) => ({
    title: cs.title,
    summary: cs.summaryShort ?? "",   // adjust to your schema
    imageUrl: cs.heroImageUrl ?? "/img/temp.svg", // fallback if you don’t have one
    slug: cs.slug,
  }));

  // If there are zero items, you can fall back to nothing or a gentle message
  if (!items.length) return null;

  return (
    <section className="c-section">
      <div className="c-container c-stack">
        <WorkText
          heading="Our Work"
          text="This grid is pulling directly from the CMS demo. Any case study you add in the admin UI (this session) shows up here."
        />
        <CaseGrid layout="4col" items={caseStudies.map((cs) => ({
          title: cs.title,
          summary: cs.summaryShort ?? "",   // adjust to the schema
          imageUrl: cs.heroImageUrl ?? "/img/temp.svg", // fallback if there is no image
          slug: cs.slug,
        }))} />
      </div>
    </section>
  );
}
