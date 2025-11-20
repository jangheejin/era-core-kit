export type CaseStudyId = string;
export interface CaseStudy {
    id: CaseStudyId;
    title: string;
    summary?: string;
    industries?: string[];
    tags?: string[];
    publishedAt?: string;
}
export interface CaseStudySearchFilters {
    query?: string;
    tags?: string[];
    industries?: string[];
    before?: string;
    after?: string;
}
export interface CaseStudySearchResult<T = CaseStudy> {
    items: T[];
    total: number;
}
/**
 * Placeholder search implementation.
 * For now, always returns an empty result.
 *
 * Later you can:
 * - plug in a real search index (Algolia, Meilisearch, etc)
 * - or do in-memory filtering over a static list
 */
export declare function searchCaseStudies(_filters: CaseStudySearchFilters): Promise<CaseStudySearchResult>;
//# sourceMappingURL=index.d.ts.map