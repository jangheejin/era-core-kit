//apps/site/src/lib/caseStudiesPublic.ts

import {
  CASE_STUDIES_FIXTURE_FULL,
  type CaseStudyType,
  sectorFromRouteSlug,
  tagSlug,
} from "@kit/schema";

export function getAllCaseStudies(): CaseStudyType[] {
  return CASE_STUDIES_FIXTURE_FULL;
}

export function getCaseStudiesBySectorRouteSlug(
  routeSlug: string,
): CaseStudyType[] {
  const sector = sectorFromRouteSlug(routeSlug);
  if (!sector) return [];
  return getAllCaseStudies().filter((cs) => cs.sectors?.includes(sector));
}

export function getCaseStudiesByTagRouteSlug(
  routeSlug: string,
): CaseStudyType[] {
  return getAllCaseStudies().filter((cs) =>
    (cs.tags ?? []).some((t) => tagSlug(t) === routeSlug),
  );
}

export function listTagRoutes(): Array<{
  slug: string;
  label: string;
  count: number;
}> {
  const counts = new Map<string, { label: string; count: number }>();

  for (const cs of getAllCaseStudies()) {
    for (const raw of cs.tags ?? []) {
      const slug = tagSlug(raw);
      const cur = counts.get(slug);
      if (cur) cur.count += 1;
      else counts.set(slug, { label: raw, count: 1 });
    }
  }

  return [...counts.entries()]
    .map(([slug, v]) => ({ slug, label: v.label, count: v.count }))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}
