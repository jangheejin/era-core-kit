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
            sector: "Defense" | "Health" | "FinTech" | "Education" | "Nonprofit" | "GovContracting" | "EmergencyMgmt" | "Geospatial" | "CivicTech" | "Infrastructure";
            tags: string[];
            summaryShort: string;
            heroImageUrl: string;
            mechanisms: ("Appropriation" | "Earmark" | "Grant" | "TaxCredit")[];
            jurisdictions: ("Federal" | "State" | "Local")[];
            outcomes: {
                label: string;
                kind?: "Grant" | "Contract" | "Policy" | "Visibility" | "Relationship" | "Savings" | "Efficiency" | "Engagement" | "Operational" | "RiskReduction" | undefined;
                description?: string | undefined;
                evidenceUrl?: string | undefined;
            }[];
            evidence: {
                label: string;
                url: string;
            }[];
            sections: {
                id: string;
                title: string;
                bodyMDX?: string | undefined;
            }[];
            attachments: {
                label: string;
                url: string;
                kind: "pdf" | "ppt" | "doc" | "sheet" | "zip" | "other";
                internalOnly: boolean;
            }[];
            links: {
                label: string;
                url: string;
                category: "client" | "other" | "impact" | "legislation" | "press";
                internalOnly: boolean;
            }[];
            status: "Draft" | "InProgress" | "NeedsReview" | "Approved" | "Published" | "Archived";
            visibility: "Public" | "Internal" | "ClientSafe";
            isFeaturedHome: boolean;
            isPublic: boolean;
            client?: string | undefined;
            year?: number | undefined;
            brief?: string | undefined;
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