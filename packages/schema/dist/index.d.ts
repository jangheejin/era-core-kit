import { z } from 'zod';
export declare const test = 42;
export type CaseStudySort = 'Newest' | 'ClientName' | 'Sector' | 'Year';
export declare const Sector: z.ZodEnum<{
    Defense: "Defense";
    Health: "Health";
    FinTech: "FinTech";
    Education: "Education";
    Nonprofit: "Nonprofit";
    GovContracting: "GovContracting";
    EmergencyMgmt: "EmergencyMgmt";
}>;
export declare const Mechanism: z.ZodEnum<{
    Appropriation: "Appropriation";
    Earmark: "Earmark";
    Grant: "Grant";
    TaxCredit: "TaxCredit";
}>;
export declare const Jurisdiction: z.ZodEnum<{
    Federal: "Federal";
    State: "State";
    Local: "Local";
}>;
export declare const Outcome: z.ZodObject<{
    label: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    evidenceUrl: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const CaseStudySection: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    bodyMDX: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const CaseStudyAttachment: z.ZodObject<{
    label: z.ZodString;
    url: z.ZodString;
    kind: z.ZodDefault<z.ZodEnum<{
        pdf: "pdf";
        ppt: "ppt";
        doc: "doc";
        sheet: "sheet";
        zip: "zip";
        other: "other";
    }>>;
    internalOnly: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const CaseStudyLink: z.ZodObject<{
    label: z.ZodString;
    url: z.ZodString;
    category: z.ZodDefault<z.ZodEnum<{
        client: "client";
        other: "other";
        impact: "impact";
        legislation: "legislation";
        press: "press";
    }>>;
    internalOnly: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const CaseStudy: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    slug: z.ZodString;
    client: z.ZodOptional<z.ZodString>;
    sector: z.ZodEnum<{
        Defense: "Defense";
        Health: "Health";
        FinTech: "FinTech";
        Education: "Education";
        Nonprofit: "Nonprofit";
        GovContracting: "GovContracting";
        EmergencyMgmt: "EmergencyMgmt";
    }>;
    year: z.ZodOptional<z.ZodNumber>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString>>;
    summaryShort: z.ZodString;
    brief: z.ZodOptional<z.ZodString>;
    heroImageUrl: z.ZodString;
    mechanisms: z.ZodDefault<z.ZodArray<z.ZodEnum<{
        Appropriation: "Appropriation";
        Earmark: "Earmark";
        Grant: "Grant";
        TaxCredit: "TaxCredit";
    }>>>;
    jurisdictions: z.ZodDefault<z.ZodArray<z.ZodEnum<{
        Federal: "Federal";
        State: "State";
        Local: "Local";
    }>>>;
    outcomes: z.ZodDefault<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        evidenceUrl: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    evidence: z.ZodDefault<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        url: z.ZodString;
    }, z.core.$strip>>>;
    bodyMDX: z.ZodOptional<z.ZodString>;
    sections: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        bodyMDX: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    attachments: z.ZodDefault<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        url: z.ZodString;
        kind: z.ZodDefault<z.ZodEnum<{
            pdf: "pdf";
            ppt: "ppt";
            doc: "doc";
            sheet: "sheet";
            zip: "zip";
            other: "other";
        }>>;
        internalOnly: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>>;
    links: z.ZodDefault<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        url: z.ZodString;
        category: z.ZodDefault<z.ZodEnum<{
            client: "client";
            other: "other";
            impact: "impact";
            legislation: "legislation";
            press: "press";
        }>>;
        internalOnly: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>>;
    isFeaturedHome: z.ZodDefault<z.ZodBoolean>;
    isPublic: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const Person: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    role: z.ZodString;
    headshotUrl: z.ZodOptional<z.ZodString>;
    bioMDX: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    linkedin: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type CaseStudy = z.infer<typeof CaseStudy>;
export type Person = z.infer<typeof Person>;
export type CaseStudySection = z.infer<typeof CaseStudySection>;
export type CaseStudyAttachment = z.infer<typeof CaseStudyAttachment>;
export type CaseStudyLink = z.infer<typeof CaseStudyLink>;
export type FilterAST = {
    sector?: z.infer<typeof Sector>;
    tags?: string[];
    mechanisms?: z.infer<typeof Mechanism>[];
    yearRange?: {
        min?: number;
        max?: number;
    };
    text?: string;
};
export { CASE_STUDIES_FIXTURE } from './fixtures';
