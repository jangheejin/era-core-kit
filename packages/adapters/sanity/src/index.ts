// packages/adapters/sanity/src/index.ts
import type { CaseStudy, Person, FilterAST } from '@kit/schema';
import type { CMS } from '@kit/cms-contract';//Import the CMS interface for typing 'sanityAdapter'
import type { CaseStudy, CaseStudySort, FilterAST } from '@kit/schema';
//export type { CMS } from '../../CMS';
//export { createInMemoryCMS } from './inMemoryCMS';
export * from './inMemoryCMS';//wildcard export to ensure all symbols are visible
export type { CMS } from '@kit/cms-contract';//re-export the interface itself for consumers that might need it
/*export { createInMemoryCMS } from './inMemoryCMS';//Export the in-memory function again for safety
*/

/*
export const sanityAdapter = {
  get: (slug: string) => {
    return {
      title: "Mock case study",
      slug,
      blocks: [
        { type: "callout", content: "This is a callout!" },
        { type: "pullQuote", content: "Big idea goes here" }
      ],
    };
  },
};*/

export const sanityAdapter: CMS = {
    // Implement Sanity fetching logic here
  async getCaseStudies({ filter, limit, cursor, sort }) {
    return { items: [], nextCursor: undefined };
  },
  async getCaseStudyBySlug(slug: string) {
    // Implement Sanity fetching logic here
    return null;
  },
  async getPeople() {
    // Implement Sanity fetching logic here
    return [];
  },
  //getPersonBySlug is optional but including it is safe
  async getPersonBySlug(slug: string) {
    // Implement Sanity fetching logic here
    return null;
  },
  async getHomeFeaturedCaseStudies(limit: number) {
    // Implement Sanity fetching logic here
    return [];
  },
}