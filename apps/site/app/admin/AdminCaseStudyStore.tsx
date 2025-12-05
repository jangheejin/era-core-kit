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
  CASE_STUDIES_FIXTURE,
  type CaseStudyInput,
  type CaseStudyType,
} from "@kit/schema";

type AdminCaseStudyContextValue = {
  items: CaseStudyType[];

  /** Back-compat name (your original API). Newest-first semantics. */
  addCaseStudy: (cs: CaseStudyType) => void;

  /** Preferred name (same semantics as addCaseStudy). */
  upsertCaseStudy: (cs: CaseStudyType) => void;

  removeCaseStudy: (slug: string) => void;
  getBySlug: (slug: string) => CaseStudyType | undefined;

  /** Collision-safe slug helper for create/edit flows. */
  ensureUniqueSlug: (desiredSlug: string, currentId?: string) => string;

  /** Optional: wipe local overrides and return to fixtures+seeds. */
  resetToBaseline: () => void;
};

const AdminCaseStudyContext =
  createContext<AdminCaseStudyContextValue | null>(null);

const STORAGE_KEY = "era_admin_case_studies_v1";

/** Keep your explicit seed layer (separate from fixtures). */
const RAW_SEEDS: CaseStudyInput[] = [
  {
    id: "seed-sanborn-appgeo",
    title: "Geospatial Solutions",
    slug: "sanborn-appgeo",
    client: "Sanborn + AppGeo",
    sector: "GovContracting",
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
    sector: "Nonprofit",
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
  const res = CaseStudySchema.safeParse(item);
  return res.success ? [res.data] : [];
});

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

/**
 * Merge rules: fixture baseline → seeds baseline → stored overrides
 * Ordering: fixture order, then seed-only, then stored-only (deterministic)
 */
function buildItemsWithStored(stored: CaseStudyType[]): CaseStudyType[] {
  const bySlug = new Map<string, CaseStudyType>();

  for (const cs of CASE_STUDIES_FIXTURE) bySlug.set(cs.slug, cs);
  for (const cs of SEED_CASE_STUDIES) bySlug.set(cs.slug, cs);
  for (const cs of stored) bySlug.set(cs.slug, cs);

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

/** Baseline items without reading window/localStorage (avoids SSR/CSR mismatch risk). */
function buildBaselineItems(): CaseStudyType[] {
  return buildItemsWithStored([]);
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminCaseStudyProvider({ children }: { children: ReactNode }) {
  // Start from baseline to keep server/client consistent.
  const [items, setItems] = useState<CaseStudyType[]>(() => buildBaselineItems());

  // Hydrate local overrides after mount.
  useEffect(() => {
    const stored = loadLocal();
    if (stored.length === 0) return;
    setItems(buildItemsWithStored(stored));
  }, []);

  // Persist changes
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
    // Your original semantics: newest first, replace by slug.
    setItems((prev) => {
      const filtered = prev.filter((p) => p.slug !== cs.slug);
      return [cs, ...filtered];
    });
  }, []);

  const upsertCaseStudy = addCaseStudy;

  const removeCaseStudy = useCallback((slug: string) => {
    setItems((prev) => prev.filter((x) => x.slug !== slug));
  }, []);

  const getBySlug = useCallback(
    (slug: string) => items.find((x) => x.slug === slug),
    [items],
  );

  const resetToBaseline = useCallback(() => {
    setItems(buildBaselineItems());
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
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
    [items, addCaseStudy, upsertCaseStudy, removeCaseStudy, getBySlug, ensureUniqueSlug, resetToBaseline],
  );

  return (
    <AdminCaseStudyContext.Provider value={value}>
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

/* const AdminCaseStudyContext =
  createContext<AdminCaseStudyContextValue | null>(null);

const STORAGE_KEY = "era_admin_case_studies_v1";

const RAW_SEEDS: CaseStudyInput[] = [
  {
    id: "seed-sanborn-appgeo",
    title: "Geospatial Solutions",
    slug: "sanborn-appgeo",
    client: "Sanborn + AppGeo",
    sector: "GovContracting",
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
    sector: "Nonprofit",
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
  const res = CaseStudySchema.safeParse(item);
  return res.success ? [res.data] : [];
});

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