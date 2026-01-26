//apps/site/app/case-studies/page.tsx
//integrating demo backend database with public-facing site
"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useMemo } from "react";
import { useAdminCaseStudies } from "../admin/AdminCaseStudyStore";

function displayTitle(cs: { client?: string; title?: string; slug: string }) {
  return (cs.client && cs.client.trim())
    || (cs.title && cs.title.trim())
    || cs.slug;
}

export default function CaseStudiesIndexPage() {
  const { items } = useAdminCaseStudies();

  const publicItems = useMemo(
    () => items.filter((cs) => cs.isPublic),
    [items],
  );

  return (
    <main className="c-page">
      <div className="c-container c-stack">
        <h1 className="type-h2">Case Studies</h1>
        <p className="muted">
          Demo mode: these entries are stored in this browser (localStorage).
        </p>

        <div className="case-grid">
          {publicItems.map((cs) => (
            <article key={cs.slug} className="card case-study-card">
              <Link href={`/case-studies/${cs.slug}`} className="case-study-card__link">
                {cs.heroImageUrl ? (
                  <img
                    className="case-study-card__img"
                    src={cs.heroImageUrl}
                    alt=""
                    loading="lazy"
                  />
                ) : null}

                <h2 className="type-h3">{displayTitle(cs)}</h2>
                <p className="muted">
                  {cs.brief?.trim()
                    || cs.summaryShort?.trim()
                    || ""}
                </p>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
