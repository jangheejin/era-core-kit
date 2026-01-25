// apps/site/app/admin/client-pages/ClientPageEditor.tsx
"use client";

import "@styles/admin-cms.css";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
  SECTOR_GROUPS,
  sectorLabel,
  type SectorValue,
  normalizeTagList,
} from "@kit/schema";
import {
  useAdminClientPages,
  type ClientPageStatus,
} from "@/admin/AdminClientPageStore";
import { Markdown } from "@/components/Markdown";
import { MiniFormatBar } from "../components/MiniFormatBar";

type Props = {
  slug?: string;
};

export default function ClientPageEditor({ slug }: Props) {
  const router = useRouter();
  const { createPage, upsertPage, removePage, ensureUniqueSlug, getBySlug } =
    useAdminClientPages();

  const [notFound, setNotFound] = useState(false);
  const loadedSlugRef = useRef<string | null>(null);

  const [name, setName] = useState("");
  const [desiredSlug, setDesiredSlug] = useState("");
  const [categoryDrafts, setCategoryDrafts] = useState<Array<SectorValue | "">>(
    [""]
  );
  const [tags, setTags] = useState("");
  const [tagMode, setTagMode] = useState<"any" | "all">("any");
  const [status, setStatus] = useState<ClientPageStatus>("Draft");
  const [bodyMDX, setBodyMDX] = useState("");
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const showSlugField = false;

  const selected = useMemo(
    () => (slug ? (getBySlug(slug) ?? null) : null),
    [getBySlug, slug]
  );

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

  function resetForm() {
    setName("");
    setDesiredSlug("");
    setCategoryDrafts([""]);
    setTags("");
    setTagMode("any");
    setStatus("Draft");
    setBodyMDX("");
  }

  function loadFrom(pageSlug: string) {
    const page = getBySlug(pageSlug);
    if (!page) return false;
    setName(page.name);
    setDesiredSlug(page.slug);
    setCategoryDrafts(
      page.filters.sectors.length ? [...page.filters.sectors] : [""]
    );
    setTags(page.filters.tags.join(", "));
    setTagMode(page.filters.tagMode);
    setStatus(page.status);
    setBodyMDX(page.bodyMDX ?? "");
    return true;
  }

  useEffect(() => {
    if (!slug) {
      if (loadedSlugRef.current !== null) {
        loadedSlugRef.current = null;
        setNotFound(false);
        resetForm();
      }
      return;
    }

    if (loadedSlugRef.current === slug) return;
    const ok = loadFrom(slug);
    loadedSlugRef.current = slug;
    setNotFound(!ok);
  }, [getBySlug, slug]);

  const isDirty = useMemo(() => {
    const nextTags = normalizeTagList(
      tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    );
    const current = JSON.stringify({
      name: name.trim(),
      slug: desiredSlug.trim() || (selected?.slug ?? ""),
      sectors: selectedCategories,
      tags: nextTags,
      tagMode,
      status,
      bodyMDX: bodyMDX.trim(),
    });

    if (!selected) {
      const empty = JSON.stringify({
        name: "",
        slug: "",
        sectors: [],
        tags: [],
        tagMode: "any",
        status: "Draft",
        bodyMDX: "",
      });
      return current !== empty;
    }

    const baseline = JSON.stringify({
      name: selected.name.trim(),
      slug: selected.slug,
      sectors: selected.filters.sectors,
      tags: selected.filters.tags,
      tagMode: selected.filters.tagMode,
      status: selected.status,
      bodyMDX: selected.bodyMDX.trim(),
    });

    return current !== baseline;
  }, [
    name,
    desiredSlug,
    selected,
    selectedCategories,
    tags,
    tagMode,
    status,
    bodyMDX,
  ]);

  function handleSave(nextStatus: ClientPageStatus) {
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
      const nextPage = {
        ...selected,
        name: name.trim() || selected.name,
        slug: nextSlug,
        status: nextStatus,
        bodyMDX,
        filters: {
          ...selected.filters,
          sectors: selectedCategories,
          tags: nextTags,
          tagMode,
        },
        updatedAt: Date.now(),
      };
      upsertPage(nextPage);
      setStatus(nextStatus);
      if (nextSlug !== slug) {
        router.replace(`/admin/client-pages/edit/${nextSlug}`);
      }
      if (nextStatus === "Draft") {
        window.alert(
          "Draft saved. This saves your work but does not publish the collection. Clients can only see published collections."
        );
      }
      return;
    }

    const created = createPage({
      name: name.trim() || "Case Study Collection",
      desiredSlug: desiredSlug || name,
      status: nextStatus,
      filters: {
        sectors: selectedCategories,
        tags: nextTags,
        tagMode,
      },
    });
    upsertPage({ ...created, bodyMDX, updatedAt: Date.now() });
    setStatus(nextStatus);
    router.replace(`/admin/client-pages/edit/${created.slug}`);
    if (nextStatus === "Draft") {
      window.alert(
        "Draft saved. This saves your work but does not publish the collection. Clients can only see published collections."
      );
    }
  }

  if (notFound) {
    return (
      <main className="c-admin">
        <div className="admin-page-header">
          <h1 className="type-h2 admin-page-title">
            Case Study Collection not found
          </h1>
          <div className="admin-page-actions">
            <Link className="btn" href="/admin/client-pages">
              Back to list
            </Link>
          </div>
        </div>
        <div className="card mt">
          <p className="muted">
            The collection you requested doesn&apos;t exist in this
            browser&apos;s demo store.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="c-admin">
      <div className="admin-page-header">
        <h1 className="type-h2 admin-page-title">
          {selected ? "Edit collection" : "Create collection"}
        </h1>
        <div className="admin-page-actions">
          <Link className="btn" href="/admin/client-pages">
            Back to list
          </Link>
          {selected ? (
            <Link
              className="btn"
              href={`/admin/client-pages/mock/${selected.slug}`}
              target="_blank"
            >
              Preview
            </Link>
          ) : null}
        </div>
      </div>

      <div className="card mt">
        <p className="muted" style={{ marginTop: 0 }}>
          Build a focused, client-facing page by choosing categories and tags to
          create a filtered collection of case studies. You can optionally add
          an introduction. These collections are saved, editable, and shareable.
          {/* Client pages combine categories and tags into a tailored, shareable
          page. Add a clear name, an optional intro to orient readers, and set
          the publishing status before saving. */}
        </p>
        <div className="form-group">
          <label className="form-label">Collection name</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p className="muted type-small" style={{ marginTop: 6 }}>
            This is the internal title shown in the Case Study Collections list.
          </p>
        </div>

        {showSlugField ? (
          <div className="form-group">
            <label className="form-label">URL slug</label>
            <input
              className="input"
              value={desiredSlug}
              onChange={(e) => setDesiredSlug(e.target.value)}
              placeholder="collection-slug"
            />
            <p className="muted type-small" style={{ marginTop: 6 }}>
              Used in the URL. Keep it short and readable.
            </p>
          </div>
        ) : null}

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
                  onChange={(e) =>
                    setCategoryAt(idx, e.target.value as SectorValue | "")
                  }
                  aria-label={
                    idx === 0
                      ? "Primary category"
                      : `Additional category ${idx + 1}`
                  }
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
              </div>
            ))}
            <button
              type="button"
              className="btnLink"
              onClick={addCategoryDraft}
            >
              + Add another category
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Tags</label>
          <input
            className="input"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Examples: Health, Infrastructure"
          />
          <p className="muted type-small" style={{ marginTop: 6 }}>
            Use comma-separated tags. These filter case studies by keyword.
          </p>
          {tagChips.length ? (
            <div className="pillRow" style={{ marginTop: 8 }}>
              {tagChips.map((tag) => (
                <span key={tag} className="pill pill--muted">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="form-group">
          <label className="form-label">Tag match mode</label>
          <div className="row">
            <label className="radioLabel">
              <input
                type="radio"
                checked={tagMode === "any"}
                onChange={() => setTagMode("any")}
              />
              Match any tag
            </label>
            <label className="radioLabel">
              <input
                type="radio"
                checked={tagMode === "all"}
                onChange={() => setTagMode("all")}
              />
              Match all tags
            </label>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Intro / context</label>
          <MiniFormatBar
            textareaRef={editorRef}
            value={bodyMDX}
            onValueChange={(next) => setBodyMDX(next)}
          />
          <textarea
            ref={editorRef}
            className="input"
            rows={6}
            value={bodyMDX}
            onChange={(e) => setBodyMDX(e.target.value)}
            placeholder="Optional intro or context for this collection..."
            style={{ marginTop: 6 }}
          />
          <p className="muted type-small" style={{ marginTop: 6 }}>
            This text appears above the filtered case study list.
          </p>
        </div>

        {bodyMDX.trim() ? (
          <div className="card mt">
            <h3 className="type-h4">Preview</h3>
            <div className="case-study-view markdown">
              <Markdown>{bodyMDX}</Markdown>
            </div>
          </div>
        ) : null}

        <div className="row client-page-editor__actionsBar">
          <div className="row client-page-editor__actions">
            {/* <div
          className="row"
          style={{ justifyContent: "space-between", marginTop: "1.5rem" }}
        >
          <div
            className="row"
            style={{ gap: ".75rem", alignItems: "flex-start" }}
          > */}
            <div className="team-editor-actionColumn">
              <button
                className="btnPrimary"
                type="button"
                onClick={() => handleSave("Draft")}
                title="Save your work without publishing. Drafts are not visible to clients."
              >
                Save draft
              </button>
              <span className="muted type-small">
                {isDirty ? "Unsaved changes" : "All changes saved"}
              </span>
            </div>
            <div className="team-editor-actionColumn">
              <button
                className="btnPrimary"
                type="button"
                onClick={() => handleSave("Published")}
                title="Publish this collection so clients can view it."
              >
                Publish
              </button>
              <span
                className={`pill pill--status ${
                  status === "Published" ? "pill--published" : "pill--draft"
                }`}
              >
                {status}
              </span>
            </div>
            {selected ? (
              <div className="team-editor-actionColumn">
                <button
                  className="btn"
                  type="button"
                  onClick={() => {
                    removePage(selected.slug);
                    router.push("/admin/client-pages");
                  }}
                  title="Permanently delete this collection."
                >
                  Delete
                </button>
              </div>
            ) : null}
          </div>
          {/* row */}
        </div>
        {/* row */}
      </div>
    </main>
  );
}
