//apps/site/app/our-work/_demo/DemoOurWorkIndex.tsx
"use client";

import { useMemo } from "react";
import { useAdminCaseStudies } from "../../admin/AdminCaseStudyStore";
import { OurWorkClient, type WorkCase } from "../OurWorkClient";

function toWorkCase(cs: any): WorkCase {
  return {
    slug: cs.slug,
    sector: cs.sectors?.[0] ?? "Case Study",
    client: cs.client?.trim() || cs.title?.trim() || cs.slug,
    featured: true,
    summary: cs.brief?.trim() || cs.summaryShort?.trim() || "",
    outcomes: cs.outcomes,
    imageUrl: cs.heroImageUrl,
  };
}

export function DemoOurWorkIndex() {
  const { items } = useAdminCaseStudies();

  const cases = useMemo(
    () => items.filter((cs) => cs.isPublic).map(toWorkCase),
    [items],
  );

  return <OurWorkClient cases={cases} basePath="/our-work" demo={true} />;
}
