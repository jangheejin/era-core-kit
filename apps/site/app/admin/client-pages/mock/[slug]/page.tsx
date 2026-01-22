// apps/site/app/admin/client-pages/mock/[slug]/page.tsx

// Admin preview route to view a client page's filtered case studies
"use client";

import "@styles/admin-cms.css";

import Link from "next/link";
import { useMemo } from "react";

import { normalizeTagList, tagSlug, type CaseStudyType, type SectorValue } from "@kit/schema";
import { Markdown } from "@/components/Markdown";

import { useAdminCaseStudies } from "@/admin/AdminCaseStudyStore";
import { useAdminClientPages } from "@/admin/AdminClientPageStore";

type ClientPageFilterPreview = {
  sectors?: SectorValue[];
  tags?: string[];
  tagMode?: "any" | "all";
};

function matchesClientPage(cs: CaseStudyType, page: { filters: ClientPageFilterPreview }) {
  const { sectors, tags, tagMode } = page.filters;

  // public-only gating
  if (cs.status !== "Published") return false;
  if (!cs.isPublic) return false;
  if (cs.visibility !== "Public") return false;

  // sector filter
  if (Array.isArray(sectors) && sectors.length) {
    const csSectors = cs.sectors ?? [];
    if (!sectors.some((sector) => csSectors.includes(sector))) return false;
  }

  // tag filter
  const wanted = (tags ?? []).map(tagSlug).filter(Boolean);
  if (wanted.length) {
    const have = new Set(normalizeTagList(cs.tags ?? []).map(tagSlug));
    const ok =
      tagMode === "all"
        ? wanted.every((t: string) => have.has(t))
        : wanted.some((t: string) => have.has(t));
    if (!ok) return false;
  }

  return true;
}

export default function AdminClientPageMock({
  params,
}: {
  params: { slug: string };
}) {
  const { items } = useAdminCaseStudies();
  const { getBySlug } = useAdminClientPages();

  const page = getBySlug(params.slug);

  const filtered = useMemo(() => {
    if (!page) return [];
    return items.filter((cs) => matchesClientPage(cs, page));
  }, [items, page]);

  return (
    <main className="c-admin">
      <div className="row" style={{ justifyContent: "space-between", marginTop: "1rem" }}>
        <h1 className="type-h2">Client page preview</h1>
        <div className="row">
          <Link href="/admin/client-pages">Back to client pages</Link>
          {page ? (
            <Link href={`/client-pages/${page.slug}`} target="_blank">
              Open public URL
            </Link>
          ) : null}
        </div>
      </div>

      {!page ? (
        <div className="card" style={{ marginTop: "1rem" }}>
          <h2 className="type-h3">Not found</h2>
          <p className="muted">No client page exists with slug: <code>{params.slug}</code></p>
        </div>
      ) : (
        <>
          <div className="card" style={{ marginTop: "1rem" }}>
            <h2 className="type-h3">{page.name}</h2>
            {page.bodyMDX ? (
              <div className="c-markdown c-stack">
                <Markdown>{page.bodyMDX}</Markdown>
              </div>
            ) : null}
            <p className="muted">
              Showing <strong>{filtered.length}</strong> case studies (Published + public).
            </p>
          </div>

          {/* <div className="case-grid" style={{ marginTop: "1rem" }}> */}
          <div className="case-grid mt">
            {filtered.map((cs) => (
              <article key={cs.slug} className="card case-study-card">
                <Link href={`/case-studies/${cs.slug}`} className="case-study-card__link">
                  {cs.heroImageUrl ? (
                    <img className="case-study-card__img" src={cs.heroImageUrl} alt="" loading="lazy" />
                  ) : null}
                  <h2 className="type-h3">{cs.client?.trim() || cs.title?.trim() || cs.slug}</h2>
                  <p className="muted">{cs.brief?.trim() || cs.summaryShort?.trim() || ""}</p>
                </Link>
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
