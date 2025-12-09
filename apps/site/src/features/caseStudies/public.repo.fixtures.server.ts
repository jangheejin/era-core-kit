//apps/site/src/features/caseStudies/public.repo.fixtures.server.ts
import type { PublicCaseStudiesRepo } from "./public.repo";
import { CASE_STUDIES_FIXTURE, type CaseStudyType } from "@kit/schema";

function isPublic(cs: CaseStudyType) {
  // adjust to fit canonical rule
  return !!cs.isPublic;
}

export const repoFixtures: PublicCaseStudiesRepo = {
  async listPublic() {
    return CASE_STUDIES_FIXTURE.filter(isPublic);
  },

  async getPublicBySlug(slug: string) {
    const all = await repoFixtures.listPublic();
    return all.find((cs) => cs.slug === slug) ?? null;
  },
};
