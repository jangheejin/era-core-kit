//apps/site/src/features/caseStudies/public.server.ts

//CHOOSER
//Public pages will only import getPublicRepo() going forward.

import type { PublicCaseStudiesRepo } from "@/features/caseStudies/public.repo";
import { repoFixtures } from "@/features/caseStudies/public.repo.fixtures.server";

// Later: add repoDb and switch via env flag.
// For now: Don’t import repoDb until it exists. always use fixtures, stable SSR.
export function getPublicRepo(): PublicCaseStudiesRepo {
  return repoFixtures;
}
