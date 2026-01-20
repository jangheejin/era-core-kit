// apps/site/app/our-work/OurWorkDataBridge.tsx
"use client";

import { useMemo } from "react";
import { deriveSummaryFromWriteUp, type CaseStudyType } from "@kit/schema";
import { useAdminCaseStudies } from "../admin/AdminCaseStudyStore";
import { OurWorkClient, type WorkCase } from "./OurWorkClient";

function toWorkCase(cs: CaseStudyType): WorkCase {
  const sector = Array.isArray(cs?.sectors) ? cs.sectors.join(", ") : "";
  const client = (cs?.client ?? "").trim() || (cs?.title ?? "").trim() || cs.slug;
  const summary =
    (cs?.brief ?? "").trim() ||
    (cs?.summaryShort ?? "").trim() ||
    deriveSummaryFromWriteUp(String(cs?.bodyMDX ?? ""), 180) ||
    "";

  return {
    slug: cs.slug,
    sector,
    client,
    featured: Boolean(cs?.isFeaturedHome),
    summary,
    outcomes: Array.isArray(cs?.outcomes) ? cs.outcomes : undefined,
    imageUrl: cs.heroImageUrl,
  };
}

export function OurWorkDataBridge({
  fallback,
  basePath = "/our-work",
}: {
  fallback: CaseStudyType[];
  basePath?: string;
}) {
  const { items } = useAdminCaseStudies();

  const cases = useMemo(() => {
    const publicItems = items.filter(
      (cs) => cs.isPublic && cs.status === "Published",
    );
    const source = publicItems.length ? publicItems : fallback;
    return source.map(toWorkCase);
  }, [fallback, items]);

  return <OurWorkClient cases={cases} basePath={basePath} demo={false} />;
}
