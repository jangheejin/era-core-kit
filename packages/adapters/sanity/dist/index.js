//export { createInMemoryCMS } from './inMemoryCMS';
export * from './inMemoryCMS'; //wildcard export to ensure all symbols are visible
/*export { createInMemoryCMS } from './inMemoryCMS';//Export the in-memory function again for safety
*/
export const sanityAdapter = {
    // Implement Sanity fetching logic here
    async getCaseStudies({ filter, limit, cursor, sort }) {
        return { items: [], nextCursor: undefined };
    },
    async getCaseStudyBySlug(slug) {
        // Implement Sanity fetching logic here
        return null;
    },
    async getPeople() {
        // Implement Sanity fetching logic here
        return [];
    },
    //getPersonBySlug is optional but including it is safe
    async getPersonBySlug(slug) {
        // Implement Sanity fetching logic here
        return null;
    },
    async getHomeFeaturedCaseStudies(limit) {
        // Implement Sanity fetching logic here
        return [];
    },
};
