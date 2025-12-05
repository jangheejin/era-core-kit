import type { CaseStudyType, FilterAST, Person } from "@kit/schema";
export interface CMS {
    getCaseStudies(args: {
        filter?: FilterAST;
        limit?: number;
        cursor?: string;
        sort?: "newest" | "alpha";
    }): Promise<{
        items: CaseStudyType[];
        nextCursor?: string;
    }>;
    getCaseStudyBySlug(slug: string): Promise<CaseStudyType | null>;
    getPeople(): Promise<Person[]>;
    getPersonBySlug?(slug: string): Promise<Person | null>;
    getHomeFeaturedCaseStudies(limit: number): Promise<CaseStudyType[]>;
}
//# sourceMappingURL=CMS.d.ts.map