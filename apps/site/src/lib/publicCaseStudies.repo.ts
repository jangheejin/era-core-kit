//apps/site/src/lib/publicCaseStudies.repo.ts
//formerly under ./features and named public instead of publicCaseStudies
import type { CaseStudyType } from "@kit/schema";

// CRUCIAL boundary
// This is the only thing public pages call.
// (One single module that public pages call, no matter what)

// In the demo version: data is coming from localStorage store
// In the real version later: data will come from DB via API (TODO)
export type PublicCaseStudiesRepo = {
  listPublic(): Promise<CaseStudyType[]>;
  getPublicBySlug(slug: string): Promise<CaseStudyType | null>;
};
