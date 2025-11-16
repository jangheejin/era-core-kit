//packages/cms-contract/src/CMS.ts

//import type { CaseStudy, Person, FilterAST } from '@kit/schema';
/*import type {
  CaseStudy,
  Person,
  FilterAST,
} from '../../schema/src';

import type { CMS } from '@kit/adapters/CMS'; */
import type { CaseStudy, Person, FilterAST } from '@kit/schema';

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
