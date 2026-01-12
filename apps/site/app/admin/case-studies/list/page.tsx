// apps/site/app/admin/case-studies/list/page.tsx
// "database" view of case studies

"use client";

import "@styles/admin-cms.css";

import Link from "next/link";
import { useEffect, useMemo, useState, useRef } from "react";

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

// Demo-only: restore “auto-set a category if none selected”
const DEMO_AUTO_DEFAULT_CATEGORY = true;
const DEFAULT_CATEGORY = (
  SECTOR_VALUES.includes("PublicSector")
    ? "PublicSector"
    : SECTOR_VALUES[0]
) as SectorValue;

function parseCommaList(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

// No typeof checks. This is “recover if some old draft accidentally saved the wrong shape”.
function toStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x));
  if (v == null) return [];
  const s = String(v).trim();
  if (!s) return [];
  return parseCommaList(s); // handles "a, b, c"
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
  const allowed = new Set<string>(SECTOR_VALUES);
  const out: SectorValue[] = [];

  for (const raw of list) {
    const s = String(raw).trim();
    if (!allowed.has(s)) continue;
    out.push(s as SectorValue);
  }

  // de-dupe while preserving order
  const seen = new Set<string>();
  return out.filter((v) => (seen.has(v) ? false : (seen.add(v), true)));
}

function visibilityLabel(v: string) {
  if (v === "ClientSafe") return "Client-safe";
  return v;
}

export default function CaseStudyListPage() {
  const { items, resetToBaseline, upsertCaseStudy } = useAdminCaseStudies();

  const didAutoFixRef = useRef(false);

  // filters
  const [q, setQ] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<SectorValue | "">("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("");

  // per-row editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tagDraftById, setTagDraftById] = useState<Record<string, string>>({});

  // fix this so it can't save incorrect case study shapes. prevent sectors: [] from being saved and 
  // upgrades any “wrong-shape” legacy data into the correct shape as soon as the user touches it
  // new version normalizes + Zod-validates before saving
  function updateMeta(id: string, patch: Partial<CaseStudyType>) {
    const existing = items.find((c) => c.id === id);
    if (!existing) return;

     // Normalize sectors/tags even if existing data was the wrong shape
    const sectorsRaw = (patch as any).sectors ?? (existing as any).sectors;
    const tagsRaw = (patch as any).tags ?? (existing as any).tags;

    const sectorsNorm = normalizeSectorsStrict(toStringArray(sectorsRaw));
    const tagsNorm = normalizeTagsStrict(toStringArray(tagsRaw));

    const candidate: CaseStudyType = {
      ...existing,
      ...patch,
      sectors: sectorsNorm.length ? sectorsNorm : [DEFAULT_CATEGORY],
      tags: tagsNorm,
    };

    const res = CaseStudySchema.safeParse(candidate);
    if (!res.success) {
      console.warn("[admin] refusing to save invalid CaseStudy", res.error.format());
      return;
    }
    
    upsertCaseStudy(res.data);

    /* upsertCaseStudy({ ...existing, ...patch }); */
  }

  // Demo-only: if a record has no category, auto-assign DEFAULT_CATEGORY once.
  // New update: gated version so it doesn't run infinitely
  useEffect(() => {
    if (!DEMO_AUTO_DEFAULT_CATEGORY) return;
    if (didAutoFixRef.current) return;
    if (items.length === 0) return;

    // Only patch records that are genuinely missing categories.
    const missing = items.filter((cs) => {
      const sectors = normalizeSectorsStrict(
        toStringArray((cs as unknown as { sectors?: unknown }).sectors)
      );
      return sectors.length === 0;
    });

    if (missing.length === 0) return;

    for (const cs of missing) {
      updateMeta(cs.id, { sectors: [DEFAULT_CATEGORY] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);
/*   }, [items]); */

  const filtered = useMemo(() => {
    const qq = q.toLowerCase().trim();

    return items.filter((cs) => {
      const sectors = normalizeSectorsStrict(toStringArray((cs as unknown as { sectors?: unknown }).sectors));
      const tags = normalizeTagsStrict(toStringArray((cs as unknown as { tags?: unknown }).tags));

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

  return (
    <main className="c-admin">
      <ContextBanner view="preview">
        This is a temporary demo CMS database. You can filter by category, filter by visibility, and search.
        Changes are stored only in your browser (localStorage).
      </ContextBanner>

      <div className="row" style={{ justifyContent: "space-between" }}>
        <h1 className="type-h2">Demo Case Study Database</h1>
        <div className="row" style={{ gap: ".5rem" }}>
{/*           <Link className="btnSmall" href="/admin/case-studies/new">
            New
          </Link> */}
          <button className="btn-3" type="button" onClick={resetToBaseline}>
            Reset demo data
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="card" style={{ marginTop: "1rem" }}>
        <div className="row" style={{ gap: ".5rem", flexWrap: "wrap" }}>
          <input
            className="input"
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
            {SECTOR_VALUES.map((v) => (
              <option key={v} value={v}>
                {sectorLabel(v)}
              </option>
            ))}
          </select>

{/*           <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All status</option>
            {CASE_STUDY_STATUS_VALUES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select> */}

          <select className="input" value={visibilityFilter} onChange={(e) => setVisibilityFilter(e.target.value)}>
            <option value="">Filter by visibility</option>
            {CASE_STUDY_VISIBILITY_VALUES.map((v) => (
              <option key={v} value={v}>
                {visibilityLabel(v)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* LIST */}
      <div className="card" style={{ marginTop: "1rem" }}>
        <p className="muted">
          Showing {filtered.length} / {items.length}
        </p>

        <div style={{ display: "grid", gap: ".75rem" }}>
          {filtered.map((cs) => {
            const clientLabel = (cs.client ?? cs.title ?? "Untitled").trim() || "Untitled";
            const hasSeparateTitle =
              (cs.client ?? "").trim().length > 0 &&
              (cs.title ?? "").trim().length > 0 &&
              (cs.client ?? "").trim() !== (cs.title ?? "").trim();

            const secondaryTitle = hasSeparateTitle ? cs.title : null;

            const sectors = normalizeSectorsStrict(toStringArray((cs as unknown as { sectors?: unknown }).sectors));
            const tags = normalizeTagsStrict(toStringArray((cs as unknown as { tags?: unknown }).tags));

            const isEditing = editingId === cs.id;

            const isPublished = cs.status === "Published";
            const vis = cs.visibility;

            return (
              <div key={cs.id} className="card dbItem">
                <div className="dbItemHeader">
                  <div className="dbItemMain">
                    <div className="dbItemClient">{clientLabel}</div>
{/*                     {secondaryTitle && <div className="dbItemTitle">{secondaryTitle}</div>} */}

                    <div className="dbBadges">
                      <span className={`badge ${isPublished ? "badge--published" : "badge--draft"}`}>
                        <span className="badgeDot" />
                        {isPublished ? "Published" : "Draft"}
                      </span>

                      <span className={`badge badge--audience`}>
                        <span className="badgeDot" />
                        {visibilityLabel(vis)}
                      </span>
                    </div>
                  </div>

                  <div className="dbActions">
                    <Link className="btnSmall" href={`/admin/case-studies/mock/${cs.slug}`}>
                      Preview
                    </Link>

                    <button
                      className="btnSmall"
                      type="button"
                      onClick={() => setEditingId((prev) => (prev === cs.id ? null : cs.id))}
                      aria-expanded={isEditing}
                    >
                      {isEditing ? "Close" : "Edit"}
                    </button>
                  </div>
                </div>

                <div className="dbSummary">{cs.summaryShort}</div>

                {/* PROPERTY ROWS (compact, always visible) */}
                <div className="dbProps">
                  <div className="dbProp">
                    <div className="dbPropLabel">Categories</div>
                    <div className="dbPillRow">
                      {sectors.length === 0 ? (
                        <span className="pill pill--muted">Uncategorized</span>
                      ) : (
                        sectors.map((s) => (
                          <span key={s} className="pill pill--cat">
                            {sectorLabel(s)}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

{/*                   <div className="dbProp">
                    <div className="dbPropLabel">Tags</div>
                    <div className="dbPillRow">
                      {tags.length === 0 ? (
                        <span className="pill pill--muted">None</span>
                      ) : (
                        tags.map((t) => (
                          <span key={tagSlug(t)} className="pill pill--tag">
                            {t}
                          </span>
                        ))
                      )}
                    </div>
                  </div> */}
                </div>

                {/* EDIT PANEL (only when Edit is open) */}
                {isEditing && (
                  <div className="dbEditPanel">
                    {/* MULTI-CATEGORY EDITOR */}
                    <div className="dbEditBlock">
                      <div className="form-label">Edit categories</div>

                      <div className="dbPillRow">
                        {sectors.map((s) => (
                          <button
                            key={s}
                            type="button"
                            className="pill pill--cat pill--removable"
                            onClick={() => {
                              const next = sectors.filter((x) => x !== s);
                              updateMeta(cs.id, { sectors: next.length ? next : [DEFAULT_CATEGORY] });
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
                          updateMeta(cs.id, { sectors: [...sectors, v] });
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
                    </div>

                    {/* TAG EDITOR */}
                    <div className="dbEditBlock">
                      <div className="form-label">Edit tags</div>

                      <div className="dbPillRow">
                        {tags.map((t) => {
                          const slug = tagSlug(t);
                          return (
                            <button
                              key={slug}
                              type="button"
                              className="pill pill--tag pill--removable"
                              onClick={() => {
                                const next = tags.filter((x) => tagSlug(x) !== slug);
                                updateMeta(cs.id, { tags: next });
                              }}
                              title="Remove tag"
                            >
                              {t} <span className="pillX">×</span>
                            </button>
                          );
                        })}
                      </div>

                      <input
                        className="input input--tiny"
                        value={tagDraftById[cs.id] ?? ""}
                        placeholder="Add tags (comma-separated). Enter to save."
                        onChange={(e) =>
                          setTagDraftById((prev) => ({
                            ...prev,
                            [cs.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key !== "Enter") return;
                          e.preventDefault();

                          const raw = (tagDraftById[cs.id] ?? "").trim();
                          if (!raw) return;

                          const added = parseCommaList(raw);
                          const merged = normalizeTagsStrict([...tags, ...added]);
                          updateMeta(cs.id, { tags: merged });

                          setTagDraftById((prev) => ({ ...prev, [cs.id]: "" }));
                        }}
                        onBlur={() => {
                          const raw = (tagDraftById[cs.id] ?? "").trim();
                          if (!raw) return;

                          const added = parseCommaList(raw);
                          const merged = normalizeTagsStrict([...tags, ...added]);
                          updateMeta(cs.id, { tags: merged });

                          setTagDraftById((prev) => ({ ...prev, [cs.id]: "" }));
                        }}
                      />
                    </div>

                    {/* STATUS / VISIBILITY EDITOR (optional but useful) */}
                    <div className="dbEditBlock">
                      <div className="form-label">Publishing</div>

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
