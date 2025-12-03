//apps/site/app/admin/AdminCaseStudyStore.tsx
// This is only in memory for the current browser session
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  CASE_STUDIES_FIXTURE,
  CaseStudy as CaseStudySchema,
  type CaseStudy as CaseStudyType,
} from "@kit/schema";

type AdminCaseStudyContextValue = {
  items: CaseStudyType[];
  addCaseStudy: (cs: CaseStudyType) => void;
};

const AdminCaseStudyContext = createContext<AdminCaseStudyContextValue | null>(
  null,
);

const STORAGE_KEY = "era_admin_case_studies_v1";

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


function loadLocal(): CaseStudyType[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const ok: CaseStudyType[] = [];
    for (const item of parsed) {
      const res = CaseStudySchema.safeParse(item);
      if (res.success) ok.push(res.data);
    }
    return ok;
  } catch {
    return [];
  }
}

function saveLocal(items: CaseStudyType[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function AdminCaseStudyProvider({ children }: { children: ReactNode }) {
/*   const [items, setItems] = useState<CaseStudyType[]>([]);

  const addCaseStudy = (cs: CaseStudyType) => {
    setItems((prev) => {
      // avoid duplicate slugs in this session
      const filtered = prev.filter((p) => p.slug !== cs.slug);
      return [...filtered, cs];
    });
  }; */
  const [items, setItems] = useState<CaseStudyType[]>(() => {
    const stored = typeof window !== "undefined" ? []: loadLocal();
    const map = new Map<string, CaseStudyType>();
    for (const cs of [...SEED_CASE_STUDIES, ...stored]) map.set(cs.slug, cs);
    for (const cs of CASE_STUDIES_FIXTURE) map.set(cs.slug, cs);
    for (const cs of stored) map.set(cs.slug, cs);
    return Array.from(map.values());
  });

  useEffect(() => {
    saveLocal(items);
  }, [items]);

  const addCaseStudy = (cs: CaseStudyType) => {
    setItems((prev) => {
      // avoid duplicate slugs in this session
      const filtered = prev.filter((p) => p.slug !== cs.slug);
      //put newest first so it shows up at top of list
      return [cs, ...filtered];
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
