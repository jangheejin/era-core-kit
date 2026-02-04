//apps/site/src/lib/publicCaseStudies.repo.fixtures.server.ts
//formerly under ./features and named public instead of publicCaseStudies
import type { PublicCaseStudiesRepo } from "./publicCaseStudies.repo";
import { CASE_STUDIES_FIXTURE, type CaseStudyType } from "@kit/schema";

function isPublic(cs: CaseStudyType) {
  // TODO: adjust to fit canonical rule
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
