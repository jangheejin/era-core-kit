// apps/site/app/client-pages/[slug]/ClientPagePublicClient.tsx

// Public route to show a client page's filtered case studies
"use client";

import Link from "next/link";
import { useMemo } from "react";

import { normalizeTagList, tagSlug, type CaseStudyType } from "@kit/schema";
import { useAdminCaseStudies } from "../../admin/AdminCaseStudyStore";
import { useAdminClientPages, type ClientPage } from "../../admin/AdminClientPageStore";
import { Markdown } from "@/components/Markdown";

import { useSearchParams } from "next/navigation";

function matchesClientPage(cs: CaseStudyType, page: ClientPage) {
  const { sectors, tags, tagMode } = page.filters;

  if (page.status !== "Published") return false;
  if (cs.status !== "Published") return false;
  if (!cs.isPublic) return false;
  if (cs.visibility !== "Public") return false;

  if (Array.isArray(sectors) && sectors.length) {
    const csSectors = cs.sectors ?? [];
    if (!sectors.some((sector) => csSectors.includes(sector))) return false;
  }

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

  const searchParams = useSearchParams();
  const backParam = searchParams.get("back") ?? "";
  const backLabelParam = (searchParams.get("backLabel") ?? "").trim();
  const safeBack = backParam.startsWith("/") ? backParam : "";
  const carryBackLabel = backLabelParam || "Back to database";
  const backLabel = carryBackLabel.startsWith("←") ? carryBackLabel : `← ${carryBackLabel}`;
  const carryQuery = safeBack
    ? `?back=${encodeURIComponent(safeBack)}&backLabel=${encodeURIComponent(carryBackLabel)}`
    : "";

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

  if (page.status !== "Published") {
    return (
      <main className="c-page">
        <div className="c-container c-stack">
          {safeBack ? (
            <Link href={safeBack} className="muted">
              {backLabel}
            </Link>
          ) : null}
          <h1 className="type-h2">{page.name}</h1>
          <p className="muted">
            This client page is saved as a draft and is not yet published.
          </p>
          <Link href="/admin/client-pages">Go to admin</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="c-page">
      <div className="c-container c-stack">
        {safeBack ? ( 
          <Link href={safeBack} className="muted">
            {backLabel}
          </Link>
        ) : null}

        <h1 className="type-h2">{page.name}</h1>
        {page.bodyMDX ? (
          <div className="c-markdown c-stack">
            <Markdown>{page.bodyMDX}</Markdown>
          </div>
        ) : null}
        <p className="muted">
          Showing <strong>{filtered.length}</strong> case studies.
        </p>

        {/* <div className="case-grid"> */}
        <div className={
          filtered.length <= 2
            ? "case-grid case-grid--cards case-grid--center"
            : "case-grid case-grid--cards"
          }
        >
          {filtered.map((cs) => (
            <article key={cs.slug} className="card case-study-card">
              {/* <Link href={`/case-studies/${cs.slug}`} className="case-study-card__link"> */}
              <Link href={`/case-studies/${cs.slug}${carryQuery}`}
                className="case-study-card__link"
              >                  
              {/* <img src={cs.heroImageUrl} alt="" loading="lazy" /> */}
                {cs.heroImageUrl && (
                  <img className="case-study-card__img"
                    src={cs.heroImageUrl}
                    alt=""
                    loading="lazy"
                  />
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
