// packages/search/src/index.ts

export type CaseStudyId = string;

export interface CaseStudy {
  id: CaseStudyId;
  title: string;
  summary?: string;
  industries?: string[];
  tags?: string[];
  publishedAt?: string; // ISO date string
}

export interface CaseStudySearchFilters {
  query?: string; // free-text search
  tags?: string[]; // filter by tags
  industries?: string[]; // filter by industry
  before?: string; // ISO date
  after?: string; // ISO date
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
export async function searchCaseStudies(
  _filters: CaseStudySearchFilters,
): Promise<CaseStudySearchResult> {
  return {
    items: [],
    total: 0,
  };
}
