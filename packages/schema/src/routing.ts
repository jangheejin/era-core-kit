//packages/schema/src/routing.ts
import { SECTOR_VALUES, type SectorValue } from "./enums";

//This is one centralized, shared "slugs and routing" module for use in 
// in the "per-category" or "per-tag" pages (e.g. site.com/sector/nonprofit)

/** Generic slugify for URLs: lowercase, dash-separated */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}


/**
 * TAGS:
 * - Store tags as human-readable strings (trimmed).
 * - Compare/filter/route using tagSlug(tag).
 */
export function normalizeTag(tag: string): string {
  // minimal normalization: trim + collapse whitespace
  return tag.trim().replace(/\s+/g, " ");
}

export function tagSlug(tag: string): string {
  return slugify(normalizeTag(tag));
}

export function normalizeTagList(tags: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  for (const raw of tags) {
    const t = normalizeTag(raw);
    if (!t) continue;

    // dedupe case-insensitively using slug
    const key = tagSlug(t);
    if (seen.has(key)) continue;

    seen.add(key);
    out.push(t);
  }
  return out;
}

/**
 * SECTORS:
 * Keep internal values stable (e.g. "GovContracting"),
 * map to nicer public slugs (e.g. "government-contracting").
 */
export const SECTOR_ROUTE_SLUG: Record<SectorValue, string> = {
  GovContracting: "government-contracting",
  Nonprofit: "nonprofit",
  EmergencyMgmt: "emergency-management",
  Education: "education",
  Geospatial: "geospatial",
  Manufacturing: "manufacturing",
  Industry: "industry",
  Defense: "defense",
  Health: "health",
  FinTech: "fintech",
  CivicTech: "civic-tech",
  Infrastructure: "infrastructure",
} as const satisfies Record<SectorValue, string>;
//};

//protect against duplicate slugs
const seen = new Set<string>();
for (const slug of Object.values(SECTOR_ROUTE_SLUG)) {
  if (seen.has(slug)) throw new Error(`Duplicate sector route slug: ${slug}`);
  seen.add(slug);
}

const ROUTE_SLUG_TO_SECTOR = new Map<string, SectorValue>(
  Object.entries(SECTOR_ROUTE_SLUG).map(([sector, slug]) => [slug, sector as SectorValue]),
);

export function sectorRouteSlug(sector: SectorValue): string {
  return SECTOR_ROUTE_SLUG[sector];
}

export function sectorFromRouteSlug(routeSlug: string): SectorValue | null {
  const s = slugify(routeSlug); // normalize just in case
  return ROUTE_SLUG_TO_SECTOR.get(s) ?? null;
}

/* function sectorSlugToValue(slug: string): SectorValue | null {
  // simplest: enforce URL slugs match enum values lowercased, or define a mapping
  const normalized = slug.toLowerCase();
  const hit = SECTOR_VALUES.find((v) => v.toLowerCase() === normalized);
  return hit ?? null;
} */