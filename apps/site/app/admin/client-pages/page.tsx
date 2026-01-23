// apps/site/app/admin/client-pages/page.tsx
"use client";

import "@styles/admin-cms.css";
import Link from "next/link";
import * as Tooltip from "@radix-ui/react-tooltip";
import { sectorLabel, normalizeTagList } from "@kit/schema";
import { useAdminClientPages } from "@/admin/AdminClientPageStore";

export default function AdminClientPages() {
  const { pages, removePage, resetPages } = useAdminClientPages();

  return (
    <main className="c-admin">
      <div className="admin-page-header">
        <h1 className="type-h2 admin-page-title">Client Page Library</h1>
        <div className="admin-page-actions">
          <Link className="btnPrimary" href="/admin/client-pages/new">
            New client page
          </Link>
        </div>
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
                      Client pages are curated collections of case studies for a
                      specific audience, with optional intro text and a
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
              tags, adding a short intro, and setting a publishing status. These
              pages are saved, editable, and shareable.
            </p>
          </div>
        </div>
      </div>

      <div className="card mt">
        <div className="dbResultsHeader">
          <div className="dbResultsHeader__sort">
            <span className="muted type-small">
              <b>Library View</b>: This list contains your saved client pages.
              Choose one to edit or start a new page.
            </span>
          </div>
          <p className="muted dbResultsHeader__count">
            Showing {pages.length} / {pages.length}
          </p>
        </div>
        {/* <p className="muted type-small" style={{ marginTop: ".5rem" }}>
          This list contains your saved client pages. Choose one to edit or start a
          new page.
        </p> */}
        <div className="dbListGrid">
          {pages.length ? (
            pages.map((page) => {
              const hasIntro = Boolean(page.bodyMDX?.trim());
              const tagsList = normalizeTagList(page.filters.tags);
              const categories = page.filters.sectors;
              const primaryCategory = categories[0];
              const secondaryCategories = categories.slice(1);
              const isPublished = page.filters.audience === "Public";
              return (
                <section key={page.slug} className="card dbItem">
                  <div className="dbItemHeader">
                    <div className="dbItemMain">
                      <div className="dbItemClient">{page.name}</div>
                      <div className="dbItemTitle">/{page.slug}</div>
                    </div>
                    <div className="dbActions">
                      <Link
                        className="btnSmall"
                        href={`/admin/client-pages/mock/${page.slug}`}
                        target="_blank"
                      >
                        Preview
                      </Link>
                      <Link
                        className="btnSmall"
                        href={`/admin/client-pages/edit/${page.slug}`}
                      >
                        Edit
                      </Link>
                      <button
                        className="btnSmall"
                        type="button"
                        onClick={() => removePage(page.slug)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="dbSummary">
                    {hasIntro
                      ? "Intro text added."
                      : "No intro text yet — add one to orient readers."}
                  </div>
                  <div className="dbProps">
                    <div className="dbProp">
                      <div className="dbPropLabel">Categories</div>
                      <div className="dbPillStack">
                        {categories.length === 0 ? (
                          <div className="dbPillRow">
                            <span className="pill pill--muted">
                              No categories
                            </span>
                          </div>
                        ) : (
                          <>
                            {primaryCategory ? (
                              <div className="dbPillRow">
                                <span className="pill pill--cat pill--primary">
                                  {sectorLabel(primaryCategory)}
                                </span>
                              </div>
                            ) : null}
                            {secondaryCategories.length > 0 && (
                              <div className="dbPillRow dbPillRow--secondary">
                                {secondaryCategories.map((sector) => (
                                  <span
                                    key={sector}
                                    className="pill pill--cat pill--secondary"
                                  >
                                    {sectorLabel(sector)}
                                  </span>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="dbProp">
                      <div className="dbPropLabel">Tags</div>
                      <div className="dbPillRow">
                        {tagsList.length ? (
                          tagsList.map((tag) => (
                            <span key={tag} className="pill pill--muted">
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="pill pill--muted">No tags</span>
                        )}
                      </div>
                    </div>
                    <div className="dbProp">
                      <div className="dbPropLabel">Publishing Status</div>
                      <div className="dbPillRow">
                        <span
                          className={`pill pill--status ${
                            isPublished ? "pill--published" : "pill--draft"
                          }`}
                        >
                          {isPublished ? "Published" : "Draft"}
                        </span>
                        {/*                         <span className="pill pill--muted">
                          {page.filters.audience === "Public"
                            ? "Public"
                            : "Client safe"}
                        </span> */}
                      </div>
                    </div>
                  </div>
                  <div className="dbProps dbProps--inline">
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
    </main>
  );
}
