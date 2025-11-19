import { CASE_STUDIES_FIXTURE } from '@kit/schema';
// Helper function signature (fixes TS7006/TS7031 inside the function)
// Goal: "Only keep items (case studies) whose tags and mechanisms match what the user has selected"
function matchesFilter(item, filter) {
    const tagSet = new Set(item.tags); //where item is a case study
    const mechSet = new Set(item.mechanisms);
    if (filter.tags?.length) {
        // Fix for 't' implicit any
        //if (!filter.tags.every((t: string) => tagSet.has(t))) return false;
        if (!filter.tags.every((t) => tagSet.has(t)))
            return false;
    }
    if (filter.mechanisms?.length) {
        // Fix for 'm' implicit any
        // Use the concrete Mechanism type for the iteration, resolving the TS2345 type error.
        // Must use use typeof Mechanism.Type because the import is a Zod schema, but we need the inferred type.
        //      if (!filter.mechanisms.some((m: string) => mechSet.has(m))) return false;
        //      if (!filter.mechanisms.some((m: z.infer<typeof Mechanism>) => mechSet.has(m))) return false;
        if (!filter.mechanisms.some((m) => mechSet.has(m)))
            return false;
        //TEMPORARY FIX. If I really want to enforce the Mechanism values (later), I can extract the inferred type like this:
        // type MechanismValue = z.infer<typeof Mechanism>; // e.g. "Grant" | "Earmark"
        // And then optionally annotate filter.mechanisms: MechanismValue[] in  schema or types.
    }
    return true;
}
getHomeFeaturedCaseStudies(limit, number);
Promise < CaseStudy[] > {
    // TEMP FIX – return empty array for now
    return: Promise.resolve([])
};
export class InMemoryCMS {
    // FIX for 'filter' and 'cursor' implicit any (TS7031)
    async getCaseStudies({ filter, limit = 20, cursor, sort = 'newest' }) {
        // FIX for 'cs' implicit any (TS7006)
        let items = CASE_STUDIES_FIXTURE.filter((cs) => filter ? matchesFilter(cs, filter) : true).filter((cs) => cs.isPublic);
        // Sort logic (Fixes 'a' and 'b' implicit any (TS7006))
        if (sort === 'newest') {
            items = items.slice().sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
            /*} else if (sort === 'oldest') {
                items = items.slice().sort((a: CaseStudy, b: CaseStudy) => (a.year ?? 0) - (b.year ?? 0));
            } else if (sort === 'title') {
                items = items.slice().sort((a: CaseStudy, b: CaseStudy) => a.title.localeCompare(b.title));
            }*/
        }
        else if (sort === 'alpha') {
            // Sort by title alphabetically (mapping 'alpha' to 'title')
            items = items.slice().sort((a, b) => a.title.localeCompare(b.title));
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
    async getCaseStudyBySlug(slug) {
        const caseStudy = CASE_STUDIES_FIXTURE.find((cs) => cs.slug === slug && cs.isPublic);
        // Contract requires returning null if not found, not undefined.
        return caseStudy ?? null;
    }
    //TEMPORARILY REPLACED/STUBBED TO STABILIZE
    /*
    async getPeople(): Promise<Person[]> {
      // Assume PEOPLE_FIXTURE is exported from the schema package's fixtures.
      // If this fixture does not exist, you will need to replace this with an empty array: return [];
      return PEOPLE_FIXTURE;
    }*/
    // FIX for 'cs' implicit any (TS7006)
    //      return CASE_STUDIES_FIXTURE.find(
    //          (cs: CaseStudy) => cs.slug === slug && cs.isPublic,
    //      );
    //  }
    async getPeople() {
        return []; // stubbed — won't break anything, satisfies contract
    }
    async getFeaturedCaseStudies() {
        // FIX for 'cs' implicit any (TS7006)
        //return CASE_STUDIES_FIXTURE.filter(
        //    (cs: CaseStudy) => cs.isPublic && cs.isFeaturedHome,
        //);
        //to fix later. this was causing error TS2741: Property 'getHomeFeaturedCaseStudies' is missing in type 'InMemoryCMS' but required in type 'CMS'
        //
        return [];
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
