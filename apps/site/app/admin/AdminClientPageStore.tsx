// apps/site/app/admin/AdminClientPageStore.tsx
// Demo-only client-side store (localStorage) for "Client pages".
// A Client page is a saved filter over the case-study library.

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
  normalizeTagList,
  slugify,
  tagSlug,
  type SectorValue,
  SECTOR_VALUES,
} from "@kit/schema";

export type ClientPageAudience = "Public" | "ClientSafe";
export type ClientPageTagMode = "any" | "all";

export type ClientPageFilters = {
  sectors: SectorValue[];
  tags: string[]; // human-readable labels; compare via tagSlug()
  tagMode: ClientPageTagMode;
  audience: ClientPageAudience;
};

export type ClientPage = {
  id: string;
  name: string;
  slug: string;
  filters: ClientPageFilters;
  bodyMDX: string;
  createdAt: number;
  updatedAt: number;
};

type AdminClientPageContextValue = {
  pages: ClientPage[];

  createPage: (input: {
    name: string;
    desiredSlug?: string;
    filters: Partial<ClientPageFilters>;
  }) => ClientPage;

  upsertPage: (page: ClientPage) => void;
  removePage: (slug: string) => void;
  getBySlug: (slug: string) => ClientPage | undefined;
  ensureUniqueSlug: (desiredSlug: string, currentId?: string) => string;
  resetPages: () => void;
};

const AdminClientPageContext =
  createContext<AdminClientPageContextValue | null>(null);

const STORAGE_KEY = "era_admin_client_pages_v1";

const DEFAULT_PAGES: ClientPage[] = (() => {
  const now = Date.now();
  return [
    {
      id: "seed-pilot-program",
      name: "Pilot Program Case Studies",
      slug: "pilot-program-case-studies",
      filters: {
        sectors: [],
        tags: ["Pilot Program"],
        tagMode: "any",
        audience: "Public",
      },
      bodyMDX:
        "Case studies from pilot programs that highlight measurable results and delivery wins.",
      createdAt: now - 1000 * 60 * 60 * 24 * 7,
      updatedAt: now - 1000 * 60 * 60 * 24 * 3,
    },
    {
      id: "seed-energy-resilience",
      name: "Energy Resilience Case Studies",
      slug: "energy-resilience-case-studies",
      filters: {
        sectors: ["Energy"],
        tags: ["Resilience"],
        tagMode: "any",
        audience: "Public",
      },
      bodyMDX:
        "Energy-focused work that demonstrates resilience outcomes across programs.",
      createdAt: now - 1000 * 60 * 60 * 24 * 10,
      updatedAt: now - 1000 * 60 * 60 * 24 * 2,
    },
  ];
})();

function normalizeTagsStrict(input: string[]): string[] {
  const list = normalizeTagList(input);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of list) {
    const slug = tagSlug(t);
    if (!slug) continue;
    if (seen.has(slug)) continue;
    seen.add(slug);
    out.push(t);
  }
  return out;
}

const SECTOR_SET = new Set(SECTOR_VALUES);

function normalizeSectors(input: unknown): SectorValue[] {
  if (!Array.isArray(input)) return [];
  const out: SectorValue[] = [];
  const seen = new Set<string>();
  for (const raw of input) {
    if (typeof raw !== "string") continue;
    if (!SECTOR_SET.has(raw as SectorValue)) continue;
    if (seen.has(raw)) continue;
    seen.add(raw);
    out.push(raw as SectorValue);
  }
  return out;
}

function coerceFilters(raw: unknown): ClientPageFilters {
  const record = isPlainObject(raw) ? raw : {};
  const fromList = normalizeSectors(record.sectors);
  const legacySector = record.sector;
  const sectors = fromList.length
    ? fromList
    : normalizeSectors(typeof legacySector === "string" ? [legacySector] : []);

  const tagsRaw = record.tags;
  const tags = Array.isArray(tagsRaw)
    ? normalizeTagsStrict(tagsRaw.filter((x): x is string => typeof x === "string"))
    : [];

  const tagMode: ClientPageTagMode = record.tagMode === "all" ? "all" : "any";
  const audience: ClientPageAudience =
    record.audience === "ClientSafe" ? "ClientSafe" : "Public";

  return { sectors, tags, tagMode, audience };
}

function coerceBodyMDX(raw: unknown): string {
  if (typeof raw === "string") return raw;
  return "";
}

function isPlainObject(x: unknown): x is Record<string, unknown> {
  return Boolean(x) && typeof x === "object" && !Array.isArray(x);
}

function loadLocalValidated(): ClientPage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const ok: ClientPage[] = [];
    for (const item of parsed) {
      if (!isPlainObject(item)) continue;
      if (typeof item.slug !== "string" || !item.slug.trim()) continue;
      if (typeof item.name !== "string" || !item.name.trim()) continue;
      if (typeof item.id !== "string" || !item.id.trim()) continue;

      const createdAt =
        typeof item.createdAt === "number" ? item.createdAt : Date.now();
      const updatedAt =
        typeof item.updatedAt === "number" ? item.updatedAt : createdAt;

      ok.push({
        id: item.id,
        name: item.name,
        slug: item.slug,
        filters: coerceFilters(item.filters),
        bodyMDX: coerceBodyMDX(item.bodyMDX),
        createdAt,
        updatedAt,
      });
    }
    return ok;
  } catch {
    return [];
  }
}

function saveLocal(pages: ClientPage[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
  } catch {
    // ignore
  }
}

export function AdminClientPageProvider({ children }: { children: ReactNode }) {
  const [pages, setPages] = useState<ClientPage[]>([]);

  useEffect(() => {
    const stored = loadLocalValidated();
    if (stored.length > 0) {
      setPages(stored);
      return;
    }
    setPages(DEFAULT_PAGES);
  }, []);

  useEffect(() => {
    saveLocal(pages);
  }, [pages]);

  const getBySlug = useCallback(
    (slug: string) => pages.find((p) => p.slug === slug),
    [pages],
  );

  const ensureUniqueSlug = useCallback(
    (desiredSlug: string, currentId?: string) => {
      const base = slugify(desiredSlug || "client-page");
      let candidate = base;
      let n = 2;

      const conflicts = (slug: string) =>
        pages.some(
          (p) => p.slug === slug && (currentId ? p.id !== currentId : true),
        );

      while (conflicts(candidate)) {
        candidate = `${base}-${n++}`;
      }
      return candidate;
    },
    [pages],
  );

  const upsertPage = useCallback((page: ClientPage) => {
    setPages((prev) => {
      const filtered = prev.filter((p) => p.slug !== page.slug);
      return [page, ...filtered]; // newest first
    });
  }, []);

  const removePage = useCallback((slug: string) => {
    setPages((prev) => prev.filter((p) => p.slug !== slug));
  }, []);

  const resetPages = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
    setPages([]);
  }, []);

  const createPage = useCallback(
    (input: {
      name: string;
      desiredSlug?: string;
      filters: Partial<ClientPageFilters>;
    }) => {
      const now = Date.now();
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(now);

      const name = input.name.trim() || "Untitled client page";
      const desired = (input.desiredSlug?.trim() || name) ?? "client-page";
      const slug = ensureUniqueSlug(desired);

      const filters: ClientPageFilters = {
        sectors: normalizeSectors(input.filters.sectors ?? []),
        tags: normalizeTagsStrict(input.filters.tags ?? []),
        tagMode: input.filters.tagMode ?? "any",
        audience: input.filters.audience ?? "Public",
      };

      const page: ClientPage = {
        id,
        name,
        slug,
        filters,
        bodyMDX: "",
        createdAt: now,
        updatedAt: now,
      };

      upsertPage(page);
      return page;
    },
    [ensureUniqueSlug, upsertPage],
  );

  const value = useMemo<AdminClientPageContextValue>(
    () => ({
      pages,
      createPage,
      upsertPage,
      removePage,
      getBySlug,
      ensureUniqueSlug,
      resetPages,
    }),
    [pages, createPage, upsertPage, removePage, getBySlug, ensureUniqueSlug, resetPages],
  );

  return (
    <AdminClientPageContext.Provider value={value}>
      {children}
    </AdminClientPageContext.Provider>
  );
}

export function useAdminClientPages() {
  const ctx = useContext(AdminClientPageContext);
  if (!ctx) {
    throw new Error(
      "useAdminClientPages must be used within <AdminClientPageProvider>",
    );
  }
  return ctx;
}
