// apps/site/app/client-pages/[slug]/ClientPagePublicClient.tsx

// Public route to show a client page's filtered case studies
"use client";

import Link from "next/link";
import { useMemo } from "react";

import { normalizeTagList, tagSlug, type CaseStudyType } from "@kit/schema";
import { useAdminCaseStudies } from "../../admin/AdminCaseStudyStore";
import { useAdminClientPages } from "../../admin/AdminClientPageStore";

function matchesClientPage(cs: CaseStudyType, page: { filters: any }) {
  const { sector, tags, tagMode, audience } = page.filters;

  if (cs.status !== "Published") return false;
  if (audience === "Public") {
    if (cs.visibility !== "Public") return false;
  } else {
    if (cs.visibility !== "Public" && cs.visibility !== "ClientSafe") return false;
  }

  if (sector && !(cs.sectors ?? []).includes(sector)) return false;

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

export default function ClientPagePublicClient({ slug }: { slug: string }) {
  const { items } = useAdminCaseStudies();
  const { getBySlug } = useAdminClientPages();

  const page = getBySlug(slug);

  const filtered = useMemo(() => {
    if (!page) return [];
    return items.filter((cs) => matchesClientPage(cs, page));
  }, [items, page]);

  if (!page) {
    return (
      <main className="c-page">
        <div className="c-container c-stack">
          <h1 className="type-h2">Client page not found</h1>
          <p className="muted">
            No client page exists with slug: <code>{slug}</code>
          </p>
          <Link href="/admin/client-pages">Go to admin</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="c-page">
      <div className="c-container c-stack">
        <h1 className="type-h2">{page.name}</h1>
        <p className="muted">
          Showing <strong>{filtered.length}</strong> case studies.
        </p>

        <div className="case-grid">
          {filtered.map((cs) => (
            <article key={cs.slug} className="card case-study-card">
              <Link href={`/case-studies/${cs.slug}`} className="case-study-card__link">
                {cs.heroImageUrl && (
                  <img src={cs.heroImageUrl} alt="" loading="lazy" />
                )}
                <h2 className="type-h3">{cs.client || cs.title || cs.slug}</h2>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
