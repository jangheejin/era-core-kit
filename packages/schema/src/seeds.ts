// packages/schema/src/seeds.ts

//Defining a minimal seed type (for fixtures + landing cards) (versus the full CaseStudy type with attachments, full details, etc)
import { z } from "zod";
//import { Sector } from "./index"; 
import { SectorSchema } from "./enums";

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
    sector: SectorSchema,

    // allow either naming (temporarily while we transition from demo to full)
    imageUrl: PathOrUrlSchema.optional(),
    heroImageUrl: PathOrUrlSchema.optional(),

    // allow either naming (temporarily while we transition from demo to full)
    teaser: z.string().max(180).optional(),
    summaryShort: z.string().max(180).optional(),

    // optional upgrade-later fields:
    brief: z.string().max(280).optional(),
    year: z.number().int().min(1990).max(2100).optional(),
    tags: z.array(z.string()).max(10).optional(),

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

    const hasImage = Boolean(v.heroImageUrl?.trim() || v.imageUrl?.trim());
    if (!hasImage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["heroImageUrl"],
        message: "Provide either heroImageUrl or imageUrl (at least one is required).",
      });
    }
  });

export type CaseStudySeedInput = z.input<typeof CaseStudySeedSchema>;
export type CaseStudySeed = z.infer<typeof CaseStudySeedSchema>;

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