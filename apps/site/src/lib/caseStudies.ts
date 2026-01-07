//apps/site/src/lib/caseStudies.ts
// this is the “build mock CMS into full version” bridge: 
// every page imports from here. later swap only the internals
import { 
  CASE_STUDIES_FIXTURE_FULL, 
  type CaseStudyType,
  type SectorValue,
  sectorFromRouteSlug,
  tagSlug,
  normalizeTagList,
} from "@kit/schema";

//single data source function for the public site
// use fixtures for now
// later swap in CMS (Sanity/DB) without rewriting pages
export async function getCaseStudies(): Promise<CaseStudyType[]> {
  // Fixtures for now. To Do Later: swap this to the real CMS adapter fetch.
  return CASE_STUDIES_FIXTURE_FULL;
}

export async function getPublicCaseStudies(): Promise<CaseStudyType[]> {
  const all = await getCaseStudies();
  return all.filter((cs) => cs.isPublic);
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudyType | null> {
  const all = await getCaseStudies();
  return all.find((cs) => cs.slug === slug) ?? null;
}

export async function getCaseStudiesBySectorRouteSlug(sectorSlug: string) {
  const sector = sectorFromRouteSlug(sectorSlug);
  if (!sector) return { sector: null as SectorValue | null, items: [] as CaseStudyType[] };

  const all = await getPublicCaseStudies();
  const items = all.filter((cs) => cs.sectors?.includes(sector));
  return { sector, items };
}

export async function getCaseStudiesByTagRouteSlug(tagRouteSlug: string) {
  const all = await getPublicCaseStudies();
  const items = all.filter((cs) => {
    const tags = normalizeTagList(cs.tags ?? []);
    return tags.some((t) => tagSlug(t) === tagRouteSlug);
  });
  return items;
}

export async function getTagFacets() {
  const all = await getPublicCaseStudies();
  const counts = new Map<string, { label: string; slug: string; count: number }>();

  for (const cs of all) {
    const tags = normalizeTagList(cs.tags ?? []);
    for (const t of tags) {
      const slug = tagSlug(t);
      const prev = counts.get(slug);
      if (prev) prev.count += 1;
      else counts.set(slug, { label: t, slug, count: 1 });
    }
  }

  return Array.from(counts.values()).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}