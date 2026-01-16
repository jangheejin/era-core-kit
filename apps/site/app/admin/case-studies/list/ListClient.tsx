// apps/site/app/admin/case-studies/list/ListClient.tsx
"use client";

import "@styles/admin-cms.css";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  CaseStudy as CaseStudySchema,
  CASE_STUDY_STATUS_VALUES,
  CASE_STUDY_VISIBILITY_VALUES,
  SECTOR_GROUPS,
  SECTOR_VALUES,
  sectorLabel,
  type SectorValue,
  type CaseStudyType,
  normalizeTagList,
  tagSlug,
} from "@kit/schema";

import { useAdminCaseStudies } from "../../AdminCaseStudyStore";
import { ContextBanner } from "@/admin/components/ContextBanner";

import * as Tooltip from "@radix-ui/react-tooltip";

const FLAT_CATEGORY_OPTIONS = SECTOR_GROUPS.flatMap((g) =>
  g.values.map((v) => ({
    value: v,
    label: `${g.label}: ${sectorLabel(v)}`,
  }))
);

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

function coerceSector(raw: unknown): SectorValue | null {
  if (typeof raw !== "string") return null;
  const s = raw.trim();
  if (!s) return null;

  // exact match
  if (SECTOR_VALUES.includes(s as any)) return s as SectorValue;

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

function visibilityLabel(v: string) {
  if (v === "ClientSafe") return "Client-Viewable";
  return v;
}

export default function ListClient() {
  const { items: storeItems, resetToBaseline, upsertCaseStudy } = useAdminCaseStudies();
  const items = storeItems ?? [];

  const didAutoFixRef = useRef(false);

  const searchParams = useSearchParams();
  const savedId = searchParams.get("saved");
  const editId = searchParams.get("edit");

  // filters
  const [q, setQ] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<SectorValue | "">("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("");

  // --- Client Page Preview (opens the filtered page) ---
  const clientPagePreviewHref = useMemo(() => {
    if (!categoryFilter) return null;
    const seg = tagSlug(sectorLabel(categoryFilter));
    return seg ? `/${seg}` : null;
  }, [categoryFilter]);

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

  // Normalize + Zod-validate before saving
  function updateMeta(id: string, patch: Partial<CaseStudyType>) {
    const existing = items.find((c) => c.id === id);
    if (!existing) return;

    // gather sectors from: sectors[] / legacy sector / primarySector (if someone saved only that)
    const sectorsRaw =
      (patch as any).sectors ??
      (existing as any).sectors ??
      (patch as any).sector ??
      (existing as any).sector ??
      undefined;

    const primaryRaw = (patch as any).primarySector ?? (existing as any).primarySector ?? undefined;

    const tagsRaw = (patch as any).tags ?? (existing as any).tags;

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
      return;
    }

    upsertCaseStudy(res.data);
  }

  // Demo-only: if a record has no category, auto-assign DEFAULT_CATEGORY once.
  useEffect(() => {
    if (!DEMO_AUTO_DEFAULT_CATEGORY) return;
    if (didAutoFixRef.current) return;
    if (items.length === 0) return;

    const missing = items.filter((cs) => {
      const sectors = normalizeSectorsStrict([
        ...toStringArray((cs as any).sectors),
        ...toStringArray((cs as any).sector),
        ...toStringArray((cs as any).primarySector),
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

    return items.filter((cs) => {
      const sectors = normalizeSectorsStrict([
        ...toStringArray((cs as any).sectors),
        ...toStringArray((cs as any).sector),
        ...toStringArray((cs as any).primarySector),
      ]);

      const tags = normalizeTagsStrict(toStringArray((cs as any).tags));
      const tagSlugs = tags.map(tagSlug).filter(Boolean);

      if (categoryFilter && !sectors.includes(categoryFilter)) return false;
      if (statusFilter && cs.status !== statusFilter) return false;
      if (visibilityFilter && cs.visibility !== visibilityFilter) return false;

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
  }, [items, q, categoryFilter, statusFilter, visibilityFilter]);

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
        This is a temporary demo CMS database. You can filter by category, filter by visibility, and search.
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
            {FLAT_CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
            {/* {SECTOR_GROUPS.map((g) => (
              <optgroup key={g.id} label={g.label}>
                {g.values.map((v) => (
                  <option key={v} value={v}>
                    {sectorLabel(v)}
                  </option>
                ))}
              </optgroup>
            ))} */}
          </select>

          <select
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
          </select>
        </div>

        {/* Client Page Preview */}
        <div className="row listLensPage">
          <button
            type="button"
            className="btnSmall"
            onClick={openClientPagePreview}
            disabled={!clientPagePreviewHref}
            title={!clientPagePreviewHref ? "Select a category first" : "Open in a new tab"}
          >
            Client Page Preview
          </button>

          <span className="muted type-small">
            {clientPagePreviewHref
              ? `Opens: ${clientPagePreviewHref}`
              : "Select a category to preview its public page"}
          </span>
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
              ...toStringArray((cs as any).sectors),
              ...toStringArray((cs as any).sector),
              ...toStringArray((cs as any).primarySector),
            ]);

            const sectors = sectorsRaw.length ? sectorsRaw : [DEFAULT_CATEGORY];

            const primary =
              coerceSector((cs as any).primarySector) ??
              sectors[0] ??
              DEFAULT_CATEGORY;

            const isPublished = cs.status === "Published";
            const vis = cs.visibility;

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
                    <div className="dbProp">
                      <div className="dbPropLabel">Categories</div>
                      <div className="dbPillRow">
                        {sectors.length === 0 ? (
                          <span className="pill pill--muted">Uncategorized</span>
                        ) : (
                          <>
                            <span className="pill pill--cat">{sectorLabel(primary)}</span>
                            {sectors.length > 1 && (
                              <span className="pill pill--muted">+{sectors.length - 1} more</span>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="dbProp">
                      <div className="dbPropLabel">Publishing Status</div>
                      <div className="dbPillRow">
                        <span className={`pill pill--status ${isPublished ? "pill--published" : "pill--draft"}`}>
                          {isPublished ? "Published" : "Draft"}
                        </span>

                        <span className="pill pill--audience">{visibilityLabel(vis)}</span>
                      </div>
                    </div>
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
                              const next = [v, ...sectors.filter((x) => x !== v)];
                              updateMeta(cs.id, { sectors: next, primarySector: v });
                            }}
                          >
                            {sectors.map((v) => (
                              <option key={v} value={v}>
                                {sectorLabel(v)}
                              </option>
                            ))}
                          </select>
                          <span className="muted type-small">Shown on cards.</span>
                        </div>
                      ) : null}

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
                        {FLAT_CATEGORY_OPTIONS.map((opt) => (
                          <option
                            key={opt.value}
                            value={opt.value}
                            disabled={sectors.includes(opt.value)}
                          >
                            {opt.label}
                          </option>
                        ))}
{/*                         {SECTOR_GROUPS.map((g) => (
                          <optgroup key={g.id} label={g.label}>
                            {g.values.map((v) => (
                              <option key={v} value={v} disabled={sectors.includes(v)}>
                                {sectorLabel(v)}
                              </option>
                            ))}
                          </optgroup>
                        ))} */}
                      </select>
                    </div>

                    <div className="dbEditBlock">
                      <div className="dbEditBlockTitle">Publishing Status</div>

                      <div className="row" style={{ gap: ".5rem", flexWrap: "wrap" }}>
                        <select
                          className="input input--tiny"
                          value={cs.status}
                          onChange={(e) => updateMeta(cs.id, { status: e.target.value as any })}
                        >
                          {CASE_STUDY_STATUS_VALUES.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>

                        <select
                          className="input input--tiny"
                          value={cs.visibility}
                          onChange={(e) => updateMeta(cs.id, { visibility: e.target.value as any })}
                        >
                          {CASE_STUDY_VISIBILITY_VALUES.map((v) => (
                            <option key={v} value={v}>
                              {visibilityLabel(v)}
                            </option>
                          ))}
                        </select>
                      </div>
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
