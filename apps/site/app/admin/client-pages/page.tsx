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
  const [sector, setSector] = useState<SectorValue | "">("");
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

  function loadFrom(pageSlug: string) {
    const page = pages.find((p) => p.slug === pageSlug);
    if (!page) return;
    setSelectedSlug(page.slug);
    setName(page.name);
    setDesiredSlug(page.slug);
    setSector(page.filters.sector ?? "");
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
    setSector("");
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
          sector: sector || null,
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
        sector: sector || null,
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
        <Link href="/admin">Back to admin</Link>
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
                      Client pages are curated, custom websites that show a
                      collection of case studies, tailored for a specific
                      audience, plus an optional intro.
                      {/* Client collections are saved, curated filtered pages with
                      an optional intro and shareable URL. */}
                      <br />
                      <br />
                      The Case Study Library filters let you preview a live
                      database view without saving it.
                      <Tooltip.Arrow className="tooltipArrow" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>
            <p className="muted">
              Curated websites built from case study filters for a specific
              audience.
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
          <div
            className="row"
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <h2 className="type-h3" style={{ marginBottom: 0 }}>
              Client Pages Library
            </h2>
          </div>
          <p className="muted type-small" style={{ marginTop: ".5rem" }}>
            This list is your saved client pages. Choose one to edit or start a
            new page.
          </p>
          <div className="form-group">
            <label className="form-label">Database preview path</label>
            <p className="muted type-small">
              In the Case Study Library, set category and tag filters, then
              click “Preview filtered page” to see the live database-filtered
              view with current case studies.
            </p>
          </div>
          <div className="c-stack mt">
            {pages.length ? (
              pages.map((page) => {
                const pageTags = normalizeTagList(page.filters.tags ?? []);
                return (
                  <section key={page.slug} className="card card-new">
                    <div
                      className="row"
                      style={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "1rem",
                      }}
                    >
                      <div className="c-stack" style={{ gap: ".35rem" }}>
                        <div
                          className="row"
                          style={{ gap: ".5rem", alignItems: "center" }}
                        >
                          <span className="type-h3" style={{ margin: 0 }}>
                            {page.name}
                          </span>
                          <span className="pill pill--status">
                            {page.filters.audience === "Public"
                              ? "Public"
                              : "Client-safe"}
                          </span>
                        </div>
                        <span className="muted type-small">/{page.slug}</span>
                        <span className="muted type-small">
                          Category:{" "}
                          {page.filters.sector
                            ? sectorLabel(page.filters.sector)
                            : "All categories"}
                        </span>
                        <span className="muted type-small">
                          Tag mode:{" "}
                          {page.filters.tagMode === "all"
                            ? "Match all tags"
                            : "Match any tag"}
                        </span>
                        {pageTags.length ? (
                          <div className="client-links">
                            {pageTags.map((tag) => (
                              <span key={tag} className="chip chip--soft">
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="muted type-small">
                            Tags: none
                          </span>
                        )}
                      </div>
                      <div className="row" style={{ gap: ".5rem" }}>
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
          <div className="form-group">
            <label className="form-label">Page name</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">URL slug</label>
            <input
              className="input"
              value={desiredSlug}
              onChange={(e) => setDesiredSlug(e.target.value)}
              placeholder="client-page-slug"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category filter</label>
            <select
              className="input"
              value={sector}
              onChange={(e) => setSector(e.target.value as SectorValue | "")}
            >
              <option value="">No category filter</option>
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
          </div>

          <div className="form-group">
            <label className="form-label">Tags filter</label>
            <input
              className="input"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Earmark, Pilot Program"
            />
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
            <label className="form-label">Tag mode</label>
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
            <label className="form-label">Audience</label>
            <select
              className="input"
              value={audience}
              onChange={(e) =>
                setAudience(e.target.value as "Public" | "ClientSafe")
              }
            >
              <option value="Public">Public</option>
              <option value="ClientSafe">Client-safe</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Intro text (Markdown)</label>
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
          </div>

          <div className="form-actions">
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
      )}

      {isEditing && bodyMDX ? (
        <div className="card mt">
          <h2 className="type-h3">Preview</h2>
          <div className="c-markdown c-stack">
            <Markdown>{bodyMDX}</Markdown>
          </div>
        </div>
      ) : null}
    </main>
  );
}
