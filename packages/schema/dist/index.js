// packages/schema/src/index.ts
// Export the core data types
//export * from './CaseStudy'; 
//export * from './Filter';
/*
export type {
  // Types needed by adapters/contracts
  CaseStudy,
  CaseStudySort,
  FilterAST
} from './fixtures'; // Assuming CaseStudySort is defined in CaseStudy.ts
*/
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
//NEW: structured sections
export const CaseStudySection = z.object({
    id: z.string(), // stable key, e.g. "context", "approach"
    title: z.string().max(80), // section title
    bodyMDX: z.string().optional(), // markdown/MDX for that section
});
//NEW: attachments (downloads)
export const CaseStudyAttachment = z.object({
    label: z.string().max(120), // "Full report (PDF)"
    url: z.string().url(),
    kind: z
        .enum(['pdf', 'ppt', 'doc', 'sheet', 'zip', 'other'])
        .default('other'),
    internalOnly: z.boolean().default(false),
});
//NEW: extra links
export const CaseStudyLink = z.object({
    label: z.string().max(120), // "Client website", "Legislation text"
    url: z.string().url(),
    category: z
        .enum(['client', 'impact', 'legislation', 'press', 'other'])
        .default('other'),
    internalOnly: z.boolean().default(false),
});
export const CaseStudy = z.object({
    id: z.string(),
    title: z.string().max(120),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    client: z.string().max(80).optional(),
    sector: Sector,
    year: z.number().int().min(1990).max(2100).optional(),
    tags: z.array(z.string()).max(10).default([]),
    summaryShort: z.string().max(180),
    brief: z.string().max(280).optional(),
    heroImageUrl: z.string().url(),
    mechanisms: z.array(Mechanism).default([]),
    jurisdictions: z.array(Jurisdiction).default([]),
    outcomes: z.array(Outcome).default([]),
    evidence: z
        .array(z.object({
        label: z.string(),
        url: z.string().url(),
    }))
        .default([]),
    bodyMDX: z.string().optional(),
    sections: z.array(CaseStudySection).default([]),
    attachments: z.array(CaseStudyAttachment).default([]),
    links: z.array(CaseStudyLink).default([]),
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
export { CASE_STUDIES_FIXTURE } from './fixtures';
