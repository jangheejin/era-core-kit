//apps/site/src/lib/WorkCaseAdapter.ts

//adapter that maps CaseStudyType (CMS version) → WorkCase (public site Our Work page version)
type UnknownRecord = Record<string, unknown>;

export type WorkCase = {
  slug: string;
  sector: string; // display label
  //sector: sectorLabelFromCaseStudy(cs),//ERRORS
  client: string;
  teaser?: string; // short blurb for cards/social
  featured: boolean;
  summary: string; // what your detail panel shows
  outcomes?: string[];
  imageUrl?: string;
};

// Adjust to match actual Sector enum values in schema.
const SECTOR_LABEL: Record<string, string> = {
  GovContracting: "Government Contracting",
  Geospatial: "Geospatial Solutions",
  EmergencyMgmt: "Emergency Response",
  Nonprofit: "Nonprofit Organizations",
  Education: "Education",
  Industry: "Industry",
  Manufacturing: "Manufacturing",
};

function sectorLabelFromSectors(sectors: unknown): string {
  const arr = Array.isArray(sectors) ? sectors : [];
  const labels = arr
    .map((s) => (typeof s === "string" ? (SECTOR_LABEL[s] ?? s) : ""))
    .filter(Boolean);

  // choose one label (or join if you want)
  return labels[0] ?? "Case Study";
}

function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\[[^\]]*\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_>~-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function deriveSummary(cs: UnknownRecord): string {
  // prefer the "short blurb" if present; else derive from body
  const short =
    typeof cs.summaryShort === "string" ? cs.summaryShort.trim() : "";
  if (short) return short;

  const body = typeof cs.bodyMDX === "string" ? cs.bodyMDX : "";
  return stripMarkdown(body);
}

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object";
}

export function toWorkCases(caseStudies: unknown[]): WorkCase[] {
  return (caseStudies ?? []).filter(isRecord).map((cs) => {
    const outcomes =
      Array.isArray(cs.outcomes) && cs.outcomes.length
        ? cs.outcomes
            .map((o) => {
              if (o && typeof o === "object") {
                const rec = o as Record<string, unknown>;
                return typeof rec.description === "string"
                  ? rec.description.trim()
                  : "";
              }
              return typeof o === "string" ? o.trim() : "";
            })
            .filter(Boolean)
        : undefined;

    return {
      slug: String(cs.slug),
      sector: sectorLabelFromSectors(cs.sectors),
      client: String(cs.client),
      teaser: typeof cs.summaryShort === "string" ? cs.summaryShort : undefined,
      featured: Boolean(cs.isFeaturedHome),
      imageUrl:
        typeof cs.heroImageUrl === "string" ? cs.heroImageUrl : undefined,
      summary: deriveSummary(cs),
      outcomes,
    };
  });
}
