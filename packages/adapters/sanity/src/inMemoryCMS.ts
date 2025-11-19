// packages/adapters/sanity/src/inMemoryCMS.ts
import type { CMS } from '@kit/cms-contract';
import { z } from 'zod'; // Need Zod for z.infer
import {
  CASE_STUDIES_FIXTURE,
  type CaseStudy,
  type FilterAST,
  Mechanism,
  type Person
} from '@kit/schema';

// Helper function signature (fixes TS7006/TS7031 inside the function)
function matchesFilter(item: CaseStudy, filter: FilterAST): boolean {
  const tagSet = new Set(item.tags);
  const mechSet = new Set(item.mechanisms);

  if (filter.tags?.length) {
      // Fix for 't' implicit any
      if (!filter.tags.every((t: string) => tagSet.has(t))) return false;
  }
  if (filter.mechanisms?.length) {
      // Fix for 'm' implicit any
      // Use the concrete Mechanism type for the iteration, resolving the TS2345 type error.
      // Must use use typeof Mechanism.Type because the import is a Zod schema, but we need the inferred type.
//      if (!filter.mechanisms.some((m: string) => mechSet.has(m))) return false;
      if (!filter.mechanisms.some((m: z.infer<typeof Mechanism>) => mechSet.has(m))) return false;
  }
  return true;
}

// Define the arguments for getCaseStudies for clarity
interface GetCaseStudiesArgs {
  filter?: FilterAST;
  limit?: number;
  cursor?: string;
  sort?: 'newest' | 'alpha';
}

export class InMemoryCMS implements CMS {
  // FIX for 'filter' and 'cursor' implicit any (TS7031)
  async getCaseStudies({ filter, limit = 20, cursor, sort = 'newest' }: GetCaseStudiesArgs) {
      // FIX for 'cs' implicit any (TS7006)
      let items: CaseStudy[] = CASE_STUDIES_FIXTURE.filter((cs: CaseStudy) =>
          filter ? matchesFilter(cs, filter) : true
      ).filter((cs: CaseStudy) => cs.isPublic);

      // Sort logic (Fixes 'a' and 'b' implicit any (TS7006))
      if (sort === 'newest') {
          items = items.slice().sort((a: CaseStudy, b: CaseStudy) => (b.year ?? 0) - (a.year ?? 0));
      /*} else if (sort === 'oldest') {
          items = items.slice().sort((a: CaseStudy, b: CaseStudy) => (a.year ?? 0) - (b.year ?? 0));
      } else if (sort === 'title') {
          items = items.slice().sort((a: CaseStudy, b: CaseStudy) => a.title.localeCompare(b.title));
      }*/
      } else if (sort === 'alpha') {
          // Sort by title alphabetically (mapping 'alpha' to 'title')
          items = items.slice().sort((a: CaseStudy, b: CaseStudy) => a.title.localeCompare(b.title));
      }

      const start = cursor ? items.findIndex(item => item.slug === cursor) + 1 : 0;
      const end = start + limit;
      const pagedItems = items.slice(start, end);

      const nextCursor = pagedItems.length === limit ? pagedItems[pagedItems.length - 1]?.slug : undefined;

      return {
          items: pagedItems,
          nextCursor,
      };
  }



  //async getCaseStudyBySlug(slug: CaseStudySlug) {
  async getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {    
    const caseStudy = CASE_STUDIES_FIXTURE.find(
      (cs: CaseStudy) => cs.slug === slug && cs.isPublic,
    );
    
    // Contract requires returning null if not found, not undefined.
    return caseStudy ?? null;
  }

  async getPeople(): Promise<Person[]> {
    // Assume PEOPLE_FIXTURE is exported from the schema package's fixtures.
    // If this fixture does not exist, you will need to replace this with an empty array: return [];
    return PEOPLE_FIXTURE;
  }
    
    // FIX for 'cs' implicit any (TS7006)
//      return CASE_STUDIES_FIXTURE.find(
//          (cs: CaseStudy) => cs.slug === slug && cs.isPublic,
//      );
//  }

  async getFeaturedCaseStudies() {
      // FIX for 'cs' implicit any (TS7006)
      return CASE_STUDIES_FIXTURE.filter(
          (cs: CaseStudy) => cs.isPublic && cs.isFeaturedHome,
      );
  }
}


/*function matchesFilter(cs: CaseStudy, filter?: FilterAST): boolean {
  if (!filter) return true;

  if (filter.sector && cs.sector !== filter.sector) return false;

  if (filter.tags && filter.tags.length) {
    const tagSet = new Set(cs.tags);
    if (!filter.tags.every((t) => tagSet.has(t))) return false;
  }

  if (filter.mechanisms && filter.mechanisms.length) {
    const mechSet = new Set(cs.mechanisms);
    if (!filter.mechanisms.some((m) => mechSet.has(m))) return false;
  }

  if (filter.yearRange) {
    const { min, max } = filter.yearRange;
    if (cs.year !== undefined) {
      if (min !== undefined && cs.year < min) return false;
      if (max !== undefined && cs.year > max) return false;
    }
  }

  if (filter.text) {
    const q = filter.text.toLowerCase();
    const haystack = [
      cs.title,
      cs.summaryShort,
      cs.client ?? '',
      cs.tags.join(' '),
    ]
      .join(' ')
      .toLowerCase();

    if (!haystack.includes(q)) return false;
  }

  return true;
}

export function createInMemoryCMS(): CMS {
  const people: Person[] = []; // fill later if you want

  return {
    async getCaseStudies({ filter, limit = 20, cursor, sort = 'newest' }) {
      const startIndex = cursor ? parseInt(cursor, 10) || 0 : 0;

      let items = CASE_STUDIES_FIXTURE.filter((cs) =>
        matchesFilter(cs, filter),
      ).filter((cs) => cs.isPublic);

      if (sort === 'newest') {
        items = items.slice().sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
      } else if (sort === 'alpha') {
        items = items.slice().sort((a, b) => a.title.localeCompare(b.title));
      }

      const page = items.slice(startIndex, startIndex + limit);
      const nextCursor =
        startIndex + limit < items.length
          ? String(startIndex + limit)
          : undefined;

      return { items: page, nextCursor };
    },

    async getCaseStudyBySlug(slug: string) {
      return (
        CASE_STUDIES_FIXTURE.find(
          (cs) => cs.slug === slug && cs.isPublic,
        ) ?? null
      );
    },

    async getPeople() {
      return people;
    },

    async getPersonBySlug(_slug: string) {
      return null;
    },

    async getHomeFeaturedCaseStudies(limit: number) {
      return CASE_STUDIES_FIXTURE.filter(
        (cs) => cs.isPublic && cs.isFeaturedHome,
      ).slice(0, limit);
    },
  };
}
*/