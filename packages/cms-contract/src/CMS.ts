// packages/cms-contract/src/CMS.ts
import type { CaseStudy, FilterAST, Person } from '@kit/schema';

// TEMP DEBUG:
import { CASE_STUDIES_FIXTURE } from '@kit/schema';

console.log(CASE_STUDIES_FIXTURE);

export interface CMS {
  getCaseStudies(args: {
    filter?: FilterAST;
    limit?: number;
    cursor?: string;
    sort?: 'newest' | 'alpha';
  }): Promise<{ items: CaseStudy[]; nextCursor?: string }>;

  getCaseStudyBySlug(slug: string): Promise<CaseStudy | null>;

  getPeople(): Promise<Person[]>;

  getPersonBySlug?(slug: string): Promise<Person | null>;

  getHomeFeaturedCaseStudies(limit: number): Promise<CaseStudy[]>;
}
