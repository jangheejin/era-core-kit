// packages/search/src/index.ts
/**
 * Placeholder search implementation.
 * For now, always returns an empty result.
 *
 * Later you can:
 * - plug in a real search index (Algolia, Meilisearch, etc)
 * - or do in-memory filtering over a static list
 */
export async function searchCaseStudies(_filters) {
    return {
        items: [],
        total: 0
    };
}
