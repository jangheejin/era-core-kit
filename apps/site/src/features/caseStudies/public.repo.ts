//apps/site/src/features/caseStudies/public.repo.ts
import type { CaseStudyType } from "@kit/schema";

// CRUCIAL boundary
// This is the only thing public pages call. 
// (One single module that public pages call, no matter what)

// In the demo version: data comes from localStorage store
// In the real version later: data comes from DB via API
export type PublicCaseStudiesRepo = {
  listPublic(): Promise<CaseStudyType[]>;
  getPublicBySlug(slug: string): Promise<CaseStudyType | null>;
};
