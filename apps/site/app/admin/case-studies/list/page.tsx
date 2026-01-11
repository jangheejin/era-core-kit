// apps/site/app/admin/case-studies/list/page.tsx
// "database" view of case studies

"use client";

import "@styles/admin-cms.css";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  CASE_STUDY_STATUS_VALUES,
  CASE_STUDY_VISIBILITY_VALUES,
  SECTOR_VALUES,
  SECTOR_GROUPS,
  sectorLabel,
  type SectorValue,
  type CaseStudyType,
  normalizeTagList,
  tagSlug
} from "@kit/schema";

import { useAdminCaseStudies } from "../../AdminCaseStudyStore";
import { ContextBanner } from "@/admin/components/ContextBanner";

export default function CaseStudyListPage() {
  
  //const { items } = useAdminCaseStudies();
  const { items, resetToBaseline, upsertCaseStudy } = useAdminCaseStudies();

  const [q, setQ] = useState("");
  //const [sector, setSector] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [visibility, setVisibility] = useState<string>("");

//  const [sector, setSector] = useState<SectorValue | "">("");
  const [sectorFilter, setSectorFilter] = useState<SectorValue | "">("");

  const [categoryFilter, setCategoryFilter] = useState<SectorValue | "">("");



  type TagMode = "any" | "all";
  const [selectedTagSlugs, setSelectedTagSlugs] = useState<string[]>([]);
  const [tagMode, setTagMode] = useState<"any" | "all">("any");
  const [tagSearch, setTagSearch] = useState("");

  const [tagDraftById, setTagDraftById] = useState<Record<string, string>>({});

function parseTagString(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function commitTagDraft(cs: CaseStudyType) {
  const raw = (tagDraftById[cs.id] ?? "").trim();
  if (!raw) return;

  const merged = normalizeTagsStrict([...(cs.tags ?? []), ...parseTagString(raw)]);
  updateMeta(cs.id, { tags: merged });

  setTagDraftById((prev) => ({ ...prev, [cs.id]: "" }));
}

function removeTag(cs: CaseStudyType, removeSlug: string) {
  const next = normalizeTagsStrict(cs.tags ?? []).filter((t) => tagSlug(t) !== removeSlug);
  updateMeta(cs.id, { tags: next });
}


  const tagOptions = useMemo(() => {
    const counts = new Map<string, { label: string; slug: string; count: number }>();
    for (const cs of items) {
      for (const t of normalizeTagList(cs.tags ?? [])) {
        const slug = tagSlug(t);
        const prev = counts.get(slug);
        if (prev) prev.count += 1;
        else counts.set(slug, { label: t, slug, count: 1 });
      }
    }
    return Array.from(counts.values()).sort((a, b) => b.count - a.count);
  }, [items]);

  const visibleTagOptions = useMemo(() => {
    const q = tagSearch.trim().toLowerCase();
    if (!q) return tagOptions;
    return tagOptions.filter((t) => t.label.toLowerCase().includes(q));
  }, [tagOptions, tagSearch]);

  function toggleTag(slug:string) {
      setSelectedTagSlugs((prev) =>
      prev.includes(slug) ? prev.filter((x) => x !== slug): [...prev, slug],
    );
  }

  function updateMeta(id: string, patch: Partial<CaseStudyType>) {
    const existing = items.find((c) => c.id === id);
    if (!existing) return;
    upsertCaseStudy({ ...existing, ...patch });
  }

  function normalizeTagsStrict(input: string[]) {
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
  

  //now adding tag filters into existing filtered useMemo
  const filtered = useMemo(() => {
    const qq = q.toLowerCase().trim();
    
    return items.filter((cs) => {
//      if (sectorFilter && !(cs.sectors ?? []).includes(sectorFilter)) return false;
      if (sectorFilter && !cs.sectors?.includes(sectorFilter)) return false;
//      if (sector && !cs.sectors?.includes(sector)) return false;
      if (status && cs.status !== status) return false;
      if (visibility && cs.visibility !== visibility) return false;

      //tag CHIPS filtering
      if (selectedTagSlugs.length > 0) {
        const csTagSlugs = new Set(normalizeTagList(cs.tags ?? []).map(tagSlug));

        const ok =
          tagMode === "any"
            ? selectedTagSlugs.some((t) => csTagSlugs.has(t))
            : selectedTagSlugs.every((t) => csTagSlugs.has(t));
        
        if (!ok) return false;
      }
/*         const hits = selectedTagSlugs.filter((t) => csTagSlugs.includes(t)).length;
        if (tagMode === "any" && hits === 0) return false;
        if (tagMode === "all" && hits !== selectedTagSlugs.length) return false; */

      if (!qq) return true;
      const hay = [
        cs.title,
        cs.client ?? "",
        cs.slug,
        cs.summaryShort,
        ...(cs.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return hay.includes(qq);
    });
  }, [//DEPENDENCIES
    items, 
    q, 
    sectorFilter,
    //sector, 
    status, 
    visibility,
    selectedTagSlugs,
    tagMode
  ]);

  /*TO DO: MAYBE CHANGE CLASSNAME FROM  C-ADMIN BACK TO C-SECTION, ETC? and similarly throughout*/
  //const [sectors, setSectors] = useState<SectorValue[]>([SECTOR_VALUES[0]]);
  return (
    <main className="c-admin">
      <ContextBanner view="preview">This is a {/* temporary  */}demo CMS database. 
        {/* You can filter by client type using the dropdown menu, "All sectors". You can also filter by tag, client name, etc, by typing in the "Search" box */}
        {/*<br/><br/>
         After you <Link href="/admin/case-studies/new">create your own mock case studies</Link>, you can preview them here as if they're part of this 
        database, but changes are stored only in your browser. They will remain viewable by you as long as you don't clear 
        your cache/use incognito mode<br/><br/> 
        The database currently contains (<strong>{items.length}</strong>) total case studies, 5 of 
        which are mock entries created to populate the database with something. */}
      </ContextBanner>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h1 className = "type-h2">Case Study Database</h1>
        <div className="row">
{/*           <Link href="/admin">Admin</Link>
          <Link href="/admin/case-studies/new">New</Link> */}
          <button className="btn-3" type="button" onClick={resetToBaseline}>
            Reset demo data
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <div className="row">
          <input
            className="input"
            /* placeholder="Search title / client / slug / tags…" */
            placeholder="Search client / category / tags…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ flex: 1, minWidth: 240 }}
          />

          <select
            className="input"
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value as SectorValue | "")}
          >
{/*           <select className="input" value={sector} onChange={(e) => setSector(e.target.value)}> */}
            {/* <option value="">All sectors</option> */}
            <option value="">Filter by category</option>
            {SECTOR_VALUES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>

{/*           <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}> */}
            {/* <option value="">All status</option> */}
{/*             <option value="">Filter by draft status</option> */}
{/*             {CASE_STUDY_STATUS_VALUES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
 */}
          <select
            className="input"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="">Filter by visibility</option>
            {CASE_STUDY_VISIBILITY_VALUES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* tag filtering */}
        
        {/* <div className="tag-filter">
          <div className="tag-filter__top">
            <div className="tag-filter__modes">
              <label>Filter by tag</label>
              <button
                type="button"
                className={`chip ${tagMode === "any" ? "chip--active" : ""}`}
                onClick={() => setTagMode("any")}
                aria-pressed={tagMode === "any"}
              >
                Match any
              </button>

              <button
                type="button"
                className={`chip ${tagMode === "all" ? "chip--active" : ""}`}
                onClick={() => setTagMode("all")}
                aria-pressed={tagMode === "all"}
              >
                Match all
              </button>

              {selectedTagSlugs.length > 0 && (
                <button className="btn" type="button" onClick={() => setSelectedTagSlugs([])}>
                  Clear tags
                </button>
              )}
            </div>

            <input
              className="input tag-filter__search"
              placeholder="Filter tags…"
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
            />
          </div>

          <div className="tag-cloud" role="list">
            {visibleTagOptions.map((t) => {
              const active = selectedTagSlugs.includes(t.slug);
              return (
                <button
                  key={t.slug}
                  type="button"
                  className={`chip tag-chip ${active ? "chip--active" : ""}`}
                  onClick={() => toggleTag(t.slug)}
                  aria-pressed={active}
                  title={`${t.label} (${t.count})`}
                >
                  <span className="tag-chip__label">{t.label}</span>
                  <span className="tag-chip__count">{t.count}</span>
                </button>
              );
            })}
          </div>
        </div> */}

{/* END OF CASE STUDY FILTER SECTION */}
      </div>

        

      <div className="card" style={{ marginTop: "1rem" }}>
        <p className="muted">Showing {filtered.length} / {items.length}</p>

        <div style={{ display: "grid", gap: ".75rem" }}>
          {filtered.map((cs) => (
            <div key={cs.id} className="card">
              <div className="row" style={{ justifyContent: "space-between" }}>
              {(() => {
                const clientLabel = cs.client ?? cs.title ?? "Untitled";

                const isPublished = cs.status === "Published";
                const isFeatured = Boolean((cs as any).isFeaturedHome); // remove `(as any)` if CaseStudyType includes it
                const isClientViewable = Boolean((cs as any).isPublic); // same note as above

                const audienceLabel = !isPublished
                  ? "Internal"
                  : isFeatured
                    ? "Homepage"
                    : isClientViewable
                      ? "Client view"
                      : (cs.visibility === "Public" ? "Public" : "Internal");

                return (
                  <div className="dbItemHeader">
                    <div>
                      <div className="dbItemClient">{clientLabel}</div>

                      <div className="dbItemBadges">
                        <span className={`chip chip--status ${isPublished ? "chip--published" : "chip--draft"}`}>
                          {isPublished ? "Published" : "Draft"}
                        </span>

                        <span className={`chip chip--status ${audienceLabel === "Internal" ? "chip--internal" : "chip--client"}`}>
                          {audienceLabel}
                        </span>

                        {isFeatured && <span className="chip chip--status chip--featured">Featured</span>}
                      </div>
                    </div>

{/*                     <div className="row">
                      <Link href={`/admin/case-studies/mock/${cs.slug}`}>Preview</Link>
                    </div> */}
                  </div>
                );
              })()}


                <div className="row">
                  <Link href={`/admin/case-studies/mock/${cs.slug}`}>Preview</Link>
                </div>
              </div>

              <div className="dbSummary">
                {cs.summaryShort}
              </div>

              <div className="dbMetaBar">
                {/* Tag pills */}
{/*                 <div className="dbTagWrap" aria-label="Tags">
                  {normalizeTagsStrict(cs.tags ?? []).map((t) => {
                    const slug = tagSlug(t);
                    return (
                      <button
                        key={slug}
                        type="button"
                        className="chip chip--soft dbTagPill"
                        onClick={() => removeTag(cs, slug)}
                        title="Remove tag"
                      >
                        <span>{t}</span>
                        <span className="dbTagRemove">×</span>
                      </button>
                    );
                  })}

                  <input
                    className="input input--tiny dbTagInput"
                    value={tagDraftById[cs.id] ?? ""}
                    placeholder="Add tag…"
                    onChange={(e) => setTagDraftById((prev) => ({ ...prev, [cs.id]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        commitTagDraft(cs);
                      }
                    }}
                    onBlur={() => commitTagDraft(cs)}
                  />
                </div> */}

                {/* Sector edit (still editable, but not shown as text in the item line) */}
{/*                 <select
                  className="input input--tiny dbSectorSelect"
                  value={cs.sectors?.[0] ?? ""}
                  onChange={(e) => {
                    const v = e.target.value as "" | SectorValue;
                    updateMeta(cs.id, { sectors: v ? [v] : [] });
                  }}
                  aria-label="Client type (sector)"
                  title="Client type"
                >
                  <option value="">Client type…</option>
                  {SECTOR_VALUES.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select> */}
              </div>


{/*               <details className="admin-disclosure admin-disclosure--compact"> */}
{/*                 <summary className="admin-disclosure__summary">
                  <span className="muted">Edit tags / sector</span>
                  <span className="muted">Expand</span>
                </summary> */}

                <div className="form-row form-group" style={{ marginTop: ".75rem" }}>
                  <div className="form-field">
                    {/* <label className="form-label">Sector (client type)</label> */}
                    <label className="form-label">Categories</label>
                    <select
                      className="input input--tiny"
                      value={cs.sectors?.[0] ?? ""}
                      onChange={(e) => {
                        const v = e.target.value as "" | SectorValue;
                        updateMeta(cs.id, { sectors: v ? [v] : [] });
                      }}
                    >
                      <option value="">—</option>
                      {SECTOR_VALUES.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

{/*                   <div className="form-field">
                    <label className="form-label">Tags</label>
                    <input
                      className="input input--tiny"
                      defaultValue={(cs.tags ?? []).join(", ")}
                      placeholder="e.g. environment, appropriations"
                      onBlur={(e) => {
                        const tags = normalizeTagList(
                          e.target.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean)
                        );
                        
                        updateMeta(cs.id, { tags });
                      }}
                    />
                    <p className="admin-hint">Comma-separated. Saves when you click out.</p>
                  </div> */}
                </div>
{/*               </details> */}



            </div>
          ))}
        </div>
      </div>
    </main>
  );
}





/*       <div className="c-container c-stack">
        <h1 className="type-h2">Mock Case Study Database</h1>
        <p className="type-body type-muted">
          These entries are stored locally in this browser (localStorage). They
          are not synced to a backend.
        </p>

        {items.length === 0 ? (
          <p className="type-body type-muted">
            No mock case studies yet.{" "}
            <Link href="/admin/case-studies/new" className="c-link">
              Create one now
            </Link>
            .
          </p>
        ) : (
          <div className="c-stack">
            {items.map((cs) => (
              <div key={cs.slug} className="card">
                <div className="card-body c-stack">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="type-h3">{cs.title}</h2>
                      <p className="type-small type-muted">
                        /admin/case-studies/mock/{cs.slug}
                      </p>
                      <p className="type-small type-muted">
                        <strong>Status:</strong> {cs.status}{" "}
                        <strong style={{ marginLeft: 12 }}>Visibility:</strong>{" "}
                        {cs.visibility}
                      </p>
                    </div>

                    <Link
                      href={`/admin/case-studies/mock/${cs.slug}`}
                      className="c-button"
                    >
                      View page
                    </Link>
                  </div>

                  <p className="type-body type-muted">{cs.summaryShort}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} */