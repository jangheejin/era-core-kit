import { z } from 'zod';

export const Sector = z.enum([
  'Defense',
  'Health',
  'FinTech',
  'Education',
  'Nonprofit',
  'GovContracting',
  'EmergencyMgmt',
]);

export const Mechanism = z.enum([
  'Appropriation',
  'Earmark',
  'Grant',
  'TaxCredit',
]);

export const Jurisdiction = z.enum([
  'Federal',
  'State',
  'Local',
]);

export const Outcome = z.object({
  label: z.string().max(80),
  description: z.string().max(240).optional(),
  evidenceUrl: z.string().url().optional(),
});

export const CaseStudy = z.object({
  id: z.string(),
  title: z.string().max(120),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  client: z.string().max(80).optional(),
  sector: Sector,
  tags: z.array(z.string()).max(10).default([]),
  summaryShort: z.string().max(180),
  heroImageUrl: z.string().url(),
  year: z.number().int().min(1990).max(2100).optional(),
  mechanisms: z.array(Mechanism).default([]),
  jurisdictions: z.array(Jurisdiction).default([]),
  outcomes: z.array(Outcome).default([]),
  evidence: z.array(z.object({
    label: z.string(),
    url: z.string().url(),
  })).default([]),
  bodyMDX: z.string().optional(),
  isFeaturedHome: z.boolean().default(false),
  isPublic: z.boolean().default(true),
});

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

export type CaseStudy = z.infer<typeof CaseStudy>;
export type Person = z.infer<typeof Person>;

export type FilterAST = {
  sector?: z.infer<typeof Sector>;
  tags?: string[];
  mechanisms?: z.infer<typeof Mechanism>[];
  yearRange?: { min?: number; max?: number };
  text?: string;
};
