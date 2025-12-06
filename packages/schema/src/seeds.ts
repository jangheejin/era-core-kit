// packages/schema/src/seeds.ts

//Defining a minimal seed type (for fixtures + landing cards) (versus the full CaseStudy type with attachments, full details, etc)
import { z } from "zod";
//import { Sector } from "./index"; 
import { SectorSchema } from "./enums";
import { DEFAULT_HERO_IMAGE_URL } from "@kit/schema"

type Sector = z.infer<typeof SectorSchema>;

const PathOrUrlSchema = z.string().refine(
  (s) => {
    if (!s) return false;
    if (s.startsWith("/")) return true;
    try {
      new URL(s);
      return true;
    } catch {
      return false;
    }
  },
  "Must be an absolute URL or a root-relative path like /img/file.webp",
);

/* const PathOrUrl = z.string().refine((s) => {
  if (s.startsWith("/")) return true;        // "/img/..."
  try { new URL(s); return true; } catch { return false; } // "https://..."
}, "Must be an absolute URL or a root-relative path like /img/file.webp"); */

/* export const CaseStudySeedSchema = z.object({
  slug: z.string(),
  client: z.string(),
  sectorLabel: z.string(),          // your human label (optional)
  sector: Sector,               // your canonical enum
  teaser: z.string(),
  featured: z.boolean().default(false),
  imageUrl: assetRef.optional(),   // allow "/img/..." or https://...
});

export type CaseStudySeed = z.infer<typeof CaseStudySeedSchema>;
 */

/**
 * Seeds are intentionally "short form" and flexible:
 * - allow legacy names (teaser vs summaryShort, imageUrl vs heroImageUrl, featured vs isFeaturedHome)
 * - but require at least ONE summary field and ONE image field so you can't create broken cards
 */

export const CaseStudySeedSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    client: z.string().max(80).optional(),

    // optional “upgrade later” fields:
    title: z.string().max(120).optional(), // can default from client/slug later
    sectorLabel: z.string().optional(), // purely display/help text

    sector: SectorSchema.optional(),
    sectors: z.array(SectorSchema).min(1).optional(),

    // allow either naming (temporarily while we transition from demo to full)
    imageUrl: PathOrUrlSchema.optional(),
    heroImageUrl: PathOrUrlSchema.optional(),

    // allow either naming (temporarily while we transition from demo to full)
    teaser: z.string().max(180).optional(),
    summaryShort: z.string().max(180).optional(),

    // optional upgrade-later fields:
    brief: z.string().max(280).optional(),
    year: z.number().int().min(1990).max(2100).optional(),
    tags: z.array(z.string()).optional(),

    // visibility: accepts either/both (temporarily while we transition from demo to full):
    featured: z.boolean().optional(),
    isFeaturedHome: z.boolean().optional(),
    isPublic: z.boolean().default(true),
  })
  .superRefine((v, ctx) => {
    const hasSummary = Boolean(v.summaryShort?.trim() || v.teaser?.trim());
    if (!hasSummary) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["summaryShort"],
        message: "Provide either summaryShort or teaser (at least one is required).",
      });
    }

/*     const hasImage = Boolean(v.heroImageUrl?.trim() || v.imageUrl?.trim());
    if (!hasImage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["heroImageUrl"],
        message: "Provide either heroImageUrl or imageUrl (at least one is required).",
      });
    } */
    
/*     const hasSectors = Array.isArray(v.sectors) && v.sectors.length > 0;
    const hasSector = !!v.sector; */

    const sectorsArr = Array.isArray(v.sectors) && v.sectors.length > 0 ? v.sectors : null;
    const sectorOne = v.sector ?? null;

    if (!sectorsArr && !sectorOne) {
    //if (hasSectors && hasSector) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sectors"],
        message: "Provide either `sectors` (array) or legacy `sector` (single), not both.",
      });
      return;
    }

/*     if (!hasSectors && !hasSector) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sectors"],  
        message: "Provide either `sectors` (array) or legacy `sector` (single).",
      });
    }
  }) */

/*   .transform((val) => {
    const sectors =
      (val.sectors && val.sectors.length ? val.sectors : val.sector ? [val.sector] : []) as any;

    const { sector, ...rest } = val as any;
    return { ...rest, sectors }; */

    // If both are provided, require consistency
    if (sectorsArr && sectorOne && !sectorsArr.includes(sectorOne)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sector"],
        message: "`sector` must be one of the values in `sectors`.",
      });
    }
  })
  .transform((val) => {
    const sectors: Sector[] =
      val.sectors?.length ? val.sectors
      : val.sector ? [val.sector]
      : [];
    //superRefine guarantees sectors.length >= 1
    const sector: Sector = val.sector ?? sectors[0]!;

    const heroImageUrl = 
      (val.heroImageUrl ?? val.imageUrl ?? DEFAULT_HERO_IMAGE_URL).trim();

    return { ...val, sector, sectors, heroImageUrl };
  });
/*   .transform((val) => {
    const sectors =
      (val.sectors?.length ? val.sectors : val.sector ? [val.sector] : []) as Sector[];

    const sector = (val.sector ?? sectors[0]) as Sector;

    // IMPORTANT: do NOT delete `sector`. Keep both.
    return { ...val, sector, sectors };
  }); */
/*   .transform((v) => {
    const sectors =
      (v.sectors && v.sectors.length ? v.sectors : v.sector ? [v.sector] : []) as any;

    const { sector, ...rest } = v as any;
    return { ...rest, sectors };

  }); */

export type CaseStudySeedInput = z.input<typeof CaseStudySeedSchema>;// BEFORE parse (raw authoring)
export type CaseStudySeed      = z.output<typeof CaseStudySeedSchema>;  // AFTER parse (post-transform)
//export type CaseStudySeed = z.infer<typeof CaseStudySeedSchema>;

/* 
export const CaseStudySeedSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  client: z.string().optional(),

  // optional “upgrade later” fields:
  title: z.string().max(120).optional(),//can still default from client if missing

  sectorLabel: z.string().optional(),   // purely display/help text
  sector: Sector,                      // canonical enum

  //accepts either:
  imageUrl: PathOrUrl.optional(),
  heroImageUrl: PathOrUrl.optional(),

  //acccepts either:
  teaser: z.string().max(180),
  summaryShort: z.string().max(180).optional(),

  //optional upgrade-later fields
  brief: z.string().max(280).optional(),
  year: z.number().int().min(1990).max(2100).optional(),
  tags: z.array(z.string()).max(10).optional(),

  //visibility: accepts any of these:
  isPublic: z.boolean().default(true),
  featured: z.boolean().default(false),
  isFeaturedHome: z.boolean().optional(),
});

export type CaseStudySeed = z.infer<typeof CaseStudySeedSchema>; */