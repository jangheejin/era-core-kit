//apps/site/app/admin/AdminCaseStudyStore.tsx
// This is only in memory for the current browser session

"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  CaseStudy as CaseStudySchema,
  CaseStudyInput,
  CASE_STUDIES_FIXTURE,//the dummy entries for the demo cms database
  type CaseStudyType,
} from "@kit/schema";

import { DEFAULT_HERO_IMAGE_URL } from "@kit/schema";

function migrateLegacySector(input: any) {
  if (!input || typeof input !== "object") return input;
  if (input.sectors == null && input.sector != null) {
    input = { ...input, sectors: [input.sector] };
    delete input.sector;
  }
  return input;
}

function migrateHeroUrl(input: any) {
  if (!input || typeof input !== "object") return input;
  const raw = input.heroImageUrl ?? input.imageUrl;
  if (typeof raw !== "string" || raw.trim() === "") {
    return { ...input, heroImageUrl: DEFAULT_HERO_IMAGE_URL };
  }
  // only normalize when heroImageUrl  is missing AND raw is a string
  if (!input.heroImageUrl && typeof raw === "string") {
    return { ...input, heroImageUrl: raw };
  }
  return input;
}

type AdminCaseStudyContextValue = {
  items: CaseStudyType[];

  /** Back-compat name (your existing API). */
  addCaseStudy: (cs: CaseStudyType) => void;

  /** Preferred name (same behavior). */
  upsertCaseStudy: (cs: CaseStudyType) => void;

  removeCaseStudy: (slug: string) => void;
  getBySlug: (slug: string) => CaseStudyType | undefined;
//  findBySlug: (slug: string) => CaseStudyType | undefined;

  /** Collision-safe slug helper for create/edit flows. */
  ensureUniqueSlug: (desiredSlug: string, currentId?: string) => string;

  /** Clears local overrides and returns to fixture baseline. */
  resetToBaseline: () => void;
};

const AdminCaseStudyContext =
  createContext<AdminCaseStudyContextValue | null>(null);

const STORAGE_KEY = "era_admin_case_studies_v2";

/*
const RAW_SEEDS: CaseStudyInput[] = [
   {
    id: "seed-sanborn-appgeo",
    title: "Geospatial Solutions",
    slug: "sanborn-appgeo",
    client: "Sanborn + AppGeo",
    //sector: "GovContracting",
    sectors: ["GovContracting", "Geospatial",],
    year: 2024,
    tags: ["seed"],
    summaryShort: "Demo entry seeded into the toy CMS store.",
    brief: "Another short description",
    heroImageUrl: "/img/case1.webp",
    mechanisms: [],
    jurisdictions: [],
    outcomes: [],
    evidence: [],
    bodyMDX: "Seed body content.",
    sections: [],
    attachments: [],
    links: [],
    status: "Draft",
    visibility: "Internal",
    isFeaturedHome: false,
    isPublic: true,
  }, 
  {
    id: "seed-napsg-foundation",
    title: "Nonprofit Organizations",
    slug: "napsg-foundation",
    client: "NAPSG Foundation",
//    sector: "Nonprofit",
    sectors: ["Nonprofit", "Geospatial",],
    year: 2024,
    tags: ["seed"],
    summaryShort: "Another demo entry seeded into the toy CMS store.",
    brief: "Another short description",
    heroImageUrl: "/img/case2.webp",
    mechanisms: [],
    jurisdictions: [],
    outcomes: [],
    evidence: [],
    bodyMDX: "Seed body content for NAPSG Foundation.",
    sections: [],
    attachments: [],
    links: [],
    status: "Draft",
    visibility: "Internal",
    isFeaturedHome: false,
    isPublic: true,
  },
];

const SEED_CASE_STUDIES: CaseStudyType[] = RAW_SEEDS.flatMap((item) => {
  const migrated = migrateLegacySector(item);
  const res = CaseStudySchema.safeParse(migrated);
  return res.success ? [res.data] : [];
});*/

function loadLocalValidated(): CaseStudyType[] {
  console.log("LocalStorage contents after load:", JSON.stringify(localStorage.getItem(STORAGE_KEY), null, 2));
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const ok: CaseStudyType[] = [];
    for (const item of parsed) {
      //ignore any entries with seed tag (outdated, oversimplified mock case studies)
      if (item.tags?.includes("seed")) continue;

      //const migrated = migrateLegacySector(item);
      const migrated = migrateHeroUrl(migrateLegacySector(item));
      const res = CaseStudySchema.safeParse(migrated);
      if (res.success) ok.push(res.data);
    }
    return ok;
  } catch {
    return [];
  }
}

function saveLocal(items: CaseStudyType[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

//function buildInitialItems(): CaseStudyType[] {
function buildBaselineItems(): CaseStudyType[] {
//  const stored = loadLocalValidated();
  // baseline = fixture baseline (+ optional seed baseline), no window/localStorage
  const bySlug = new Map<string, CaseStudyType>();

  // baseline → overrides
  for (const cs of CASE_STUDIES_FIXTURE) bySlug.set(cs.slug, cs);
/*   for (const cs of SEED_CASE_STUDIES) {
    if (!bySlug.has(cs.slug)) {
      bySlug.set(cs.slug, cs);
    }
  } */
//  for (const cs of SEED_CASE_STUDIES) bySlug.set(cs.slug, cs); // optional (keeps RAW_SEEDS)
  //for (const cs of stored) bySlug.set(cs.slug, cs);

  // deterministic order: fixture order then stored-only
  const order: string[] = [];
  const push = (slug: string) => { if (!order.includes(slug)) order.push(slug); };
  for (const cs of CASE_STUDIES_FIXTURE) push(cs.slug);
  //for (const cs of SEED_CASE_STUDIES) push(cs.slug);
  //for (const cs of stored) push(cs.slug);

  return order.map((s) => bySlug.get(s)).filter((x): x is CaseStudyType => Boolean(x));
}

/**
 * Merge rules: fixture baseline → stored overrides
 * Ordering: fixture order first, then any stored-only slugs appended (deterministic)
 */
function mergeFixtureWithStored(
  stored: CaseStudyType[]): CaseStudyType[] {
    const bySlug = new Map<string, CaseStudyType>();

    for (const cs of CASE_STUDIES_FIXTURE) bySlug.set(cs.slug, cs);
    for (const cs of stored) bySlug.set(cs.slug, cs); // overrides baseline

    const order: string[] = [];
    const push = (slug: string) => {
      if (!order.includes(slug)) order.push(slug);
    };

    for (const cs of CASE_STUDIES_FIXTURE) push(cs.slug);
    for (const cs of stored) push(cs.slug); // adds stored-only slugs

    return order
      .map((slug) => bySlug.get(slug))
      .filter((x): x is CaseStudyType => Boolean(x));
  }

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const BASELINE = buildBaselineItems();

function mergeBaselineWithStored(baseline: CaseStudyType[], stored: CaseStudyType[]) {
  const bySlug = new Map<string, CaseStudyType>();
  for (const cs of baseline) bySlug.set(cs.slug, cs);
  for (const cs of stored) bySlug.set(cs.slug, cs);

  const order: string[] = [];
  const push = (slug: string) => { if (!order.includes(slug)) order.push(slug); };

  for (const cs of baseline) push(cs.slug);
  for (const cs of stored) push(cs.slug);

  return order.map((s) => bySlug.get(s)).filter((x): x is CaseStudyType => Boolean(x));
}

export function AdminCaseStudyProvider({ children }: { children: ReactNode }) {
  // Start from fixtures only to avoid SSR/CSR mismatch.
  const [items, setItems] = useState<CaseStudyType[]>(BASELINE);
  //const [items, setItems] = useState<CaseStudyType[]>(() => buildInitialItems());
  //const [items, setItems] = useState<CaseStudyType[]>(() => CASE_STUDIES_FIXTURE);

  const getBySlug = useCallback(
    (slug: string) => items.find((x) => x.slug === slug),
    [items],
  );

  // Hydrate stored overrides on mount (client-only)
  useEffect(() => {
    const stored = loadLocalValidated();

    //guardrail against seeds
    for (const item of stored) {
      if (item.tags?.includes("seed")) {
        console.error("❌ Found seed tag in localStorage:", item);
      }
    }

    if (stored.length === 0) return;
    setItems(mergeBaselineWithStored(BASELINE, stored));
    //setItems(mergeFixtureWithStored(stored));
    console.log("!!!!Final loaded case studies:", items);
  }, []);

  // Persist any changes (this will store fixtures too but that’s OK for toy mode)
  useEffect(() => {
    saveLocal(items);
  }, [items]);

  const ensureUniqueSlug = useCallback(
    (desiredSlug: string, currentId?: string) => {
      const base = slugify(desiredSlug || "untitled");
      let candidate = base;
      let n = 2;

      const conflicts = (slug: string) =>
        items.some((x) => x.slug === slug && (currentId ? x.id !== currentId : true));

      while (conflicts(candidate)) {
        candidate = `${base}-${n++}`;
      }
      return candidate;
    },
    [items],
  );

  const addCaseStudy = useCallback((cs: CaseStudyType) => {
    // Keep existing behavior: newest first, replace by slug.
    setItems((prev) => {
      const filtered = prev.filter((p) => p.slug !== cs.slug);
      return [cs, ...filtered];
    });
  }, []);

/*   const addCaseStudy = (cs: CaseStudyType) => {
    setItems((prev) => {
      const filtered = prev.filter((p) => p.slug !== cs.slug);
      return [cs, ...filtered];
    });
  }; */

  const upsertCaseStudy = addCaseStudy;

  const removeCaseStudy = useCallback((slug: string) => {
    setItems((prev) => prev.filter((p) => p.slug !== slug));
  }, []);

//  const findBySlug = (slug: string) => items.find(x => x.slug === slug);

/*   const resetToBaseline = useCallback(() => {
    setItems(CASE_STUDIES_FIXTURE);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  }, []); */

/*   const resetToBaseline = () => {
    if (typeof window !== "undefined") {
      try { window.localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
    setItems(CASE_STUDIES_FIXTURE);
  }; */

  const resetToBaseline = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
    setItems(CASE_STUDIES_FIXTURE);
  }, []);

  const value = useMemo<AdminCaseStudyContextValue>(
    () => ({
      items,
      addCaseStudy,
      upsertCaseStudy,
      removeCaseStudy,
      getBySlug,
      ensureUniqueSlug,
      resetToBaseline,
    }),
    [
      items, 
      addCaseStudy, 
      upsertCaseStudy, 
      removeCaseStudy, getBySlug, ensureUniqueSlug, resetToBaseline
    ],
  );

  return (
    <AdminCaseStudyContext.Provider value={value}>
      {children}
    </AdminCaseStudyContext.Provider>
  );

/*   return (
    <AdminCaseStudyContext.Provider value={{ items, addCaseStudy, getBySlug }}>
      {children}
    </AdminCaseStudyContext.Provider>
  ); */
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


/* const AdminCaseStudyContext =
  createContext<AdminCaseStudyContextValue | null>(null);

const STORAGE_KEY = "era_admin_case_studies_v1";



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
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

function buildInitialItems(): CaseStudyType[] {
  const stored = typeof window === "undefined" ? [] : loadLocal();

  // Merge rules: fixture baseline → seeds baseline → stored overrides
  const bySlug = new Map<string, CaseStudyType>();
  for (const cs of CASE_STUDIES_FIXTURE) bySlug.set(cs.slug, cs);
  for (const cs of SEED_CASE_STUDIES) bySlug.set(cs.slug, cs);
  for (const cs of stored) bySlug.set(cs.slug, cs);

  // Deterministic ordering: fixture order, then seed-only, then stored-only
  const order: string[] = [];
  const push = (slug: string) => {
    if (!order.includes(slug)) order.push(slug);
  };

  for (const cs of CASE_STUDIES_FIXTURE) push(cs.slug);
  for (const cs of SEED_CASE_STUDIES) push(cs.slug);
  for (const cs of stored) push(cs.slug);

  return order
    .map((slug) => bySlug.get(slug))
    .filter((x): x is CaseStudyType => Boolean(x));
}

export function AdminCaseStudyProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CaseStudyType[]>(() => buildInitialItems());

  useEffect(() => {
    saveLocal(items);
  }, [items]);

  const addCaseStudy = (cs: CaseStudyType) => {
    setItems((prev) => {
      const filtered = prev.filter((p) => p.slug !== cs.slug);
      return [cs, ...filtered]; // newest first
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
 */