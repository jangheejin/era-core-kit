// apps/site/app/tag/TagPageClient.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { tagSlug, type CaseStudyType } from "@kit/schema";
import { useAdminCaseStudies } from "../admin/AdminCaseStudyStore";

function matchesTag(cs: CaseStudyType, tagParamSlug: string) {
  return (cs.tags ?? []).some((t) => tagSlug(t) === tagParamSlug);
}

export function TagPageClient({ tagSlugParam }: { tagSlugParam: string }) {
  const { items } = useAdminCaseStudies();
  const wanted = tagSlug(tagSlugParam);

  const filtered = useMemo(() => {
    const publicItems = items.filter(
      (cs) => cs.isPublic && cs.status === "Published",
    );
    return publicItems.filter((cs) => matchesTag(cs, tagSlugParam));
  }, [items, tagSlugParam]);

  const displayTag =
    filtered
      .flatMap((cs) => cs.tags ?? [])
      .find((t) => tagSlug(t) === wanted) ?? wanted;

  return (
    <main className="c-page">
      <div className="c-container c-stack">
        <h1 className="type-h2">Tag: {displayTag}</h1>

        {filtered.length === 0 ? (
          <p className="muted">No case studies in this tag yet.</p>
        ) : (
          filtered.map((cs) => (
            <article key={cs.slug} className="card">
              <h2 className="type-h3">{cs.title}</h2>
              <p className="muted">{cs.summaryShort}</p>
              <Link href={`/case-studies/${cs.slug}`}>View case study</Link>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
