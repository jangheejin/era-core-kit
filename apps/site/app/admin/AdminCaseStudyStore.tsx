//apps/site/app/admin/AdminCaseStudyStore.tsx
// This is only in memory for the current browser session

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  CASE_STUDIES_FIXTURE,
  CaseStudy as CaseStudySchema,
  type CaseStudyType,
//  type CaseStudyInput,
} from "@kit/schema";

/* type AdminCaseStudyContextValue = {
  items: CaseStudyType[];
  addCaseStudy: (cs: CaseStudyType) => void;
}; */
type AdminCaseStudyStore = {
  items: CaseStudyType[];

  /** Create or replace an item (by slug, with id fallback). */
  upsertCaseStudy: (cs: CaseStudyType) => void;

  /** Remove by slug. (Useful later; doesn’t complicate anything.) */
  removeCaseStudy: (slug: string) => void;

  /** Read helper. */
  getBySlug: (slug: string) => CaseStudyType | undefined;

  /** Collision-safe slug helper for “create” workflows. */
  ensureUniqueSlug: (desiredSlug: string, currentId?: string) => string;

  /** Hard reset (optional but handy in demos). */
  resetToFixtures: () => void;
};

const Ctx = createContext<AdminCaseStudyStore | null>(null);

function mergeFixturesWithSaved(
  fixtures: CaseStudyType[],
  saved: CaseStudyType[],
): CaseStudyType[] {
  // Saved wins by slug; preserve fixture ordering; append saved-only items at end.
  const savedBySlug = new Map(saved.map((x) => [x.slug, x]));
  const out: CaseStudyType[] = [];
  const seen = new Set<string>();

  for (const f of fixtures) {
    const winner = savedBySlug.get(f.slug) ?? f;
    out.push(winner);
    seen.add(winner.slug);
  }

  for (const s of saved) {
    if (!seen.has(s.slug)) out.push(s);
  }

  return out;
}

function safeLoadSaved(): CaseStudyType[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const ok: CaseStudyType[] = [];
    for (const maybe of parsed) {
      const res = CaseStudySchema.safeParse(maybe);
      if (res.success) ok.push(res.data);
    }
    return ok;
  } catch {
    return [];
  }
}

function safeSave(items: CaseStudyType[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore quota/errors in demo mode
  }
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
  const fixtures = CASE_STUDIES_FIXTURE;

  const [items, setItems] = useState<CaseStudyType[]>(fixtures);

  // Hydrate once on mount: fixtures + saved overlay
  useEffect(() => {
    const saved = safeLoadSaved();
    if (saved.length === 0) return;
    setItems(mergeFixturesWithSaved(fixtures, saved));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on change (demo durability)
  useEffect(() => {
    safeSave(items);
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

  const upsertCaseStudy = useCallback((cs: CaseStudyType) => {
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.slug === cs.slug || x.id === cs.id);
      if (idx === -1) return [cs, ...prev];
      const next = prev.slice();
      next[idx] = cs;
      return next;
    });
  }, []);

  const removeCaseStudy = useCallback((slug: string) => {
    setItems((prev) => prev.filter((x) => x.slug !== slug));
  }, []);

  const getBySlug = useCallback(
    (slug: string) => items.find((x) => x.slug === slug),
    [items],
  );

  const resetToFixtures = useCallback(() => {
    setItems(fixtures);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  }, [fixtures]);

  const value = useMemo<AdminCaseStudyStore>(
    () => ({
      items,
      upsertCaseStudy,
      removeCaseStudy,
      getBySlug,
      ensureUniqueSlug,
      resetToFixtures,
    }),
    [items, upsertCaseStudy, removeCaseStudy, getBySlug, ensureUniqueSlug, resetToFixtures],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdminCaseStudies() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useAdminCaseStudies must be used within <AdminCaseStudyProvider>");
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