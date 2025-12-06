import type { CMS } from "@kit/cms-contract";
import { type FilterAST, type Person, type CaseStudyType as CaseStudy } from "@kit/schema";
interface GetCaseStudiesArgs {
    filter?: FilterAST;
    limit?: number;
    cursor?: string;
    sort?: "newest" | "alpha";
}
export declare class InMemoryCMS implements CMS {
    getCaseStudies({ filter, limit, cursor, sort, }: GetCaseStudiesArgs): Promise<{
        items: {
            id: string;
            title: string;
            slug: string;
            sectors: ("GovContracting" | "Nonprofit" | "EmergencyMgmt" | "Education" | "Geospatial" | "Manufacturing" | "Industry" | "Defense" | "Health" | "FinTech" | "CivicTech" | "Infrastructure")[];
            tags: string[];
            summaryShort: string;
            mechanisms: any[];
            jurisdictions: string[];
            outcomes: any[];
            evidence: any[];
            sections: any[];
            attachments: any[];
            links: any[];
            status: string;
            visibility: string;
            isFeaturedHome: boolean;
            isPublic: boolean;
            client?: string | undefined;
            year?: number | undefined;
            brief?: string | undefined;
            heroImageUrl?: string | undefined;
            bodyMDX?: string | undefined;
        }[];
        nextCursor: string | undefined;
    }>;
    getHomeFeaturedCaseStudies(limit: number): Promise<CaseStudy[]>;
    getCaseStudyBySlug(slug: string): Promise<CaseStudy | null>;
    getPeople(): Promise<Person[]>;
    getFeaturedCaseStudies(): Promise<never[]>;
}
export {};
//# sourceMappingURL=inMemoryCMS.d.ts.map