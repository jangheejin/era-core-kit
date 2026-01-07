// packages/schema/src/fixtures.ts
import type { CaseStudy } from "./index";
//normalize seeds (shorter-form case studies meant for landing cards, etc) into full CaseStudy entries at import time
import type { CaseStudySeed } from "./seeds";

const SEED_CASES: CaseStudySeed[] = [
  {
    slug: "sanborn-appgeo",
    client: "Sanborn + AppGeo",
    sector: "GovContracting",
    sectorLabel: "Geospatial Solutions",
    teaser: "Supporting geospatial modernization and federal engagement for critical mapping and location intelligence.",
    featured: true,
    imageUrl: "/img/case1.webp",
  },
  // ...
];

function seedToCaseStudy(seed: CaseStudySeed): CaseStudy {
  return {
    id: `cs-${seed.slug}`,
    title: seed.client,                 // or a better label if you want
    slug: seed.slug,
    client: seed.client,
    sector: seed.sector,

    year: undefined,
    mechanisms: [],
    jurisdictions: [],
    tags: [],

    heroImageUrl: seed.imageUrl ?? "",
    summaryShort: seed.teaser,
    brief: undefined,

    outcomes: [],
    evidence: [],
    bodyMDX: "",
    sections: [],

    attachments: [],
    links: [],

    isFeaturedHome: seed.featured,
    isPublic: true,
  };
}

export const CASE_STUDIES_FIXTURE: CaseStudy[] = SEED_CASES.map(seedToCaseStudy);
/*

export const CASE_STUDIES_FIXTURE: CaseStudy[] = [
  {
    id: "cs-sanborn-appgeo",
    title: "Geospatial modernization and federal engagement",
    slug: "sanborn-appgeo",
    client: "Sanborn + AppGeo",
    sector: "GovContracting",
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
      "## Summary\n\nERA Government Affairs partnered with Sanborn and AppGeo to strengthen their federal profile, align geospatial capabilities with agency program needs, and position them for long-term contract and grant opportunities across emergency management, transportation, and homeland security.\n",

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
    title: "Policy-facing storytelling for a technical nonprofit",
    slug: "napsg-foundation",
    client: "NAPSG Foundation",
    sector: "Nonprofit",
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
    title: "Federal procurement strategy for a growing contractor",
    slug: "crucis",
    client: "Crucis",
    sector: "GovContracting",
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
    title: "Emergency response manufacturing alignment",
    slug: "mkr-fabricators",
    client: "MKR Fabricators",
    sector: "EmergencyMgmt",
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
    sector: "Education",
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
];
*/

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