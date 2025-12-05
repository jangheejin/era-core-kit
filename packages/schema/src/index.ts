// packages/schema/src/index.ts
// THIS IS NOW JUST A BARREL EXPORT

import { z } from "zod";

export * from "./enums";
export * from "./schemas";
export * from "./seeds";
export * from "./fixtures";

/* export type {
  // inferred union types (from schema)
  CaseStudySort,
  Sector,
  Mechanism,
  Jurisdiction,
  AttachmentKind,
  LinkCategory,
  CaseStudyStatus,
  CaseStudyVisibility,
  OutcomeKind,

  // “pure TS” from arrays (same union, but doesn’t require Zod usage)
  CaseStudySortValue,
  SectorValue,
  MechanismValue,
  JurisdictionValue,
  AttachmentKindValue,
  LinkCategoryValue,
  CaseStudyStatusValue,
  CaseStudyVisibilityValue,
  OutcomeKindValue,
} from "./enums";
 */