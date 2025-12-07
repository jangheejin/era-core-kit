//apps/site/src/lib/caseStudies.ts
import { CASE_STUDIES_FIXTURE_FULL, type CaseStudyType } from "@kit/schema";

//single data source function for the public site
// use fixtures for now
// later swap in CMS (Sanity/DB) without rewriting pages
export async function getCaseStudies(): Promise<CaseStudyType[]> {
  // Fixtures for now. To Do Later: swap this to the real CMS adapter fetch.
  return CASE_STUDIES_FIXTURE_FULL;
}
