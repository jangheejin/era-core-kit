// apps/site/app/admin/client-pages/page.tsx
"use client";

import "@styles/admin-cms.css";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import {
  SECTOR_GROUPS,
  sectorLabel,
  type SectorValue,
  normalizeTagList,
} from "@kit/schema";
import { AdminTopNav } from "@/admin/components/AdminTopNav";
import { useAdminClientPages } from "@/admin/AdminClientPageStore";
import { Markdown } from "@/components/Markdown";

function applyWrap(
  textarea: HTMLTextAreaElement | null,
  before: string,
  after: string,
) {
  if (!textarea) return;
  const start = textarea.selectionStart ?? 0;
  const end = textarea.selectionEnd ?? 0;
  const text = textarea.value;
  const selected = text.slice(start, end);
  const next = text.slice(0, start) + before + selected + after + text.slice(end);
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
  } = useAdminClientPages();

  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    pages[0]?.slug ?? null,
  );
  const selected = useMemo(
    () => pages.find((p) => p.slug === selectedSlug) ?? null,
    [pages, selectedSlug],
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
          .filter(Boolean),
      ),
    [tags],
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

  function handleSave() {
    const nextTags = normalizeTagList(
      tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    );

    if (selected) {
      const nextSlug = ensureUniqueSlug(desiredSlug || selected.slug, selected.id);
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
      <AdminTopNav />

      <div className="row" style={{ justifyContent: "space-between", marginTop: "1rem" }}>
        <h1 className="type-h2">Client pages</h1>
        <Link href="/admin">Back to admin</Link>
      </div>

      <div className="card mt">
        <div className="row" style={{ justifyContent: "space-between", gap: "1rem" }}>
          <div>
            <p className="muted">
              Create client-facing pages with optional intro text and filters. Use Markdown
              formatting (bold/italic/underline/links) for the intro.
            </p>
            <p className="muted" style={{ marginTop: ".5rem" }}>
              Tip: add or edit case study categories/tags in the Case Study Library, then use the
              “Preview client page” button there to see the filtered public page.
            </p>
          </div>
          <div className="row" style={{ gap: ".5rem" }}>
            <button className="btnSmall" type="button" onClick={resetForm}>
              New page
            </button>
            {selected ? (
              <button
                className="btnSmall"
                type="button"
                onClick={() => {
                  removePage(selected.slug);
                  resetForm();
                }}
              >
                Delete
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="card mt">
        <div className="form-group">
          <label className="form-label">Existing pages</label>
          <select
            className="input"
            value={selectedSlug ?? ""}
            onChange={(e) => loadFrom(e.target.value)}
          >
            <option value="">Select a page…</option>
            {pages.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name} ({p.slug})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card mt">
        <div className="form-group">
          <label className="form-label">Page name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
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
            onChange={(e) => setAudience(e.target.value as "Public" | "ClientSafe")}
          >
            <option value="Public">Public</option>
            <option value="ClientSafe">Client-safe</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Intro text (Markdown)</label>
          <div className="editor">
            <div className="editor__toolbar" role="toolbar" aria-label="Formatting">
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
            {selected ? "Save changes" : "Create page"}
          </button>
          {selected ? (
            <Link className="btn" href={`/admin/client-pages/mock/${selected.slug}`}>
              Preview
            </Link>
          ) : null}
        </div>
      </div>

      {bodyMDX ? (
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
