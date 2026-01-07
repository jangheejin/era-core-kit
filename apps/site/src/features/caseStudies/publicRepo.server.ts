//apps/site/src/features/caseStudies/publicRepo.server.ts
import { CASE_STUDIES_FIXTURE, type CaseStudyType } from "@kit/schema";

export async function listPublicCaseStudies(): Promise<CaseStudyType[]> {
  return CASE_STUDIES_FIXTURE.filter((cs) => cs.isPublic);
}

export async function getPublicCaseStudyBySlug(
  slug: string,
): Promise<CaseStudyType | null> {
  const all = await listPublicCaseStudies();
  return all.find((cs) => cs.slug === slug) ?? null;
}
