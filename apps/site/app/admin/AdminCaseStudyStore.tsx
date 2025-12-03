//apps/site/app/admin/AdminCaseStudyStore.tsx
// This is only in memory for the current browser session
"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { CaseStudy as CaseStudyType } from "@kit/schema";

type AdminCaseStudyContextValue = {
  items: CaseStudyType[];
  addCaseStudy: (cs: CaseStudyType) => void;
};

const AdminCaseStudyContext = createContext<AdminCaseStudyContextValue | null>(
  null,
);

const SEED_CASE_STUDIES: CaseStudyType[] = [
  {
    id: "seed-sanborn-appgeo",
    title: "Geospatial Solutions",
    slug: "sanborn-appgeo",
    client: "Sanborn + AppGeo",
    sector: "GovContracting",
    tags: ["seed"],
    summaryShort: "Demo entry seeded into the toy CMS store.",
    heroImageUrl: "/img/case1.webp",
    mechanisms: [],
    jurisdictions: [],
    outcomes: [],
    evidence: [],
    bodyMDX: "Seed body content.",
    sections: [],
    attachments: [],
    links: [],
    isFeaturedHome: false,
    isPublic: true,
  },

  {
    id: "seed-napsg-foundation",
    title: "Nonprofit Organizations",
    slug: "napsg-foundation",
    client: "NAPSG Foundation",
    sector: "Nonprofit",
    tags: ["seed"],
    summaryShort: "Another demo entry seeded into the toy CMS store.",
    heroImageUrl: "/img/case2.webp",
    mechanisms: [],
    jurisdictions: [],
    outcomes: [],
    evidence: [],
    bodyMDX: "Seed body content for NAPSG Foundation.",
    sections: [],
    attachments: [],
    links: [],
    isFeaturedHome: false,
    isPublic: true,
  }
];

export function AdminCaseStudyProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CaseStudyType[]>([]);

  const addCaseStudy = (cs: CaseStudyType) => {
    setItems((prev) => {
      // avoid duplicate slugs in this session
      const filtered = prev.filter((p) => p.slug !== cs.slug);
      return [...filtered, cs];
    });
  };

  return (
    <AdminCaseStudyContext.Provider value={{ items, addCaseStudy }}>
      {children}
    </AdminCaseStudyContext.Provider>
  );
}

export function useAdminCaseStudies() {
  const ctx = useContext(AdminCaseStudyContext);
  if (!ctx) {
    throw new Error(
      "useAdminCaseStudies must be used within <AdminCaseStudyProvider>",
    );
  }
  return ctx;
}
