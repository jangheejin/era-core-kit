// packages/schema/src/fixtures.ts

// The mock case study entries created to populate the mock database

/* import type { CaseStudy } from "./index"; */
//normalize seeds (shorter-form case studies meant for landing cards, etc) into full CaseStudy entries at import time
import {
  CaseStudy as CaseStudySchema,
  type CaseStudyType,
  type CaseStudyInput,
} from "./schemas";

import { CaseStudySeedSchema, type CaseStudySeedInput } from "./seeds";
// --------------------

// --------------------
// Full raw entries (authorable input shape)→ parsed into canonical CaseStudyType (output)
// These were already written earlier (author as INPUT, parse to OUTPUT)
// To be used later. Avoids TS complaining about defaulted fields like status/visibility/etc.
// --------------------

//export const CASE_STUDIES_FIXTURE_FULL: CaseStudy[] = [
  const CASE_STUDIES_FIXTURE_FULL_RAW: CaseStudyInput[] = [
  {
    id: "cs-sanborn-appgeo",
    title: "FAKE TITLE HERE",
    slug: "sanborn-appgeo",
    client: "Sanborn + AppGeo",
    //sector: "GovContracting",
    sectors: ["GovContracting", "Geospatial", "EmergencyMgmt"],
    year: 2024,

    mechanisms: [],
    jurisdictions: ["Federal"],
    tags: ["geospatial", "mapping", "modernization", "federal-engagement"],

    heroImageUrl: "/img/case1.webp",

    summaryShort:
      "Supporting geospatial modernization and federal engagement for critical mapping and location intelligence.",
    brief:
      "Partnered with Sanborn and AppGeo to strengthen federal positioning, align capabilities with agency program needs, and support long-term contract and grant opportunities.",

    outcomes: [
      {
        label: "Program positioning",
        description:
          "Positioned combined capabilities within key federal geospatial programs.",
      },
      {
        label: "Engagement strategy",
        description:
          "Developed targeted engagement strategy with priority agencies and committees.",
      },
      {
        label: "Preparedness visibility",
        description:
          "Improved visibility for geospatial contributions to national preparedness.",
      },
    ],

    evidence: [],

    bodyMDX:
      "## Summary\n\nERA Government Affairs partnered with Sanborn and AppGeo to strengthen their federal profile, align geospatial capabilities with agency program needs, and position them for long-term contract and grant opportunities across emergency management, transportation, and homeland security.\n Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?\n",

    sections: [
      {
        id: "context",
        title: "Context",
        bodyMDX:
          "Strengthen federal profile, align capabilities with program needs, and support long-term contract + grant pathways.",
      },
      {
        id: "impact",
        title: "Outcomes",
        bodyMDX:
          "- Positioned combined capabilities within key federal geospatial programs.\n- Developed targeted engagement strategy with priority agencies and committees.\n- Improved visibility for geospatial contributions to national preparedness.\n",
      },
    ],

    attachments: [],
    links: [],

    isFeaturedHome: true,
    isPublic: true,
  },

  {
    id: "cs-napsg-foundation",
    title: "(Temporary Title) NAPSG Foundation",
    slug: "napsg-foundation",
    client: "NAPSG Foundation",
//    sector: "Nonprofit",
    sectors: ["Nonprofit", "GovContracting", "Geospatial"],
    year: 2024,

    mechanisms: [],
    jurisdictions: ["Federal"],
    tags: ["nonprofit", "geospatial", "storytelling", "dc"],

    heroImageUrl: "/img/case2.webp",

    summaryShort:
      "Helping a nonprofit translate technical geospatial work into policy-relevant impact stories in DC.",
    brief:
      "Helped NAPSG translate technical geospatial capabilities into accessible narratives for federal decision-makers, aligned to current priorities and usable in outreach.",

    outcomes: [
      {
        label: "Clearer value proposition",
        description:
          "Clarified value proposition for non-technical federal audiences.",
      },
      {
        label: "Policy alignment",
        description:
          "Connected nonprofit initiatives to active federal policy conversations.",
      },
      {
        label: "Stakeholder relationships",
        description:
          "Supported durable relationships with key emergency management stakeholders.",
      },
    ],

    evidence: [],

    bodyMDX:
      "## Summary\n\nFor the NAPSG Foundation, ERA helped bridge the gap between highly technical geospatial work and decision-makers in Washington. We translated complex capabilities into accessible narratives, aligned them with current federal priorities, and supported outreach to agencies and Hill offices.\n",

    sections: [
      {
        id: "context",
        title: "Context",
        bodyMDX:
          "Highly technical work needed a policy-facing narrative that travels well in DC conversations.",
      },
      {
        id: "impact",
        title: "Outcomes",
        bodyMDX:
          "- Clarified value proposition for non-technical federal audiences.\n- Connected initiatives to active policy conversations.\n- Supported relationships with emergency management stakeholders.\n",
      },
    ],

    attachments: [],
    links: [],

    isFeaturedHome: true,
    isPublic: true,
  },

  {
    id: "cs-crucis",
    title: "Temporary Title: Crucis",
    slug: "crucis",
    client: "Crucis",
//    sector: "GovContracting",
    sectors: ["GovContracting", "Industry", "Manufacturing"],
    year: 2024,

    mechanisms: [],
    jurisdictions: ["Federal"],
    tags: ["procurement", "govcon", "strategy", "federal"],

    heroImageUrl: "/img/case3.webp",

    summaryShort:
      "Guiding a growing government contractor through the realities of federal procurement and engagement.",
    brief:
      "Advised Crucis on realistic entry points into the federal marketplace: procurement pathways, program alignment, and relationship-building with agencies and Hill staff.",

    outcomes: [
      {
        label: "Entry points mapped",
        description:
          "Mapped realistic entry points into federal programs and contracts.",
      },
      {
        label: "Targeted outreach plan",
        description:
          "Developed a targeted plan for outreach and capability briefing.",
      },
      {
        label: "Avoided common pitfalls",
        description:
          "Helped avoid common missteps that slow or stall federal growth.",
      },
    ],

    evidence: [],

    bodyMDX:
      "## Summary\n\nERA advised Crucis on how to navigate the federal marketplace, including realistic pathways into procurement, program alignment, and long-term relationship-building with agencies and Hill staff. The work centered on strategy over spectacle: understanding timelines, constraints, and where Crucis could authentically add value.\n",

    sections: [
      {
        id: "context",
        title: "Context",
        bodyMDX:
          "Growth in federal markets is constrained by procurement rules, timelines, and trust-building—so strategy matters more than hype.",
      },
      {
        id: "impact",
        title: "Outcomes",
        bodyMDX:
          "- Mapped realistic entry points into federal programs and contracts.\n- Built a plan for outreach and capability briefing.\n- Avoided missteps that slow federal growth.\n",
      },
    ],

    attachments: [],
    links: [],

    isFeaturedHome: true,
    isPublic: true,
  },

  {
    id: "cs-mkr-fabricators",
    title: "Temporary Title: MKR Fabricators",
    slug: "mkr-fabricators",
    client: "MKR Fabricators",
    //sector: "EmergencyMgmt",
    sectors: ["EmergencyMgmt", "Manufacturing", "Industry"],
    year: 2024,

    mechanisms: [],
    jurisdictions: ["Federal"],
    tags: ["emergency", "manufacturing", "procurement", "disaster-response"],

    heroImageUrl: "/img/temp.svg",

    summaryShort:
      "Connecting real-world emergency response manufacturing needs with the federal ecosystem.",
    brief:
      "Aligned emergency response manufacturing capabilities with federal program and procurement realities, focused on practical deployment in disaster-response contexts.",

    outcomes: [
      {
        label: "Program alignment",
        description:
          "Aligned manufacturing capabilities with specific federal emergency programs.",
      },
      {
        label: "Procurement positioning",
        description:
          "Clarified how to position products against existing procurement pathways.",
      },
      {
        label: "Sustainable engagement",
        description:
          "Supported a strategy for sustainable public-sector engagement.",
      },
    ],

    evidence: [],

    bodyMDX:
      "## Summary\n\nERA supported MKR Fabricators in aligning their emergency response manufacturing capabilities with evolving federal program and procurement needs, with a focus on practical deployment in emergency and disaster-response contexts.\n",

    sections: [
      {
        id: "context",
        title: "Context",
        bodyMDX:
          "Emergency manufacturing value has to map cleanly onto programs + procurement pathways to actually deploy.",
      },
      {
        id: "impact",
        title: "Outcomes",
        bodyMDX:
          "- Aligned manufacturing capabilities with specific federal emergency programs.\n- Clarified positioning against procurement pathways.\n- Supported sustainable public-sector engagement.\n",
      },
    ],

    attachments: [],
    links: [],

    isFeaturedHome: true,
    isPublic: true,
  },

  {
    id: "cs-stemheads",
    title: "STEMheads (draft sample)",
    slug: "stemheads",
    client: "STEMheads",
//    sector: "Education",
    sectors: ["Education", "Nonprofit"],
    year: 2024,

    mechanisms: [],
    jurisdictions: ["Federal"],
    tags: ["education", "draft"],

    heroImageUrl: "/img/temp2.svg",

    summaryShort:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    brief:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",

    outcomes: [
      { label: "Outcome 1", description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
      { label: "Outcome 2", description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." },
    ],

    evidence: [],

    bodyMDX:
      "## Summary\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.\n",

    sections: [
      { id: "context", title: "Context", bodyMDX: "Lorem ipsum dolor sit amet..." },
      { id: "impact", title: "Outcomes", bodyMDX: "- Outcome 1\n- Outcome 2\n" },
    ],

    attachments: [],
    links: [],

    // If you ONLY want 4 featured cards on home, set this one false.
    isFeaturedHome: false,
    isPublic: true,
  },
] satisfies CaseStudyInput[];
//];

/** Parsed canonical “full” fixtures (full schema output, defaults filled). */
export const CASE_STUDIES_FIXTURE_FULL: CaseStudyType[] =
  CASE_STUDIES_FIXTURE_FULL_RAW.map((x) => CaseStudySchema.parse(x));

/* export const CASE_STUDIES_FIXTURE: CaseStudy[] = [
  {
    id: "cs-001",
    title: "Unlocking Federal Grants for a Nonprofit",
    slug: "federal-grants-nonprofit",
    client: "Example Nonprofit",
    sector: "GovContracting",
    year: 2024,
    mechanisms: ["Grant"],
    jurisdictions: ["Local"],
    tags: ["grants", "capacity", "ops"],
    heroImageUrl: "/img/casestudy1.webp",

    summaryShort:
      "Helped a mid-sized nonprofit triple their throughput on federal grants without adding headcount.",
    brief: "We worked with finance and program teams...",

    outcomes: [
      {
        label: "3x grant throughput",
        description: "Within 12 months, successful grant submissions tripled.",
        evidenceUrl: "https://example.com/case-study-evidence",
      },
    ],

    evidence: [
      {
        label: "OMB report",
        url: "https://example.com/omb-report.pdf",
      },
    ],

    bodyMDX: "## Background\n\nMore detailed markdown/MDX body here.",

    sections: [
      {
        id: "context",
        title: "Context",
        bodyMDX:
          "Exampleton had historically under-invested in centralized grants capacity...",
      },
      {
        id: "approach",
        title: "Approach",
        bodyMDX:
          "We mapped current workflows, identified bottlenecks, and built a simple operating playbook...",
      },
      {
        id: "results",
        title: "Results",
        bodyMDX:
          "Within a year, throughput tripled and coordination costs fell.",
      },
    ],

    attachments: [
      {
        label: "Sample Playbook (PDF)",
        url: "https://example.com/playbook.pdf",
        kind: "pdf",
        internalOnly: false,
      },
      {
        label: "Internal workshop deck",
        url: "https://example.com/internal-deck",
        kind: "ppt",
        internalOnly: true,
      },
    ],

    links: [
      {
        label: "Client website",
        url: "https://exampleton.gov",
        category: "client",
        internalOnly: false,
      },
      {
        label: "Grant tracking dashboard (internal)",
        url: "https://example.com/internal-dashboard",
        category: "impact",
        internalOnly: true,
      },
      {
        label: "Related press coverage",
        url: "https://news.example.com/exampleton-grants",
        category: "press",
        internalOnly: false,
      },
    ],

    isFeaturedHome: true,
    isPublic: true,
  },
];
 */

//map simpler case study "seeds" onto full CaseStudy entries for fixtures
/* type CaseStudySeed = {
  slug: string;
  client: string;
  sector: CaseStudy["sector"];
  teaser: string;
  featured?: boolean;
  imageUrl?: string; // "/img/..." or "https://..."
}; */

/* 
function seedToCaseStudy(seed: CaseStudySeed): CaseStudy {
  return {
    id: `cs-${seed.slug}`,
    title: seed.client,              // minimal now; can become richer later
    slug: seed.slug,
    client: seed.client,
    sector: seed.sector,

    year: undefined,
    tags: [],

    summaryShort: seed.teaser,
    brief: undefined,
    heroImageUrl: seed.imageUrl ?? "",

    mechanisms: [],
    jurisdictions: [],
    outcomes: [],

    evidence: [],
    bodyMDX: "",
    sections: [],

    attachments: [],
    links: [],

    isFeaturedHome: !!seed.featured,
    isPublic: true,
  };
} */


/* INFLATE SEEDS (very bare bones case studies) TO FULL CASESTUDIES */ 
/* 
function normalize(seedInput: CaseStudySeed): CaseStudy {
  const seed = CaseStudySeedSchema.parse(seedInput);
  const summaryShort = seed.summaryShort ?? seed.teaser;
  const heroImageUrl = seed.heroImageUrl ?? seed.imageUrl ?? ""; */
/*   const summaryShort = (seed.summaryShort ?? seed.teaser ?? "").trim();
  const heroImageUrl = (seed.heroImageUrl ?? seed.imageUrl ?? "").trim(); */
/* 
  return {
    id: `cs-${seed.slug}`,
    title: seed.title ?? seed.client ?? seed.slug,
//    title: seed.title ?? (seed.client ? seed.client : seed.slug),
    slug: seed.slug,
    client: seed.client,
    sector: seed.sector,
    year: seed.year,

    tags: seed.tags ?? [],

    summaryShort,
//    brief: undefined,
    brief: seed.brief,
    heroImageUrl,

    mechanisms: [],
    jurisdictions: [],
    outcomes: [],
    evidence: [],

    bodyMDX: "",
    sections: [],

    attachments: [],
    links: [],

//    isFeaturedHome: !!seed.featured,
    isFeaturedHome: seed.isFeaturedHome ?? seed.featured ?? false,
    isPublic: seed.isPublic ?? true,
  };
}
 */
//-------------------------
/**
 * Normalize a seed (minimal authoring) into a full CaseStudy object.
 * Returns the *parsed output* (defaults filled, status/visibility present).
 */
function normalize(seedInput: CaseStudySeedInput): CaseStudyType {
  const seed = CaseStudySeedSchema.parse(seedInput);

  const sectors =
  Array.isArray((seed as any).sectors) && (seed as any).sectors.length
    ? (seed as any).sectors
    : (seed as any).sector
      ? [(seed as any).sector]
      : [];

  const summaryShort = (seed.summaryShort ?? seed.teaser ?? "").trim();
  const heroImageUrl = (seed.heroImageUrl ?? seed.imageUrl ?? "").trim();

  // These should never trigger because seeds schema superRefine enforces them,
  // but this makes TS and runtime robust.
  if (!summaryShort) throw new Error(`Seed ${seed.slug} missing summaryShort/teaser`);
  if (!heroImageUrl) throw new Error(`Seed ${seed.slug} missing heroImageUrl/imageUrl`);

  const candidate: CaseStudyInput = {
    id: `cs-${seed.slug}`,
    title: seed.title ?? seed.client ?? seed.slug,
    slug: seed.slug,
    client: seed.client,
//    sectors: seed.sectors,
    sectors,

    year: seed.year,
    tags: seed.tags ?? [],
    summaryShort,
    brief: seed.brief,
    heroImageUrl,

    mechanisms: [],
    jurisdictions: [],
    outcomes: [],
    evidence: [],

    bodyMDX: "",
    sections: [],

    attachments: [],
    links: [],

    isFeaturedHome: seed.isFeaturedHome ?? seed.featured ?? false,
    isPublic: seed.isPublic ?? false,

    // status/visibility intentionally omitted: defaults apply at parse-time
  };
//  if (candidate.tags?.includes("seed")) {
    const tagsArr = Array.isArray(candidate.tags) ? candidate.tags : [];
    if (tagsArr.indexOf("seed") !== -1) {
    console.error("❌ STILL FINDING A 'seed' TAG: ", candidate);
    throw new Error("Seed tag found where it should not exist");
    //process.exit(1);
  }

  return CaseStudySchema.parse(candidate);
}

  
//const SEEDS: CaseStudySeed[] = [
const SEEDS: CaseStudySeedInput[] = [
  {
    slug: "sanborn-appgeo",
    title: "Geospatial modernization and federal engagement",
    client: "Sanborn + AppGeo",
    //sector: "GovContracting",
    sectors: ["GovContracting", "Geospatial"],
    heroImageUrl: "/img/case1.webp",
    summaryShort:
      "Supporting geospatial modernization and federal engagement for critical mapping and location intelligence.",
    brief:
      "Partnered with Sanborn and AppGeo to strengthen federal positioning, align capabilities with agency program needs, and support long-term contract and grant opportunities.",
    tags: ["geospatial", "mapping", "modernization", "federal-engagement"],
    year: 2024,
    isFeaturedHome: true,
    isPublic: true,
  },
  {
    slug: "napsg-foundation",
    title: "Policy-facing storytelling for a technical nonprofit",
    client: "NAPSG Foundation",
    //sector: "Nonprofit",
    sectors: ["Nonprofit", "Geospatial"],
    heroImageUrl: "/img/case2.webp",
    summaryShort:
      "Helping a nonprofit translate technical geospatial work into policy-relevant impact stories in DC.",
    brief:
      "Helped NAPSG translate technical geospatial capabilities into accessible narratives for federal decision-makers, aligned to current priorities and usable in outreach.",
    tags: ["nonprofit", "geospatial", "storytelling", "dc"],
    year: 2024,
    isFeaturedHome: true,
    isPublic: true,
  },
  {
    slug: "crucis",
    title: "Federal procurement strategy for a growing contractor",
    client: "Crucis",
    //sector: "GovContracting",
    sectors: ["GovContracting"],
    heroImageUrl: "/img/case3.webp",
    summaryShort:
      "Guiding a growing government contractor through the realities of federal procurement and engagement.",
    brief:
      "Advised Crucis on realistic entry points into the federal marketplace: procurement pathways, program alignment, and relationship-building with agencies and Hill staff.",
    tags: ["procurement", "govcon", "strategy", "federal"],
    year: 2024,
    isFeaturedHome: true,
    isPublic: true,
  },
  {
    slug: "mkr-fabricators",
    title: "Emergency response manufacturing alignment",
    client: "MKR Fabricators",
    sectors: ["EmergencyMgmt", "Manufacturing"],
    heroImageUrl: "/img/temp.svg",
    summaryShort:
      "Connecting real-world emergency response manufacturing needs with the federal ecosystem.",
    brief:
      "Aligned emergency response manufacturing capabilities with federal program and procurement realities, focused on practical deployment in disaster-response contexts.",
    tags: ["emergency", "manufacturing", "procurement", "disaster-response"],
    year: 2024,
    isFeaturedHome: true,
    isPublic: true,
  },
  {
    slug: "stemheads",
    title: "STEMheads (draft sample)",
    client: "STEMheads",
    sectors: ["Education", "Nonprofit"],
    heroImageUrl: "/img/temp2.svg",
    summaryShort:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    brief:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    tags: ["education", "draft"],
    year: 2024,
    isFeaturedHome: false,
    isPublic: true,
  },
];

// Validate + inflate seeds into full CaseStudy entries
/* const FULL_FROM_SEEDS: CaseStudy[] = SEEDS.map((s) =>
  normalize(CaseStudySeedSchema.parse(s)),
); */
const FULL_FROM_SEEDS: CaseStudyType[] = SEEDS.map((s) => normalize(s));

/**
 * Canonical full set with deterministic dedupe-by-slug:
 * - start from seeds (so new seeds appear automatically)
 * - then overlay FULL fixtures (so fully-written entries win)
 * - preserve the manual FULL ordering, then append any seed-only cases
 */

const bySlug = new Map<string, CaseStudyType>();
for (const cs of FULL_FROM_SEEDS) bySlug.set(cs.slug, cs);
for (const cs of CASE_STUDIES_FIXTURE_FULL) bySlug.set(cs.slug, cs);

const orderedFull: CaseStudyType[] = [];
const seen = new Set<string>();

for (const cs of CASE_STUDIES_FIXTURE_FULL) {
  const winner = bySlug.get(cs.slug);
  if (winner) {
    orderedFull.push(winner);
    seen.add(cs.slug);
  }
}

for (const cs of FULL_FROM_SEEDS) {
  if (!seen.has(cs.slug)) orderedFull.push(cs);
}

/**
 * This is the fixture that the app should use "for now" during demo phase:
 * it intentionally strips detail while keeping the *schema shape* intact.
 */
export const CASE_STUDIES_FIXTURE: CaseStudyType[] = orderedFull;

//lightweight “cards” version for the homepage later
export const CASE_STUDIES_FIXTURE_CARDS: CaseStudyType[] = orderedFull.map((cs) => ({
  ...cs,
  brief: undefined,
  outcomes: [],
  bodyMDX: "",
  sections: [],
  evidence: [],
  attachments: [],
  links: [],
}));