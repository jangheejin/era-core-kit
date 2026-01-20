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

import { normalizeTagList, slugify, tagSlug, type SectorValue } from "@kit/schema";

export type ClientPageAudience = "Public" | "ClientSafe";
export type ClientPageTagMode = "any" | "all";

export type ClientPageFilters = {
  sector: SectorValue | null;
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

function coerceFilters(raw: any): ClientPageFilters {
  const sector =
    typeof raw?.sector === "string" ? (raw.sector as SectorValue) : null;

  const tags = Array.isArray(raw?.tags)
    ? normalizeTagsStrict(raw.tags.filter((x: any) => typeof x === "string"))
    : [];

  const tagMode: ClientPageTagMode = raw?.tagMode === "all" ? "all" : "any";
  const audience: ClientPageAudience =
    raw?.audience === "ClientSafe" ? "ClientSafe" : "Public";

  return { sector, tags, tagMode, audience };
}

function coerceBodyMDX(raw: any): string {
  if (typeof raw === "string") return raw;
  return "";
}

function isPlainObject(x: any): x is Record<string, unknown> {
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
    if (stored.length > 0) setPages(stored);
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
        sector: input.filters.sector ?? null,
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
