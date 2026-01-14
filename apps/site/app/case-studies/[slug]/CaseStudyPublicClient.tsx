//apps/site/app/case-studies/[slug]/CaseStudyPublicClient.tsx

"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useAdminCaseStudies } from "../../admin/AdminCaseStudyStore";

function displayTitle(cs: { client?: string; title?: string; slug: string }) {
  return (cs.client && cs.client.trim())
    || (cs.title && cs.title.trim())
    || cs.slug;
}

export default function CaseStudySinglePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const { getBySlug } = useAdminCaseStudies();
  const cs = useMemo(() => getBySlug(slug), [getBySlug, slug]);

  if (!cs || !cs.isPublic) {
    return (
      <main className="c-page">
        <div className="c-container c-stack">
          <h1 className="type-h2">Not found</h1>
          <p className="muted">
            In demo mode, this case study only exists if it was created in this browser’s CMS data.
          </p>
          <Link href="/case-studies">Back to list</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="c-page case-study">
      <div className="c-container c-stack">
        <Link href="/case-studies" className="muted">
          ← Back to Case Studies
        </Link>

        <h1 className="type-h2">{displayTitle(cs)}</h1>

        {cs.heroImageUrl ? (
          <img className="case-study__hero" src={cs.heroImageUrl} alt="" />
        ) : null}

        {cs.summaryShort ? <p className="muted">{cs.summaryShort}</p> : null}

        {cs.bodyMDX ? (
          <article style={{ whiteSpace: "pre-wrap" }}>
            {cs.bodyMDX}
          </article>
        ) : null}

        {cs.sections?.length ? (
          <section className="c-stack">
            {cs.sections.map((s) => (
              <section key={s.id} className="c-stack">
                <h2 className="type-h3">{s.title}</h2>
                {s.bodyMDX ? (
                  <div style={{ whiteSpace: "pre-wrap" }}>{s.bodyMDX}</div>
                ) : null}
              </section>
            ))}
          </section>
        ) : null}
      </div>
    </main>
  );
}
