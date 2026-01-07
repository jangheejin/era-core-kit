//apps/site/src/components/CaseStudyCard.tsx
import Link from "next/link";
import type { CaseStudyType } from "@kit/schema";

type CaseStudyCardData = Pick<
  CaseStudyType,
  "slug" | "title" | "client" | "summaryShort" | "sectors"
>;

export function CaseStudyCard({
  cs,
  hrefBase = "/case-studies",
}: {
  cs: CaseStudyCardData;
  hrefBase?: string; // "/admin/case-studies/mock" for admin, "/case-studies" for public
}) {
  return (
    <article className="card case-study-card">
      <h3 className="type-h3">
        <Link href={`${hrefBase}/${cs.slug}`}>{cs.title}</Link>
      </h3>

      {cs.client && (
        <p className="muted">
          <strong>Client:</strong> {cs.client}
        </p>
      )}

      <p>{cs.summaryShort}</p>

      {cs.sectors?.length ? (
        <div className="tags">
          {cs.sectors.map((s) => (
            <span key={s} className="tag">
              {s}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
