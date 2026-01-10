// packages/schema/src/enums.ts
import { z } from "zod";
/* NOTE: Do NOT import from "." or "./index" here (circular dependency risk!!!) */

//import { Outcome } from ".";

/* PURPOSE: Centralized controlled vocabularies (enums) for use across the schema.
 GOAL: prevent circular dependencies by isolating enums here.
 
 EXPLANATION: “enums” should contain only the fields that are genuinely a finite, controlled vocabulary 
 (stuff that validation-before-saving + UI filters will depend on)
*/
/**GENERAL STRUCTURE
 * 1) value arrays (runtime UI lists), e.g. export const SECTOR_VALUES = [..., ..., ...]
 * 2) Zod schemas (runtime validation schemas), e.g. export const SectorSchema = z.enum(SECTOR_VALUES);
 * 3) TS types (used at compile-time), e.g. export type Sector = z.infer<typeof SectorSchema>;
 */

/**
 * HELPER:
 * Zod's z.enum wants a *mutable* tuple type.
 * `as const` creates a *readonly* tuple, so we centralize the one coercion here
 * instead of sprinkling casts everywhere.
 */
const zEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.enum(values as unknown as [T[number], ...T[number][]]);

// --------------------
// SORTING (UI-only but still finite)
// --------------------
/**
 * even though Sort is UI state and not stored in the CaseStudy object,
 * it’s still a finite set you want as runtime values for a dropdown.
 */
export const CASE_STUDY_SORTS = [ "Newest", "ClientName", "Sector", "Year", ] as const;//UI uses CASE_STUDY_SORTS
//export type CaseStudySort = (typeof CASE_STUDY_SORTS)[number];//types use CaseStudySort
export type CaseStudySortValue = (typeof CASE_STUDY_SORTS)[number];
export const CaseStudySortSchema = z.enum(CASE_STUDY_SORTS);//validation uses CaseStudySortSchema
export type CaseStudySort = z.infer<typeof CaseStudySortSchema>;

//export const CaseStudySort = z.enum(["Newest", "ClientName", "Sector", "Year"]);//ensures the dropdown options can only be these values
//export const CASE_STUDY_SORTS = ["Newest", "ClientName", "Sector", "Year"] as const;
//export type CaseStudySortValue = (typeof CASE_STUDY_SORTS)[number];
//export const CaseStudySortSchema = z.enum(CASE_STUDY_SORTS);

/* export const CaseStudySortSchema = z.enum(
  [...CASE_STUDY_SORTS] as [CaseStudySortValue, ...CaseStudySortValue[]]
); */

// --------------------
// CORE CONTROLLED TAXONOMY ENUMS (stored in data and used in UI filters)
// --------------------
/* 
* Sectors are a controlled taxonomy (filters/navigation/IA). 
* This list needs to be kept small and controlled. It can easily be expanded later, but 
*/
//export const Sector = z.enum([
export const SECTOR_VALUES = [
  "Environment",
  "PublicSector",
  "NaturalResources",
  "Energy",
  "Agriculture",
  "Transportation",
//  "InfrastructurePublicWorks",
  "Appropriations",
  "GrantFunding",
  "StateGovernment",
  "LocalGovernment",
  "TribalGovernment",
  "PrivateSector",
  "GovContracting",
  "Nonprofit",
  "EmergencyMgmt",
  "Education",
  "Geospatial",
  "Manufacturing",
  "Industry",
  "Defense",
  "Health",
  "FinTech",
  "CivicTech",
  "Infrastructure",
//]);
] as const;
export type SectorValue = (typeof SECTOR_VALUES)[number];
export const SectorSchema = z.enum(SECTOR_VALUES);
export type Sector = z.infer<typeof SectorSchema>;

// NEW: multi-sector, normalized to an array
/* export const SectorsSchema = z.preprocess(
  (v) => {
    if (Array.isArray(v)) return v;
    if (typeof v === "string") return [v]; // back-compat
    return v;
  },
  z.array(SectorSchema).min(1),
); */
export const SectorsSchema = z.array(SectorSchema).min(1);
export type Sectors = z.infer<typeof SectorsSchema>;
/* 
export type Sector = (typeof SECTOR_VALUES)[number];
export const SectorSchema = z.enum(SECTOR_VALUES); */
/* export type Sector = z.infer<typeof SectorSchema>;
export type SectorValue = (typeof SECTOR_VALUES)[number];//for when you just need the string values without usding Zod (pure TS)
 */

export const SECTOR_LABELS: Record<SectorValue, string> = {
  Environment: "Environment",
  PublicSector: "Public sector",
  NaturalResources: "Natural resources",
  Energy: "Energy",
  Agriculture: "Agriculture",
  Transportation: "Transportation",
//  InfrastructurePublicWorks: "Infrastructure / public works",
  Appropriations: "Appropriations",
  GrantFunding: "Grant funding",
  StateGovernment: "State government",
  LocalGovernment: "Local government",
  TribalGovernment: "Tribal government",
  PrivateSector: "Private sector",
  GovContracting: "Government contracting",
  Nonprofit: "Nonprofit",
  EmergencyMgmt: "Emergency management",
  Education: "Education",
  Geospatial: "Geospatial",
  Manufacturing: "Manufacturing",
  Industry: "Industry",
  Defense: "Defense",
  Health: "Health",
  FinTech: "FinTech",
  CivicTech: "Civic tech",
  Infrastructure: "Infrastructure",
};
export function sectorLabel(v: SectorValue) {
  return SECTOR_LABELS[v] ?? v;
}
/**
 * Mechanism is an explicit controlled list (filter pills, validation)
 * (filter pills are the little clickable toggles that let you filter by things like Mechanism)
 */
//export const Mechanism = z.enum([
export const MECHANISM_VALUES = [
  "Appropriation",
  "Earmark",
  "Grant",
  "TaxCredit",
//]);
] as const;
//Zod enums (schemas)
export type MechanismValue = (typeof MECHANISM_VALUES)[number];
export const MechanismSchema = z.enum(MECHANISM_VALUES);
export type Mechanism = z.infer<typeof MechanismSchema>;
/* export type Mechanism = z.infer<typeof MechanismSchema>;
export const MechanismSchema = z.enum(MECHANISM_VALUES); */
//export type MechanismValue = (typeof MECHANISM_VALUES)[number];//for when you just need the string values without usding Zod (pure TS)

/**
 * Jurisdiction is a finite controlled list. 
 */
//export const Jurisdiction = z.enum(["Federal", "State", "Local"]);
export const JURISDICTION_VALUES = [
  "Federal", 
  "State", 
  "Local",
] as const;
//Zod enums (schemas)
export type JurisdictionValue = (typeof JURISDICTION_VALUES)[number];
export const JurisdictionSchema = z.enum(JURISDICTION_VALUES);
export type Jurisdiction = z.infer<typeof JurisdictionSchema>;
/* export const JurisdictionSchema = z.enum(JURISDICTION_VALUES);
export type Jurisdiction = z.infer<typeof JurisdictionSchema>;
export type JurisdictionValue = (typeof JURISDICTION_VALUES)[number];//for when you just need the string values without usding Zod (pure TS)
 */

// --------------------
// Embedded enum fields in nested objects
// --------------------
/** These are enums already embedded in schema objects
 * Pulling them out prevents “random string drift” across the repo.
 */
//export const AttachmentKind = z.enum(["pdf", "ppt", "doc", "sheet", "zip", "other"]);
export const ATTACHMENT_KIND_VALUES = [
  "pdf",
  "ppt",
  "doc",
  "sheet",
  "zip",
  "other",
] as const;
//Zod enums (schemas)
export type AttachmentKindValue = (typeof ATTACHMENT_KIND_VALUES)[number];
export const AttachmentKindSchema = z.enum(ATTACHMENT_KIND_VALUES);
export type AttachmentKind = z.infer<typeof AttachmentKindSchema>;
/* export const AttachmentKindSchema = z.enum(ATTACHMENT_KIND_VALUES);
export type AttachmentKind = z.infer<typeof AttachmentKindSchema>;
export type AttachmentKindValue = (typeof ATTACHMENT_KIND_VALUES)[number];//for when you just need the string values without usding Zod (pure TS)export type OutcomeKindValue = (typeof OUTCOME_KIND_VALUES)[number];
 */

//export const LinkCategory = z.enum(["client", "impact", "legislation", "press", "other"]);
export const LINK_CATEGORY_VALUES = [
  "client",
  "impact",
  "legislation",
  "press",
  "other",
] as const;
//Zod enums (schemas)
export type LinkCategoryValue = (typeof LINK_CATEGORY_VALUES)[number];
export const LinkCategorySchema = z.enum(LINK_CATEGORY_VALUES);
export type LinkCategory = z.infer<typeof LinkCategorySchema>;
/* export const LinkCategorySchema = z.enum(LINK_CATEGORY_VALUES);
export type LinkCategory = z.infer<typeof LinkCategorySchema>;
export type LinkCategoryValue = (typeof LINK_CATEGORY_VALUES)[number];//for when you just need the string values without usding Zod (pure TS) */

// --------------------
// Tools for an actually functional internal working system (CMS-ish workflow enums)
// --------------------
export const CASE_STUDY_STATUS_VALUES = [
  "Draft",//not ready to show to anyone
  "InProgress",//being worked on, but can be viewed by internal team
  "NeedsReview",
  "Approved",//content is done but waiting for publication
  "Published",//possible now to be publicly visible (still depends on Visibility flags)
  "Archived",
] as const;
export type CaseStudyStatusValue = (typeof CASE_STUDY_STATUS_VALUES)[number];
export const CaseStudyStatusSchema = z.enum(CASE_STUDY_STATUS_VALUES);
export type CaseStudyStatus = z.infer<typeof CaseStudyStatusSchema>;
/* export const CaseStudyStatusSchema = z.enum(CASE_STUDY_STATUS_VALUES);
export type CaseStudyStatus = z.infer<typeof CaseStudyStatusSchema>;
export type CaseStudyStatusValue = (typeof CASE_STUDY_STATUS_VALUES)[number];//for when you just need the string values without usding Zod (pure TS)
 */

export const CASE_STUDY_VISIBILITY_VALUES = [
  "Public",
  "Internal",
  "ClientSafe",//ok to send to clients/prospects but not necessarily public
] as const;
export type CaseStudyVisibilityValue = (typeof CASE_STUDY_VISIBILITY_VALUES)[number];
export const CaseStudyVisibilitySchema = z.enum(CASE_STUDY_VISIBILITY_VALUES);
export type CaseStudyVisibility = z.infer<typeof CaseStudyVisibilitySchema>;
/* export const CaseStudyVisibilitySchema = z.enum(CASE_STUDY_VISIBILITY_VALUES);
export type CaseStudyVisibility = z.infer<typeof CaseStudyVisibilitySchema>;
export type CaseStudyVisibilityValue = (typeof CASE_STUDY_VISIBILITY_VALUES)[number];//for when you just need the string values without usding Zod (pure TS
 */
export const OUTCOME_KIND_VALUES = [
  "Contract",
  "Grant",
  "Policy",//language added, bill movement, rule change
  "Visibility",//media mentions, awareness raised
  "Relationship",//new agency relationships, Hill contacts

  "Savings",
  "Efficiency",//time saved, process improved
  "Engagement",//people reached
  "Operational", //process improvements, internal capacity built
  "RiskReduction",
] as const;
export type OutcomeKindValue = (typeof OUTCOME_KIND_VALUES)[number];
export const OutcomeKindSchema = z.enum(OUTCOME_KIND_VALUES);
export type OutcomeKind = z.infer<typeof OutcomeKindSchema>;

/* export const OutcomeKindSchema = z.enum(OUTCOME_KIND_VALUES);
export type OutcomeKind = z.infer<typeof OutcomeKindSchema>;
export type OutcomeKindValue = (typeof OUTCOME_KIND_VALUES)[number];//for when you just need the string values without usding Zod (pure TS) */