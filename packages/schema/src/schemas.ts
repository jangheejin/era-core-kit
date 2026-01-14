// packages/schema/src/schemas.ts
//
//This is the main “actual schema definitions” file
// FIXTURES IMPORT THIS
// index.ts is now a barrel that re-exports things

import { z } from "zod";

// RUNTIME SCHEMAS
import {
  SectorSchema,
  SectorsSchema,
  MechanismSchema,
  JurisdictionSchema,
  AttachmentKindSchema,
  LinkCategorySchema,

  // new workflow enums
  //CaseStudySortSchema,
  CaseStudyStatusSchema,
  CaseStudyVisibilitySchema,
  OutcomeKindSchema,
} from "./enums";

import { DEFAULT_HERO_IMAGE_URL } from "./constants";

import { deriveSummaryFromWriteUp } from "./authoring";

// ----------HELPERS-------------
const PathOrUrl = z.string().refine((s) => {
  if (!s) return false;
  if (s.startsWith("/")) return true; // "/img/..."
  try {
    new URL(s);
    return true; // "https://..."
  } catch {
    return false;
  }
}, "Must be an absolute URL or a root-relative path like /img/file.webp");
const SlugSchema = z.string().regex(/^[a-z0-9-]+$/, "Slug must be lowercase a-z, 0-9, hyphen");

const TagSchema = z.string().trim().min(1).max(32);
const TagsSchema = z.array(TagSchema).max(10).default([]);

const TagsInputSchema = z.preprocess((v) => {
  // allow tags to be authored as:
  // - ["a","b"]
  // - "a, b"
  // - undefined
  if (v == null) return undefined;
  if (Array.isArray(v)) return v;
  if (typeof v === "string")
    return v
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  return v;
//}, z.array(z.string()).max(10).default([]));
}, z.array(z.string()).default([]));
// --------------------
// Core object schemas (nested objects)
// --------------------
// Outcome (optionally categorizable)
export const Outcome = z.object({
  // Optional now; super useful later for filters + analytics.
  kind: OutcomeKindSchema.optional(),
  label: z.string().max(80),
  description: z.string().max(240).optional(),
  evidenceUrl: z.string().url().optional(),
});

//NEW: structured sections (MDX blocks)
export const CaseStudySection = z.object({
  id: z.string(), // stable key, e.g. "context", "approach"
  title: z.string().max(80),
  bodyMDX: z.string().optional(),
});

//NEW: attachments (downloads)
export const CaseStudyAttachment = z.object({
  label: z.string().max(120),
  url: z.string().url(),
  kind: AttachmentKindSchema.default("other"),
  internalOnly: z.boolean().default(false),
});

//NEW: extra links
export const CaseStudyLink = z.object({
  label: z.string().max(120),
  url: z.string().url(),
  category: LinkCategorySchema.default("other"),
  internalOnly: z.boolean().default(false),
});

//NEW: evidence (sources, docs, references)
export const EvidenceItem = z.object({
  label: z.string().max(120),
  url: z.string().url(),
  internalOnly: z.boolean().default(false),
});

/** Accepts "Health" OR ["Health","Defense"] and produces a validated array */
const SectorsInputSchema = z.preprocess((v) => {
  if (Array.isArray(v)) return v;
  if (typeof v === "string") return [v];
  return v;
}, SectorsSchema);

/** Migrates legacy `{ sector: "X" }` into `{ sectors: ["X"] }` */
function migrateSectorToSectors(raw: unknown) {
  if (!raw || typeof raw !== "object") return raw;
  const r = raw as Record<string, any>;
  if (r.sectors == null && r.sector != null) r.sectors = r.sector;
  return r;
}
// ------------------
// main CaseStudy schema
// ------------------
const CaseStudyCanonicalSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1).max(120),
  slug: SlugSchema,

  // canonical multi-sector field
  sectors: SectorsSchema,

  client: z.string().trim().max(100).optional(),
  year: z.number().int().min(1990).max(2100).optional(),

//  tags: TagSchema,
  tags: TagsInputSchema,
  //summaryShort: z.string(),
  summaryShort: z.string(),//should this be optional?
  brief: z.string().optional(),
  //heroImageUrl: PathOrUrl.optional(),
  heroImageUrl: PathOrUrl.default(DEFAULT_HERO_IMAGE_URL),
  //heroImageUrl: z.string().optional(),

//  mechanisms: z.array(z.any()).default([]),
  mechanisms: z.array(MechanismSchema).default([]),
  //jurisdictions: z.array(z.string()).default([]),
  jurisdictions: z.array(JurisdictionSchema).default([]),
  //outcomes: z.array(z.any()).default([]),
  outcomes: z.array(Outcome).default([]),
  evidence: z.array(EvidenceItem).default([]),

  //bodyMDX: z.string().optional(),
  bodyMDX: z.string().default(""),
  sections: z.array(CaseStudySection).default([]),

  //attachments: z.array(z.any()).default([]),
  attachments: z.array(CaseStudyAttachment).default([]),
  //links: z.array(z.any()).default([]),
  links: z.array(CaseStudyLink).default([]),

  status: CaseStudyStatusSchema.default("Draft"),
  visibility: CaseStudyVisibilitySchema.default("Internal"),
  isFeaturedHome: z.boolean().default(false),
  isPublic: z.boolean().default(true),
});

// 2) Authoring/back-compat input: allow sector OR sectors
const CaseStudyAuthorSchema = CaseStudyCanonicalSchema
  //.omit({ sectors: true })
  .omit({ sectors: true, summaryShort: true })
  .extend({
    // legacy single-sector input (optional)
    sector: SectorSchema.optional(),

    // new multi-sector input (optional at input time)
    sectors: z.array(SectorSchema).optional(),

    //allow authoring without summaryShort
    summaryShort: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    const hasSectors = Array.isArray(val.sectors) && val.sectors.length > 0;
    const hasSector = !!val.sector;

    if (!hasSectors && !hasSector) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sectors"],
        message: "Provide either `sectors` (array) or legacy `sector` (single).",
      });
    }
    //require some content
    const hasBrief = typeof val.brief === "string" && val.brief.trim() !== "";
    const hasBody = typeof val.bodyMDX === "string" && val.bodyMDX.trim() !== "";
    const hasSummary = typeof val.summaryShort === "string" && val.summaryShort.trim() !== "";

    if (!hasBrief && !hasBody && !hasSummary) {
      ctx.addIssue ({
        code: z.ZodIssueCode.custom,
        path: ["brief"],
        message: "Provide either `brief` (preview blurb) or `bodyMDX` (full write-up)",
      });
    }
  })

  .transform((val) => {
    const sectors =
      (val.sectors && val.sectors.length ? val.sectors : val.sector ? [val.sector] : []);
/*       val.sectors?.length ? val.sectors :
      val.sector ? [val.sector] :
      []; */
      //(val.sectors && val.sectors.length ? val.sectors : val.sector ? [val.sector] : []) as unknown;

    // remove legacy `sector` from the canonical output

    //derive summaryShort (author never needs to fill it in)
    const summaryShort = 
      val.summaryShort?.trim() ||
      val.brief?.trim() ||
      deriveSummaryFromWriteUp(val.bodyMDX ?? "", 180);

    const { sector, ...rest } = val as any;
    return { ...rest, sectors, summaryShort };
  })
  .pipe(CaseStudyCanonicalSchema);


//export const CaseStudy = z.object({
/* export const CaseStudy = z.preprocess(
  migrateSectorToSectors,
  z.object ({
    id: z.string(),
    title: z.string().max(120),
    slug: z.string().regex(/^[a-z0-9-]+$/),

    client: z.string().max(80).optional(),
    sectors: SectorSchema,
  //  sector: SectorSchema,
    year: z.number().int().min(1990).max(2100).optional(),

    tags: z.array(z.string()).max(10).default([]),

    summaryShort: z.string().max(180),
    brief: z.string().max(280).optional(),

    // Keep this flexible: allow "/img/..." or full URL
    heroImageUrl: PathOrUrl,

    mechanisms: z.array(MechanismSchema).default([]),
    jurisdictions: z.array(JurisdictionSchema).default([]),
    outcomes: z.array(Outcome).default([]),

    evidence: z
      .array(
        z.object({
          label: z.string(),
          url: z.string().url(),
        }),
      )
      .default([]),

    bodyMDX: z.string().optional(),
    sections: z.array(CaseStudySection).default([]),

    attachments: z.array(CaseStudyAttachment).default([]),
    links: z.array(CaseStudyLink).default([]),

    // “Working tool” fields:
    status: CaseStudyStatusSchema.default("Draft"),
    visibility: CaseStudyVisibilitySchema.default("Internal"),

    // legacy/simple flags still allowed:
    isFeaturedHome: z.boolean().default(false),
    isPublic: z.boolean().default(true),
  })
);
//}); */

//People schema
export const Person = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  headshotUrl: z.string().url().optional(),
  bioMDX: z.string().optional(),
  email: z.string().email().optional(),
  linkedin: z.string().url().optional(),
  sortOrder: z.number().int().default(0),
});

// --------------------
// Types (public API)
// --------------------
// --- (input vs output) ---

// Export the one schema the app uses everywhere
export const CaseStudy = CaseStudyAuthorSchema;

type _CaseStudySchema = typeof CaseStudy;
//CaseStudyInput is a TypeScript type, representing raw input (before parsing). Use when you want to manually create data (write an object by hand rather than getting it from a user form, API response, database, or a Zod parse result)
export type CaseStudyInput = z.input<_CaseStudySchema>;//what the user provides (some fields optional/defaulted)
export type CaseStudyOutput = z.output<_CaseStudySchema>;

// CaseStudyType is a TypeScript type, inferred from the schema
export type CaseStudyType = CaseStudyOutput;//fully parsed and validated version (all defaults applied)

// CaseStudy is the Zod schema object itself 
//  - (used for .parse() and validation)

// CaseStudyInput is a TypeScript type for raw input (before parsing)
//  - use when you want to manually create data (write an object by hand rather than 
//  - getting it from a user form, API response, database, or a Zod parse result)
//  - it's the raw data shape you're allowed to pass into CaseStudy.parse(...)

// CaseStudyType (aka CaseStudyOutput) is a TS type for final output 
//  - the final result AFTER validation
//  - ready for use in the app after being validated + shaped
//  - (it's what you use in props (args), etc)...it's safe for use in UI components, database, etc
//  - default values have been applied, all required fields are present

// If you want to validate and get the full object, you use the schema + output type:
//  
// import { CaseStudy } from "@kit/schema"; // Zod schema (value)
// import type { CaseStudyType } from "@kit/schema"; 
// const final: CaseStudyType = CaseStudy.parse(raw); // <- now validated + defaulted

// Real-world analogy: 
// CaseStudyInput is what you get from a user filling in a form (some fields optional, some missing)
// CaseStudyOutput or CaseStudyType is what happens after you validate that form input and fill in defaults
// Now, it's safe to show that data in the app

// Other schema-derived types (“derived” types from enum schemas, useful in other packages)
export type Outcome = z.infer<typeof Outcome>;
export type Person = z.infer<typeof Person>;
export type CaseStudySection = z.infer<typeof CaseStudySection>;
export type CaseStudyAttachment = z.infer<typeof CaseStudyAttachment>;
export type CaseStudyLink = z.infer<typeof CaseStudyLink>;
export type EvidenceItem = z.infer<typeof EvidenceItem>;

export type FilterAST = {
  sector?: z.infer<typeof SectorSchema>;
  tags?: string[];
  mechanisms?: z.infer<typeof MechanismSchema>[];
  yearRange?: { min?: number; max?: number };
  text?: string;
};