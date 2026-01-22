// apps/site/app/admin/client-pages/page.tsx
"use client";

import "@styles/admin-cms.css";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
  SECTOR_GROUPS,
  sectorLabel,
  type SectorValue,
  normalizeTagList,
} from "@kit/schema";
import { useAdminClientPages } from "@/admin/AdminClientPageStore";
import { Markdown } from "@/components/Markdown";

function applyWrap(
  textarea: HTMLTextAreaElement | null,
  before: string,
  after: string
) {
  if (!textarea) return;
  const start = textarea.selectionStart ?? 0;
  const end = textarea.selectionEnd ?? 0;
  const text = textarea.value;
  const selected = text.slice(start, end);
  const next =
    text.slice(0, start) + before + selected + after + text.slice(end);
  textarea.value = next;
  const cursor = start + before.length + selected.length + after.length;
  textarea.selectionStart = cursor;
  textarea.selectionEnd = cursor;
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

function applyLink(textarea: HTMLTextAreaElement | null) {
  applyWrap(textarea, "[", "](https://)");
}

export default function AdminClientPages() {
  const {
    pages,
    createPage,
    upsertPage,
    removePage,
    ensureUniqueSlug,
    resetPages,
  } = useAdminClientPages();

  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const selected = useMemo(
    () => pages.find((p) => p.slug === selectedSlug) ?? null,
    [pages, selectedSlug]
  );

  const [name, setName] = useState("");
  const [desiredSlug, setDesiredSlug] = useState("");
  const [categoryDrafts, setCategoryDrafts] = useState<Array<SectorValue | "">>([""]);
  const [tags, setTags] = useState("");
  const [tagMode, setTagMode] = useState<"any" | "all">("any");
  const [audience, setAudience] = useState<"Public" | "ClientSafe">("Public");
  const [bodyMDX, setBodyMDX] = useState("");
  const editorRef = useRef<HTMLTextAreaElement | null>(null);

  const tagChips = useMemo(
    () =>
      normalizeTagList(
        tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      ),
    [tags]
  );
  const selectedCategories = useMemo(() => {
    const out: SectorValue[] = [];
    const seen = new Set<SectorValue>();
    for (const d of categoryDrafts) {
      if (!d) continue;
      if (seen.has(d)) continue;
      seen.add(d);
      out.push(d);
    }
    return out;
  }, [categoryDrafts]);

  function addCategoryDraft() {
    setCategoryDrafts((prev) => [...prev, ""]);
  }

  function setCategoryAt(index: number, value: SectorValue | "") {
    setCategoryDrafts((prev) => prev.map((v, i) => (i === index ? value : v)));
  }

  function removeCategoryAt(index: number) {
    setCategoryDrafts((prev) => prev.filter((_, i) => i !== index));
  }

  function loadFrom(pageSlug: string) {
    const page = pages.find((p) => p.slug === pageSlug);
    if (!page) return;
    setSelectedSlug(page.slug);
    setName(page.name);
    setDesiredSlug(page.slug);
    setCategoryDrafts(page.filters.sectors.length ? [...page.filters.sectors] : [""]);
    setTags(page.filters.tags.join(", "));
    setTagMode(page.filters.tagMode);
    setAudience(page.filters.audience);
    setBodyMDX(page.bodyMDX ?? "");
    setIsEditing(true);
  }

  function resetForm() {
    setSelectedSlug(null);
    setName("");
    setDesiredSlug("");
    setCategoryDrafts([""]);
    setTags("");
    setTagMode("any");
    setAudience("Public");
    setBodyMDX("");
  }

  function startNew() {
    resetForm();
    setIsEditing(true);
  }

  function exitEditor() {
    resetForm();
    setIsEditing(false);
  }

  function handleSave() {
    const nextTags = normalizeTagList(
      tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    );

    if (selected) {
      const nextSlug = ensureUniqueSlug(
        desiredSlug || selected.slug,
        selected.id
      );
      upsertPage({
        ...selected,
        name: name.trim() || selected.name,
        slug: nextSlug,
        bodyMDX,
        filters: {
          ...selected.filters,
          sectors: selectedCategories,
          tags: nextTags,
          tagMode,
          audience,
        },
        updatedAt: Date.now(),
      });
      setSelectedSlug(nextSlug);
      return;
    }

    const created = createPage({
      name: name.trim() || "Client page",
      desiredSlug: desiredSlug || name,
      filters: {
        sectors: selectedCategories,
        tags: nextTags,
        tagMode,
        audience,
      },
    });
    upsertPage({ ...created, bodyMDX, updatedAt: Date.now() });
    loadFrom(created.slug);
  }

  return (
    <main className="c-admin">
      <div
        className="row"
        style={{ justifyContent: "space-between", marginTop: "1rem" }}
      >
        <h1 className="type-h2">Client pages</h1>
      </div>

      <div className="card mt">
        <div
          className="row"
          style={{
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: 260 }}>
            <div
              className="row"
              style={{
                alignItems: "center",
                gap: ".5rem",
                marginBottom: ".35rem",
              }}
            >
              <h2 className="type-h3" style={{ marginBottom: 0 }}>
                What are client pages?
              </h2>
              <Tooltip.Provider delayDuration={200}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      className="infoButton"
                      type="button"
                      aria-label="What are client pages?"
                    >
                      ?
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                  <Tooltip.Content
                    side="top"
                    sideOffset={8}
                    className="tooltipContent"
                  >
                      Client pages are curated collections of case studies for
                      a specific audience, with optional intro text and a
                      shareable URL. Use them when you want a tailored view
                      beyond the main case study library.
                      <Tooltip.Arrow className="tooltipArrow" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>
            <p className="muted">
              Build a focused, client-facing page by choosing categories and
              tags, adding a short intro, and setting a publishing status.
              These pages are saved, editable, and shareable.
            </p>
          </div>
          <div className="row" style={{ gap: ".5rem" }}>
            {!isEditing ? (
              <button className="btnSmall" type="button" onClick={startNew}>
                New page
              </button>
            ) : (
              <button className="btnSmall" type="button" onClick={exitEditor}>
                Back to list
              </button>
            )}
          </div>
        </div>
      </div>
      {!isEditing ? (
        <div className="card mt">
          <div className="dbResultsHeader">
            <div className="dbResultsHeader__sort">
              <h2 className="type-h2" style={{ marginBottom: 0 }}>
                Client Pages Database
              </h2>
            </div>
            <p className="muted dbResultsHeader__count">
              Showing {pages.length} / {pages.length}
            </p>
          </div>
          <p className="muted type-small" style={{ marginTop: ".5rem" }}>
            This list is your saved client pages. Choose one to edit or start a
            new page.
          </p>
          <div className="dbListGrid">
            {pages.length ? (
              pages.map((page) => {
                const hasIntro = Boolean(page.bodyMDX?.trim());
                return (
                  <section key={page.slug} className="card dbItem">
                    <div className="dbItemHeader">
                      <div className="dbItemMain">
                        <div className="dbItemClient">{page.name}</div>
                        <div className="dbItemTitle">/{page.slug}</div>
                      </div>
                      <div className="dbActions">
                        <button
                          className="btnSmall"
                          type="button"
                          onClick={() => loadFrom(page.slug)}
                        >
                          Edit
                        </button>
                        <button
                          className="btnSmall"
                          type="button"
                          onClick={() => removePage(page.slug)}
                        >
                          Remove
                        </button>
                        <span className="pill pill--status">
                          {page.filters.audience === "Public"
                            ? "Published"
                            : "Draft"}
                        </span>
                      </div>
                    </div>
                    <div className="dbSummary">
                      {hasIntro
                        ? "Intro text added."
                        : "No intro text yet — add one to orient readers."}
                    </div>
                    <div className="dbProps">
                      <div className="dbProp">
                        <div className="dbPropLabel">Last updated</div>
                        <div className="dbPropValue">
                          {new Date(page.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="dbProp">
                        <div className="dbPropLabel">Created</div>
                        <div className="dbPropValue">
                          {new Date(page.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </section>
                );
              })
            ) : (
              <p className="muted">No client pages yet.</p>
            )}
          </div>
          <div
            className="row"
            style={{ justifyContent: "flex-end", marginTop: "1rem" }}
          >
            <button className="btn-3" type="button" onClick={resetPages}>
              Reset demo data
            </button>
          </div>
        </div>
      ) : (
        <div className="card mt">
          <div
            className="row"
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <h2 className="type-h3" style={{ marginBottom: 0 }}>
              {selected ? "Edit client page" : "Create client page"}
            </h2>
            <div className="row" style={{ gap: ".5rem" }}>
              <button className="btnSmall" type="button" onClick={exitEditor}>
                Back to list
              </button>
              {selected ? (
                <button
                  className="btnSmall"
                  type="button"
                  onClick={() => {
                    removePage(selected.slug);
                    exitEditor();
                  }}
                >
                  Delete
                </button>
              ) : null}
            </div>
          </div>
          <p className="muted" style={{ marginTop: ".5rem" }}>
            Client pages combine categories and tags into a tailored, shareable
            page. Add a clear name, an optional intro to orient readers, and set
            the publishing status before saving.
          </p>
          <div className="form-group">
            <label className="form-label">Page name</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <p className="muted type-small" style={{ marginTop: 6 }}>
              This is the internal title shown in the client pages list.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">URL slug</label>
            <input
              className="input"
              value={desiredSlug}
              onChange={(e) => setDesiredSlug(e.target.value)}
              placeholder="client-page-slug"
            />
            <p className="muted type-small" style={{ marginTop: 6 }}>
              Used in the URL. Keep it short and readable.
            </p>
          </div>

          <div className="form-group">
            <div className="row" style={{ gap: ".5rem", alignItems: "center" }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                Categories
              </label>
              <Tooltip.Provider delayDuration={200}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      className="infoButton"
                      type="button"
                      aria-label="Categories help"
                    >
                      ?
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="top"
                      sideOffset={8}
                      className="tooltipContent"
                    >
                      Pick one or more categories. Case studies that match any
                      selected category will be included.
                      <Tooltip.Arrow className="tooltipArrow" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>
            <p className="muted type-small" style={{ marginTop: 6 }}>
              Add multiple categories to broaden the results.
            </p>
            <div className="category-stack" style={{ marginTop: ".5rem" }}>
              {categoryDrafts.map((v, idx) => (
                <div key={idx} className="category-row">
                  <select
                    className="input"
                    value={v}
                    onChange={(e) => setCategoryAt(idx, e.target.value as SectorValue | "")}
                    aria-label={idx === 0 ? "Primary category" : `Additional category ${idx + 1}`}
                  >
                    <option value="">Select a category…</option>
                    {SECTOR_GROUPS.map((group) => (
                      <optgroup key={group.id} label={group.label}>
                        {group.values.map((opt) => (
                          <option key={opt} value={opt}>
                            {sectorLabel(opt)}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {idx > 0 && (
                    <button
                      type="button"
                      className="btnLink"
                      onClick={() => removeCategoryAt(idx)}
                      aria-label={`Remove category ${idx + 1}`}
                    >
                      Remove
                    </button>
                  )}
                  {idx === 0 ? (
                    <span className="muted type-small">Primary category</span>
                  ) : null}
                  {idx > 0 && idx === categoryDrafts.length - 1 ? (
                    <span className="muted type-small">Additional categories</span>
                  ) : null}
                </div>
              ))}
              {categoryDrafts[categoryDrafts.length - 1] !== "" ? (
                <button type="button" className="btnLink" onClick={addCategoryDraft}>
                  + Add another category
                </button>
              ) : null}
            </div>
          </div>

          <div className="form-group">
            <div className="row" style={{ gap: ".5rem", alignItems: "center" }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                Tags to include
              </label>
              <Tooltip.Provider delayDuration={200}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      className="infoButton"
                      type="button"
                      aria-label="Tags help"
                    >
                      ?
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="top"
                      sideOffset={8}
                      className="tooltipContent"
                    >
                      Enter one or more tags, separated by commas. These are
                      matched against case study tags.
                      <Tooltip.Arrow className="tooltipArrow" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>
            <input
              className="input"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Earmark, Pilot Program"
            />
            <p className="muted type-small" style={{ marginTop: 6 }}>
              Use existing tags or create new ones. The Tag Filter Mode below
              controls how they are matched.
            </p>
            {tagChips.length ? (
              <div className="client-links">
                {tagChips.map((t) => (
                  <span key={t} className="chip chip--soft">
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="form-group">
            <div className="row" style={{ gap: ".5rem", alignItems: "center" }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                Tag Filter Mode
              </label>
              <Tooltip.Provider delayDuration={200}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      className="infoButton"
                      type="button"
                      aria-label="Tag filter mode help"
                    >
                      ?
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="top"
                      sideOffset={8}
                      className="tooltipContent"
                    >
                      Match any = include case studies with at least one tag.
                      Match all = only include case studies that have every
                      listed tag.
                      <Tooltip.Arrow className="tooltipArrow" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>
            <select
              className="input"
              value={tagMode}
              onChange={(e) => setTagMode(e.target.value as "any" | "all")}
            >
              <option value="any">Match any tag</option>
              <option value="all">Match all tags</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Intro Text (Optional)</label>
            <p className="muted type-small" style={{ marginTop: 6 }}>
              Use the formatting toolbar to style the intro. The preview shows
              exactly how it will appear.
            </p>
            <div className="editor">
              <div
                className="editor__toolbar"
                role="toolbar"
                aria-label="Formatting"
              >
                <button
                  className="editor__btn"
                  type="button"
                  onClick={() => applyWrap(editorRef.current, "**", "**")}
                >
                  Bold
                </button>
                <button
                  className="editor__btn"
                  type="button"
                  onClick={() => applyWrap(editorRef.current, "*", "*")}
                >
                  Italic
                </button>
                <button
                  className="editor__btn"
                  type="button"
                  onClick={() => applyWrap(editorRef.current, "<u>", "</u>")}
                >
                  Underline
                </button>
                <button
                  className="editor__btn"
                  type="button"
                  onClick={() => applyLink(editorRef.current)}
                >
                  🔗 Link
                </button>
              </div>
              <textarea
                ref={editorRef}
                className="editor__textarea"
                value={bodyMDX}
                onChange={(e) => setBodyMDX(e.target.value)}
                placeholder="Write a short intro for this client page…"
              />
            </div>
            <div className="editor-preview">
              <div className="editor-preview__header">Preview</div>
              <div className="c-markdown c-stack">
                <Markdown>{bodyMDX || "Nothing to preview yet."}</Markdown>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <div className="client-status">
              <div className="form-label">Status</div>
              <div className="radioList" role="radiogroup" aria-label="Status">
                <label
                  className={`radioRow ${
                    audience === "ClientSafe" ? "isSelected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="client-page-status"
                    checked={audience === "ClientSafe"}
                    onChange={() => setAudience("ClientSafe")}
                  />
                  <div className="radioText">
                    <div className="radioTitle">Draft</div>
                    <div className="radioDesc">
                      Save internally while you refine the page.
                    </div>
                  </div>
                </label>
                <label
                  className={`radioRow ${
                    audience === "Public" ? "isSelected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="client-page-status"
                    checked={audience === "Public"}
                    onChange={() => setAudience("Public")}
                  />
                  <div className="radioText">
                    <div className="radioTitle">Published</div>
                    <div className="radioDesc">
                      Visible on the public site and in previews.
                    </div>
                  </div>
                </label>
              </div>
            </div>
            <div className="form-actions__buttons">
              <button className="btnPrimary" type="button" onClick={handleSave}>
                {selected ? "Save Changes" : "Create Page"}
              </button>
              {selected ? (
                <Link
                  className="btn"
                  href={`/admin/client-pages/mock/${selected.slug}`}
                >
                  Preview
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
