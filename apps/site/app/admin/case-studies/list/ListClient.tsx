// apps/site/app/admin/case-studies/list/ListClient.tsx
"use client";

import "@styles/admin-cms.css";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  CaseStudy as CaseStudySchema,
  SECTOR_GROUPS,
  SECTOR_VALUES,
  sectorLabel,
  sectorRouteSlug,
  type SectorValue,
  type CaseStudyType,
  normalizeTagList,
  tagSlug,
} from "@kit/schema";

import { useAdminCaseStudies } from "../../AdminCaseStudyStore";
import { ContextBanner } from "@/admin/components/ContextBanner";
import { splitCategoryTags, isCategoryTag } from "@/lib/adminTags";

import * as Tooltip from "@radix-ui/react-tooltip";

// Demo-only: restore “auto-set a category if none selected”
const DEMO_AUTO_DEFAULT_CATEGORY = true;
const DEFAULT_CATEGORY = (
  SECTOR_VALUES.includes("PublicSector") ? "PublicSector" : SECTOR_VALUES[0]
) as SectorValue;

// ---- sector coercion (fixes old stored data like "Public Sector" or "public-sector") ----
const SECTOR_LOOKUP = new Map<string, SectorValue>();

for (const v of SECTOR_VALUES as readonly SectorValue[]) {
  SECTOR_LOOKUP.set(v, v);
  SECTOR_LOOKUP.set(v.toLowerCase(), v);

  const slugFromValue = tagSlug(v);
  if (slugFromValue) SECTOR_LOOKUP.set(slugFromValue, v);

  const slugFromLabel = tagSlug(sectorLabel(v));
  if (slugFromLabel) SECTOR_LOOKUP.set(slugFromLabel, v);
}

const PUBLISH_STATUS_VALUES = ["Draft", "Published"] as const;

function coerceSector(raw: unknown): SectorValue | null {
  if (typeof raw !== "string") return null;
  const s = raw.trim();
  if (!s) return null;

  // exact match
  if (SECTOR_VALUES.includes(s as SectorValue)) return s as SectorValue;

  // case-insensitive match
  const lower = s.toLowerCase();
  const directLower = SECTOR_LOOKUP.get(lower);
  if (directLower) return directLower;

  // slug match (works for "Public Sector" => "public-sector")
  const slug = tagSlug(s);
  if (slug) {
    const mapped = SECTOR_LOOKUP.get(slug);
    if (mapped) return mapped;
  }

  return null;
}

function parseCommaList(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

// Recover if some old draft accidentally saved the wrong shape.
function toStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x));
  if (v == null) return [];
  const s = String(v).trim();
  if (!s) return [];
  return parseCommaList(s);
}

function getLegacyValue(obj: unknown, key: string): unknown {
  if (!obj || typeof obj !== "object") return undefined;
  return (obj as Record<string, unknown>)[key];
}

function normalizeTagsStrict(list: string[]): string[] {
  const normalized = normalizeTagList(list);
  const seen = new Set<string>();
  const out: string[] = [];

  for (const t of normalized) {
    const slug = tagSlug(t);
    if (!slug) continue;
    if (seen.has(slug)) continue;
    seen.add(slug);
    out.push(t);
  }
  return out;
}

function normalizeSectorsStrict(list: string[]): SectorValue[] {
  const out: SectorValue[] = [];
  for (const raw of list) {
    const v = coerceSector(raw);
    if (v) out.push(v);
  }
  const seen = new Set<string>();
  return out.filter((v) => (seen.has(v) ? false : (seen.add(v), true)));
}

export default function ListClient() {
  const { items: storeItems, resetToBaseline, upsertCaseStudy } = useAdminCaseStudies();
  const items = useMemo(() => storeItems ?? [], [storeItems]);

  const didAutoFixRef = useRef(false);
  const [featuredSaveStateById, setFeaturedSaveStateById] = useState<
    Record<string, "idle" | "saving" | "saved" | "error">
  >({});
  const featuredSaveTimersRef = useRef<Record<string, ReturnType<typeof setTimeout> | null>>({});

  const searchParams = useSearchParams();
  const savedId = searchParams.get("saved");
  const editId = searchParams.get("edit");

  // filters
  const [q, setQ] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<SectorValue | "">("");
  const [tagFilter, setTagFilter] = useState("");
  const [tagMode, setTagMode] = useState<"any" | "all">("any");
  const [statusFilter] = useState<string>("");
  const [tagDrafts, setTagDrafts] = useState<Record<string, string>>({});
  const tagFilterChips = useMemo(
    () =>
      normalizeTagList(
        tagFilter
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      ),
    [tagFilter],
  );
  const availableTags = useMemo(() => {
    const bySlug = new Map<string, string>();
    for (const item of items) {
      const tags = normalizeTagsStrict(toStringArray(getLegacyValue(item, "tags")));
      for (const tag of tags) {
        const slug = tagSlug(tag);
        if (!slug || isCategoryTag(tag) || bySlug.has(slug)) continue;
        bySlug.set(slug, tag);
      }
    }
    return Array.from(bySlug.values()).sort((a, b) => a.localeCompare(b));
  }, [items]);
  const featuredCount = useMemo(
    () =>
      items.filter(
        (cs) =>
          cs.status === "Published" &&
          cs.isPublic &&
          cs.visibility === "Public" &&
          cs.isFeaturedHome,
      ).length,
    [items],
  );
  const maxFeatured = 6;

  // --- Filtered Page Preview (opens a category or single-tag page) ---
  const clientPagePreviewHref = useMemo(() => {
    if (categoryFilter) {
      const seg = sectorRouteSlug(categoryFilter);
      return seg ? `/sectors/${seg}` : null;
    }
    if (tagFilterChips.length === 1 && tagFilterChips[0]) {
      const tagSeg = tagSlug(tagFilterChips[0]);
      return tagSeg ? `/tag/${tagSeg}` : null;
    }
    return null;
  }, [categoryFilter, tagFilterChips]);

  function openClientPagePreview() {
    if (!clientPagePreviewHref) return;
    window.open(clientPagePreviewHref, "_blank", "noopener,noreferrer");
  }

  type SortMode = "Newest" | "Oldest" | "AtoZ" | "ZtoA";
  const [sortMode, setSortMode] = useState<SortMode>("Newest");

  function clientLabelForSort(cs: CaseStudyType) {
    return (cs.client ?? cs.title ?? "Untitled").trim().toLowerCase();
  }

  const [quickEditId, setQuickEditId] = useState<string | null>(null);

  useEffect(() => {
    const timers = featuredSaveTimersRef.current;
    return () => {
      Object.values(timers).forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
    };
  }, []);

  useEffect(() => {
    if (!quickEditId) return;
    const current = items.find((item) => item.id === quickEditId);
    if (!current) return;
    const { visible } = splitCategoryTags(
      normalizeTagsStrict(toStringArray(getLegacyValue(current, "tags"))),
    );
    setTagDrafts((prev) => ({ ...prev, [current.id]: visible.join(", ") }));
  }, [items, quickEditId]);

  function clearFeaturedSaveTimer(id: string) {
    const existing = featuredSaveTimersRef.current[id];
    if (existing) clearTimeout(existing);
    featuredSaveTimersRef.current[id] = null;
  }

  function scheduleFeaturedSaveReset(id: string) {
    clearFeaturedSaveTimer(id);
    featuredSaveTimersRef.current[id] = setTimeout(() => {
      setFeaturedSaveStateById((prev) => ({ ...prev, [id]: "idle" }));
    }, 2000);
  }

  function setFeaturedSaveState(id: string, state: "idle" | "saving" | "saved" | "error") {
    setFeaturedSaveStateById((prev) => ({ ...prev, [id]: state }));
  }

  function applyFeaturedQuickSave(
    cs: CaseStudyType,
    next: boolean,
  ) {
    setFeaturedSaveState(cs.id, "saving");
    clearFeaturedSaveTimer(cs.id);
    const updated = updateMeta(cs.id, {
      isFeaturedHome: next,
      status: "Published",
      visibility: "Public",
      isPublic: true,
    });

    if (updated) {
      setFeaturedSaveState(cs.id, "saved");
      scheduleFeaturedSaveReset(cs.id);
      return;
    }

    updateMeta(cs.id, {
      isFeaturedHome: cs.isFeaturedHome,
      status: cs.status,
      visibility: cs.visibility,
      isPublic: cs.isPublic,
    });
    setFeaturedSaveState(cs.id, "error");
    scheduleFeaturedSaveReset(cs.id);
    window.alert("Could not update featured status. Please try again.");
  }

  // Normalize + Zod-validate before saving
  function updateMeta(id: string, patch: Partial<CaseStudyType>) {
    const existing = items.find((c) => c.id === id);
    if (!existing) return false;

    // gather sectors from: sectors[] / legacy sector / primarySector (if someone saved only that)
    const sectorsRaw =
      getLegacyValue(patch, "sectors") ??
      getLegacyValue(existing, "sectors") ??
      getLegacyValue(patch, "sector") ??
      getLegacyValue(existing, "sector") ??
      undefined;

    const primaryRaw =
      getLegacyValue(patch, "primarySector") ??
      getLegacyValue(existing, "primarySector") ??
      undefined;

    const tagsRaw = getLegacyValue(patch, "tags") ?? getLegacyValue(existing, "tags");

    const sectorsNorm = normalizeSectorsStrict([
      ...toStringArray(sectorsRaw),
      ...toStringArray(primaryRaw),
    ]);

    const sectorsFinal = sectorsNorm.length ? sectorsNorm : [DEFAULT_CATEGORY];

    // primarySector must be in sectorsFinal
    const primaryCoerced = coerceSector(primaryRaw);
    const primarySector: SectorValue = primaryCoerced && sectorsFinal.includes(primaryCoerced)
      ? primaryCoerced
      : sectorsFinal[0] ?? DEFAULT_CATEGORY;

    const sectorsFixed = sectorsFinal.includes(primarySector)
      ? sectorsFinal
      : ([primarySector, ...sectorsFinal] as SectorValue[]);

    const tagsNorm = normalizeTagsStrict(toStringArray(tagsRaw));

    const candidate: CaseStudyType = {
      ...existing,
      ...patch,
      sectors: sectorsFixed,
      tags: tagsNorm,
      primarySector,
    };

    const res = CaseStudySchema.safeParse(candidate);
    if (!res.success) {
      console.warn("[admin] refusing to save invalid CaseStudy", res.error.format());
      return false;
    }

    upsertCaseStudy(res.data);
    return true;
  }

  // Demo-only: if a record has no category, auto-assign DEFAULT_CATEGORY once.
  useEffect(() => {
    if (!DEMO_AUTO_DEFAULT_CATEGORY) return;
    if (didAutoFixRef.current) return;
    if (items.length === 0) return;

    const missing = items.filter((cs) => {
      const sectors = normalizeSectorsStrict([
        ...toStringArray(getLegacyValue(cs, "sectors")),
        ...toStringArray(getLegacyValue(cs, "sector")),
        ...toStringArray(getLegacyValue(cs, "primarySector")),
      ]);
      return sectors.length === 0;
    });

    if (missing.length === 0) return;

    for (const cs of missing) {
      updateMeta(cs.id, { sectors: [DEFAULT_CATEGORY], primarySector: DEFAULT_CATEGORY });
    }

    didAutoFixRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const filtered = useMemo(() => {
    const qq = q.toLowerCase().trim();
    const wantedTags = tagFilterChips.map(tagSlug).filter(Boolean);

    return items.filter((cs) => {
      const sectors = normalizeSectorsStrict([
        ...toStringArray(getLegacyValue(cs, "sectors")),
        ...toStringArray(getLegacyValue(cs, "sector")),
        ...toStringArray(getLegacyValue(cs, "primarySector")),
      ]);

      const tags = normalizeTagsStrict(toStringArray(getLegacyValue(cs, "tags")));
      const tagSlugs = tags.map(tagSlug).filter(Boolean);

      if (categoryFilter && !sectors.includes(categoryFilter)) return false;
      if (wantedTags.length) {
        const tagSet = new Set(tagSlugs);
        const match =
          tagMode === "all"
            ? wantedTags.every((t) => tagSet.has(t))
            : wantedTags.some((t) => tagSet.has(t));
        if (!match) return false;
      }
      if (statusFilter && cs.status !== statusFilter) return false;

      if (!qq) return true;

      const hay = [
        cs.client ?? "",
        cs.title ?? "",
        cs.summaryShort ?? "",
        ...sectors.map((s) => sectorLabel(s)),
        ...tags,
      ]
        .join(" ")
        .toLowerCase();

      return hay.includes(qq);
    });
  }, [items, q, categoryFilter, statusFilter, tagFilterChips, tagMode]);

  const sorted = useMemo(() => {
    const base = filtered ?? [];
    if (sortMode === "Newest") return base;

    const arr = [...base];

    if (sortMode === "Oldest") return arr.reverse();
    if (sortMode === "AtoZ") return arr.sort((a, b) => clientLabelForSort(a).localeCompare(clientLabelForSort(b)));
    return arr.sort((a, b) => clientLabelForSort(b).localeCompare(clientLabelForSort(a)));
  }, [filtered, sortMode]);

  return (
    <main className="c-admin">
      <ContextBanner view="preview">
        This is a temporary demo CMS database. You can filter by category, tags, and search.
        Changes are stored only in your browser (localStorage).
      </ContextBanner>

      <div className="row" style={{ justifyContent: "space-between" }}>
        <h1 className="type-h2">Case Study Library</h1>
        <div className="row" style={{ gap: ".5rem" }}>
          <button className="btn-3" type="button" onClick={resetToBaseline}>
            Reset demo data
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="card mt">
        <div className="row filterMenus">
          <input
            className="input search"
            placeholder="Search client / categories / tags…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ flex: 1, minWidth: 240 }}
          />

          <select
            className="input"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as SectorValue | "")}
          >
            <option value="">Filter by category</option>
            {SECTOR_GROUPS.map((g) => (
              <optgroup key={g.id} label={g.label}>
                {g.values.map((v) => (
                  <option key={v} value={v}>
                    {sectorLabel(v)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          <input
            className="input"
            placeholder="Filter by tags (comma-separated)"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            style={{ minWidth: 220 }}
            list="tag-filter-options"
          />
          <datalist id="tag-filter-options">
            {availableTags.map((tag) => (
              <option key={tag} value={tag} />
            ))}
          </datalist>

          <select
            className="input"
            value={tagMode}
            onChange={(e) => setTagMode(e.target.value as "any" | "all")}
          >
            <option value="any">Match any tag</option>
            <option value="all">Match all tags</option>
          </select>

{/*           <select
            className="input"
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
          >
            <option value="">Filter by visibility</option>
            {CASE_STUDY_VISIBILITY_VALUES.map((v) => (
              <option key={v} value={v}>
                {visibilityLabel(v)}
              </option>
            ))}
          </select> */}
        </div>

        {/* Client Page Preview */}
        <div
          className="row listLensPage"
          style={{
            alignItems: "stretch",
            gap: "1rem",
            flexWrap: "wrap",
            marginTop: "1.25rem",
            padding: ".85rem 1rem",
            borderRadius: 10,
            background: "rgba(15, 52, 96, 0.06)",
          }}
        >
          <button
            type="button"
            className="btnPrimary"
            onClick={openClientPagePreview}
            disabled={!clientPagePreviewHref}
            title={!clientPagePreviewHref ? "Select a category first" : "Open in a new tab"}
            style={{ minWidth: 240, padding: ".85rem 1.5rem", fontSize: "1rem" }}
          >
            Preview filtered page
          </button>

          <div className="c-stack" style={{ gap: ".35rem", minWidth: 240 }}>
            <span className="type-small" style={{ fontWeight: 700 }}>
              Preview a filtered page (category or single-tag).
            </span>
            <span className="muted type-small">
              {clientPagePreviewHref
                ? `This opens the public page at ${clientPagePreviewHref}.`
                : "Pick a category or a single tag above to enable the preview button."}
            </span>
            <span className="muted type-small">
              For multi-tag or category + tag combinations, use Client Pages to build a final page.
            </span>
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="card mt">
        <div className="dbResultsHeader">
          <div className="dbResultsHeader__sort">
            <span className="muted type-small">Sort:</span>
            <select
              className="input input--tiny"
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
            >
              <option value="Newest">Newest first</option>
              <option value="Oldest">Oldest first</option>
              <option value="AtoZ">Alphabetical (A–Z)</option>
              {/* <option value="ZtoA">Reverse Alphabetical (Z–A)</option> */}
            </select>
          </div>

          <p className="muted dbResultsHeader__count">
            Showing {filtered.length} / {items.length}
          </p>
        </div>

        <div className="dbListGrid">
          {sorted.map((cs) => {
            const isHighlighted = cs.id === savedId || cs.id === editId;
            const clientLabel = (cs.client ?? cs.title ?? "Untitled").trim() || "Untitled";
            const isQuickEditing = quickEditId === cs.id;

            const sectorsRaw = normalizeSectorsStrict([
              ...toStringArray(getLegacyValue(cs, "sectors")),
              ...toStringArray(getLegacyValue(cs, "sector")),
              ...toStringArray(getLegacyValue(cs, "primarySector")),
            ]);

            const sectors = sectorsRaw.length ? sectorsRaw : [DEFAULT_CATEGORY];

            const primary =
              coerceSector(getLegacyValue(cs, "primarySector")) ??
              sectors[0] ??
              DEFAULT_CATEGORY;

            const isPublished = cs.status === "Published";
            const isFeatured = Boolean(cs.isFeaturedHome);
            const featuredSaveState = featuredSaveStateById[cs.id] ?? "idle";
            const { visible: visibleTags, hidden: hiddenTags } = splitCategoryTags(
              normalizeTagsStrict(toStringArray(getLegacyValue(cs, "tags"))),
            );
            const tagDraft = tagDrafts[cs.id] ?? visibleTags.join(", ");
            const tagListId = `quick-edit-tag-options-${cs.id}`;
            const secondarySectors = sectors.filter((sector) => sector !== primary);

            return (
              <div
                key={cs.id}
                id={`cs-${cs.id}`}
                className={`card dbItem ${isQuickEditing ? "dbItem--editing" : ""}`}
                style={isHighlighted ? { outline: "2px solid var(--brand)", outlineOffset: 2 } : undefined}
              >
                <div className="dbItemHeader">
                  <div className="dbItemMain">
                    <div className="dbItemClient">{clientLabel}</div>
                  </div>

                  <div className="dbActions">
                    <Link
                      className="btnSmall"
                      href={`/admin/case-studies/mock/${cs.slug}`}
                      target="_blank"
                    >
                      Preview
                    </Link>

                    <Tooltip.Provider delayDuration={200}>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <Link className="btnSmall" href={`/admin/case-studies/edit/${cs.slug}`}>
                            Edit
                          </Link>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content side="top" sideOffset={8} className="tooltipContent">
                            Open full editor to edit the content of this case study
                            <Tooltip.Arrow className="tooltipArrow" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>

                    <Tooltip.Provider delayDuration={200}>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <button
                            className="btnSmall hasTooltip changeSettings"
                            type="button"
                            data-tooltip="Edit categories & change status"
                            onClick={() => setQuickEditId((prev) => (prev === cs.id ? null : cs.id))}
                            aria-expanded={isQuickEditing}
                          >
                            {isQuickEditing ? "Close" : "Change Settings"}
                          </button>
                        </Tooltip.Trigger>

                        <Tooltip.Portal>
                          <Tooltip.Content side="top" sideOffset={8} className="tooltipContent">
                            Edit categories & change status
                            <Tooltip.Arrow className="tooltipArrow" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                </div>

                <div className="dbSummary">{cs.summaryShort}</div>

                {/* PROPERTY ROWS */}
                {!isQuickEditing && (
                  <div className="dbProps">
                    <Tooltip.Provider delayDuration={200}>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <div className="dbProp dbPropTooltipTarget">
                            <div className="dbPropLabel">Categories</div>
                            <div className="dbPillStack">
                              {sectors.length === 0 ? (
                                <div className="dbPillRow">
                                  <span className="pill pill--muted">Uncategorized</span>
                                </div>
                              ) : (
                                <>
                                  <div className="dbPillRow">
                                    <span className="pill pill--cat pill--primary">
                                      {sectorLabel(primary)}
                                    </span>
                                  </div>
                                  {secondarySectors.length > 0 && (
                                    <div className="dbPillRow dbPillRow--secondary">
                                      {secondarySectors.map((sector) => (
                                        <span key={sector} className="pill pill--cat pill--secondary">
                                          {sectorLabel(sector)}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content side="top" sideOffset={8} className="tooltipContent">
                            Click Change Settings to quick edit categories and publishing status.
                            <Tooltip.Arrow className="tooltipArrow" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>

                    <Tooltip.Provider delayDuration={200}>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <div className="dbProp dbPropTooltipTarget">
                            <div className="dbPropLabel">Publishing Status</div>
                            <div className="dbPillRow">
                              <span
                                className={`pill pill--status ${isPublished ? "pill--published" : "pill--draft"}`}
                              >
                                {isPublished ? "Published" : "Draft"}
                              </span>
                              {isFeatured ? <span className="pill pill--audience">Featured</span> : null}
                            </div>
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content side="top" sideOffset={8} className="tooltipContent">
                            Click Change Settings to quick edit categories and publishing status.
                            <Tooltip.Arrow className="tooltipArrow" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                )}

                {/* EDIT PANEL */}
                {isQuickEditing && (
                  <div className="dbEditPanel" aria-label={`Editing ${clientLabel}`}>
                    <div className="dbEditBlock">
                      <div className="dbEditBlockTitle">Edit Categories</div>

                      <div className="muted type-small" style={{ marginBottom: 8 }}>
                        Click a category to remove it. Use the dropdown to add another.
                      </div>

                      {sectors.length > 0 ? (
                        <div
                          style={{
                            display: "flex",
                            gap: ".5rem",
                            alignItems: "center",
                            flexWrap: "wrap",
                            marginBottom: 8,
                          }}
                        >
                          <span className="muted type-small">Primary:</span>
                          <select
                            className="input input--tiny"
                            value={primary}
                            onChange={(e) => {
                              const v = e.target.value as SectorValue;
                              const next = sectors.includes(v) ? sectors : [v, ...sectors];
                              updateMeta(cs.id, { sectors: next, primarySector: v });
                            }}
                          >
                            {SECTOR_GROUPS.map((group) => (
                              <optgroup key={group.id} label={group.label}>
                                {group.values.map((v) => (
                                  <option key={v} value={v}>
                                    {sectorLabel(v)}
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                          <span className="muted type-small">Shown on cards.</span>
                        </div>
                      ) : null}

                      <select
                        className="input input--tiny"
                        value=""
                        onChange={(e) => {
                          const v = e.target.value as "" | SectorValue;
                          if (!v) return;
                          if (sectors.includes(v)) return;
                          updateMeta(cs.id, { sectors: [...sectors, v], primarySector: primary });
                        }}
                      >
                        <option value="">Add category…</option>
                        {SECTOR_GROUPS.map((g) => (
                          <optgroup key={g.id} label={g.label}>
                            {g.values.map((v) => (
                              <option key={v} value={v} disabled={sectors.includes(v)}>
                                {sectorLabel(v)}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>

                      <div className="dbPillRow">
                        {sectors.map((s) => (
                          <button
                            key={s}
                            type="button"
                            className="pill pill--cat pill--removable"
                            onClick={() => {
                              const nextRaw = sectors.filter((x) => x !== s);
                              const next = nextRaw.length ? nextRaw : [DEFAULT_CATEGORY];
                              const nextPrimary = next.includes(primary) ? primary : next[0];
                              updateMeta(cs.id, { sectors: next, primarySector: nextPrimary });
                            }}
                            title="Remove category"
                          >
                            {sectorLabel(s)} <span className="pillX">×</span>
                          </button>
                        ))}
                      </div>

                    </div>

                    <div className="dbEditBlock">
                      <div className="dbEditBlockTitle">Tags (optional)</div>
                      <p className="muted type-small" style={{ marginBottom: 8 }}>
                        Auto-suggests existing tags. Tags are title-cased and duplicates are removed on save.
                      </p>
                      <input
                        className="input input--tiny"
                        placeholder="Add tags (comma-separated)"
                        value={tagDraft}
                        onChange={(e) =>
                          setTagDrafts((prev) => ({ ...prev, [cs.id]: e.target.value }))
                        }
                        onBlur={(e) => {
                          const nextTags = normalizeTagsStrict(
                            e.target.value
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean),
                          );
                          const merged = normalizeTagsStrict([...hiddenTags, ...nextTags]);
                          updateMeta(cs.id, { tags: merged });
                          setTagDrafts((prev) => ({ ...prev, [cs.id]: nextTags.join(", ") }));
                        }}
                        list={tagListId}
                      />
                      <datalist id={tagListId}>
                        {availableTags.map((tag) => (
                          <option key={tag} value={tag} />
                        ))}
                      </datalist>
                      {visibleTags.length ? (
                        <div className="dbPillRow" style={{ marginTop: 6 }}>
                          {visibleTags.map((tag) => (
                            <span key={tag} className="pill pill--muted">
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div className="dbEditBlock">
                      <div className="dbEditBlockTitle">Publishing Status</div>

                      <div className="row" style={{ gap: ".5rem", flexWrap: "wrap" }}>
                        <select
                          className="input input--tiny"
                          value={cs.status}
                          onChange={(e) => {
                            const nextStatus = e.target.value as CaseStudyType["status"];
                            updateMeta(cs.id, {
                              status: nextStatus,
                              visibility: nextStatus === "Published" ? "Public" : "Internal",
                              isPublic: nextStatus === "Published",
                              isFeaturedHome: nextStatus === "Published" ? cs.isFeaturedHome : false,
                            });
                          }}
                        >
                          {PUBLISH_STATUS_VALUES.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                        <label className="row" style={{ gap: ".4rem", alignItems: "center" }}>
                          <input
                            type="checkbox"
                            checked={Boolean(cs.isFeaturedHome) && isPublished}
                            disabled={!isPublished}
                            onChange={(e) => applyFeaturedQuickSave(cs, e.target.checked)}
                          />
                          <span className="type-small">
                            Feature on homepage ({featuredCount}/{maxFeatured})
                            {featuredSaveState === "saving" && (
                              <span className="muted" style={{ marginLeft: 8 }}>
                                Saving…
                              </span>
                            )}
                            {featuredSaveState === "saved" && (
                              <span className="muted" style={{ marginLeft: 8 }}>
                                Saved
                              </span>
                            )}
                            {featuredSaveState === "error" && (
                              <span className="muted" style={{ marginLeft: 8 }}>
                                Save failed
                              </span>
                            )}
                          </span>
                        </label>
                      </div>
                      <p className="muted type-small" style={{ marginTop: 6 }}>
                        Only the first {maxFeatured} featured case studies appear on the homepage.
                      </p>
                    </div>

                    <div className="row" style={{ justifyContent: "flex-end" }}>
                      <button
                        className="btnSmall"
                        type="button"
                        onClick={() => setQuickEditId(null)}
                      >
                        Save changes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
