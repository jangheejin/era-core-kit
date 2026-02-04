//apps/site/src/lib/publicCaseStudiesRepo.server.ts
//formerly under ./features and named publicRepo instead of publicCaseStudiesRepo
import { CASE_STUDIES_FIXTURE, type CaseStudyType } from "@kit/schema";

export async function listPublicCaseStudies(): Promise<CaseStudyType[]> {
  return CASE_STUDIES_FIXTURE.filter(
    (cs) => cs.isPublic && cs.status === "Published",
  );
}

export async function getPublicCaseStudyBySlug(
  slug: string,
): Promise<CaseStudyType | null> {
  const all = await listPublicCaseStudies();
  return all.find((cs) => cs.slug === slug) ?? null;
}
