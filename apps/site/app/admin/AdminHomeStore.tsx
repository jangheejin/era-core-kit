// apps/site/app/admin/AdminHomeStore.tsx
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

import type {
  HeroProps,
  IntroWithImageProps,
  MissionTextProps,
} from "@kit/blocks";
import {
  DEFAULT_HOME_CONTENT,
  createExtraSection,
  type HomeContent,
  type HomeWorkContent,
} from "@/content/homeContent";
import type { LayoutBlock } from "@kit/blocks";

type AdminHomeContextValue = {
  content: HomeContent;
  updateContent: (partial: Partial<HomeContent>) => void;
  updateSection: <K extends keyof HomeContent>(
    section: K,
    partial: Partial<HomeContent[K]>
  ) => void;
  updateExtraSection: (id: string, partial: LayoutBlock["props"]) => void;
  addExtraSection: () => void;
  removeExtraSection: (id: string) => void;
  updateSectionOrder: (order: string[]) => void;
  resetToBaseline: () => void;
};

const STORAGE_KEY = "era_admin_home_content_v1";
const AdminHomeContext = createContext<AdminHomeContextValue | null>(null);

function isPlainObject(x: unknown): x is Record<string, unknown> {
  return Boolean(x) && typeof x === "object" && !Array.isArray(x);
}

function coerceString(raw: unknown, fallback: string) {
  return typeof raw === "string" ? raw : fallback;
}

function coerceOptionalString(raw: unknown): string | undefined {
  return typeof raw === "string" ? raw : undefined;
}

function coerceNumber(raw: unknown, fallback?: number) {
  return typeof raw === "number" && Number.isFinite(raw) ? raw : fallback;
}

function normalizeHero(raw: unknown, fallback: HeroProps): HeroProps {
  if (!isPlainObject(raw)) return fallback;
  return {
    heading: coerceString(raw.heading, fallback.heading),
    subhead: coerceOptionalString(raw.subhead) ?? fallback.subhead,
    text: coerceOptionalString(raw.text) ?? fallback.text,
    text2: coerceOptionalString(raw.text2) ?? fallback.text2,
    text3: coerceOptionalString(raw.text3) ?? fallback.text3,
    imageUrl: coerceString(raw.imageUrl, fallback.imageUrl),
  };
}

function normalizeMission(
  raw: unknown,
  fallback: MissionTextProps
): MissionTextProps {
  if (!isPlainObject(raw)) return fallback;
  return {
    heading: coerceString(raw.heading, fallback.heading),
    text: coerceString(raw.text, fallback.text),
    text2: coerceOptionalString(raw.text2) ?? fallback.text2,
    imageUrl: coerceOptionalString(raw.imageUrl) ?? fallback.imageUrl,
  };
}

function normalizeIntro(
  raw: unknown,
  fallback: IntroWithImageProps
): IntroWithImageProps {
  if (!isPlainObject(raw)) return fallback;
  return {
    heading: coerceString(raw.heading, fallback.heading),
    text: coerceOptionalString(raw.text) ?? fallback.text,
    text2: coerceOptionalString(raw.text2) ?? fallback.text2,
    imageUrl: coerceString(raw.imageUrl, fallback.imageUrl),
  };
}

function normalizeWork(
  raw: unknown,
  fallback: HomeWorkContent
): HomeWorkContent {
  if (!isPlainObject(raw)) return fallback;
  const itemsSource =
    raw.itemsSource === "manual" || raw.itemsSource === "featured"
      ? raw.itemsSource
      : fallback.itemsSource ?? "featured";
  const caseStudySlugs = Array.isArray(raw.caseStudySlugs)
    ? raw.caseStudySlugs
        .filter((slug): slug is string => typeof slug === "string")
        .map((slug) => slug.trim())
        .filter(Boolean)
    : fallback.caseStudySlugs;

  return {
    heading: coerceString(raw.heading, fallback.heading),
    text: coerceOptionalString(raw.text) ?? fallback.text,
    text2: coerceOptionalString(raw.text2) ?? fallback.text2,
    gridHeading: coerceOptionalString(raw.gridHeading) ?? fallback.gridHeading,
    layout: coerceString(raw.layout, fallback.layout),
    itemsSource,
    maxItems: coerceNumber(raw.maxItems, fallback.maxItems),
    items: [],
    caseStudySlugs,
  };
}

function normalizeContent(raw: unknown): HomeContent {
  const fallback = DEFAULT_HOME_CONTENT;
  if (!isPlainObject(raw)) return fallback;
  const extrasRaw = Array.isArray(raw.extraSections) ? raw.extraSections : [];
  const extraSections = extrasRaw
    .filter((block) => isPlainObject(block))
    .filter((block) => block.type === "RichTextSection")
    .map((block) => ({
      ...block,
      _key: typeof block._key === "string" ? block._key : "",
    }))
    .filter((block) => Boolean(block._key));

  const baseIds = fallback.sectionOrder;
  const orderInput = Array.isArray(raw.sectionOrder)
    ? raw.sectionOrder
        .filter((id): id is string => typeof id === "string")
        .map((id) => id.trim())
        .filter(Boolean)
    : [];
  const sectionOrder = [...new Set([...baseIds, ...orderInput])];
  const extraIds = extraSections.map((block) => String(block._key));
  for (const id of extraIds) {
    if (!sectionOrder.includes(id)) sectionOrder.push(id);
  }

  return {
    hero: normalizeHero(raw.hero, fallback.hero),
    mission: normalizeMission(raw.mission, fallback.mission),
    intro: normalizeIntro(raw.intro, fallback.intro),
    work: normalizeWork(raw.work, fallback.work),
    sectionOrder,
    extraSections,
  };
}

function loadLocal(): HomeContent {
  if (typeof window === "undefined") return DEFAULT_HOME_CONTENT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_HOME_CONTENT;
    return normalizeContent(JSON.parse(raw));
  } catch {
    return DEFAULT_HOME_CONTENT;
  }
}

function saveLocal(content: HomeContent) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  } catch {
    // ignore storage failures
  }
}

export function AdminHomeProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<HomeContent>(DEFAULT_HOME_CONTENT);

  useEffect(() => {
    setContent(loadLocal());
  }, []);

  useEffect(() => {
    saveLocal(content);
  }, [content]);

  const updateContent = useCallback((partial: Partial<HomeContent>) => {
    setContent((prev) => ({
      ...prev,
      ...partial,
    }));
  }, []);

  const updateSection = useCallback(
    <K extends keyof HomeContent>(section: K, partial: Partial<HomeContent[K]>) => {
      setContent((prev) => ({
        ...prev,
        [section]: { ...prev[section], ...partial },
      }));
    },
    []
  );

  const updateExtraSection = useCallback(
    (id: string, partial: LayoutBlock["props"]) => {
      setContent((prev) => ({
        ...prev,
        extraSections: prev.extraSections.map((block) =>
          block._key === id ? { ...block, props: { ...block.props, ...partial } } : block
        ),
      }));
    },
    []
  );

  const addExtraSection = useCallback(() => {
    const id = `extra-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const block = createExtraSection(id);
    setContent((prev) => ({
      ...prev,
      extraSections: [...prev.extraSections, block],
      sectionOrder: [...prev.sectionOrder, id],
    }));
  }, []);

  const removeExtraSection = useCallback((id: string) => {
    setContent((prev) => ({
      ...prev,
      extraSections: prev.extraSections.filter((block) => block._key !== id),
      sectionOrder: prev.sectionOrder.filter((entry) => entry !== id),
    }));
  }, []);

  const updateSectionOrder = useCallback((order: string[]) => {
    setContent((prev) => {
      const baseIds = DEFAULT_HOME_CONTENT.sectionOrder;
      const normalized = order.filter((id) => typeof id === "string");
      for (const id of baseIds) {
        if (!normalized.includes(id)) normalized.unshift(id);
      }
      for (const block of prev.extraSections) {
        const id = String(block._key);
        if (id && !normalized.includes(id)) normalized.push(id);
      }
      return {
        ...prev,
        sectionOrder: normalized,
      };
    });
  }, []);

  const resetToBaseline = useCallback(() => {
    setContent(DEFAULT_HOME_CONTENT);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  }, []);

  const value = useMemo<AdminHomeContextValue>(
    () => ({
      content,
      updateContent,
      updateSection,
      updateExtraSection,
      addExtraSection,
      removeExtraSection,
      updateSectionOrder,
      resetToBaseline,
    }),
    [
      content,
      updateContent,
      updateSection,
      updateExtraSection,
      addExtraSection,
      removeExtraSection,
      updateSectionOrder,
      resetToBaseline,
    ]
  );

  return <AdminHomeContext.Provider value={value}>{children}</AdminHomeContext.Provider>;
}

export function useAdminHomeContent() {
  const ctx = useContext(AdminHomeContext);
  if (!ctx) {
    throw new Error("useAdminHomeContent must be used within AdminHomeProvider");
  }
  return ctx;
}
