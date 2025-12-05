// apps/site/app/admin/case-studies/list/page.tsx
// "database" view of case studies

"use client";

import Link from "next/link";
import { useAdminCaseStudies } from "../../AdminCaseStudyStore";

export default function CaseStudyListPage() {
  const { items } = useAdminCaseStudies();

  return (
    <main className="c-section">
      <div className="mb-4">
        <Link href="/admin" className="c-button c-button--secondary">
          ← Back to dashboard
        </Link>
      </div>

      <div className="c-container c-stack">
        <h1 className="type-h2">Mock Case Study Database</h1>
        <p className="type-body type-muted">
          These entries are stored locally in this browser (localStorage). They
          are not synced to a backend.
        </p>

        {items.length === 0 ? (
          <p className="type-body type-muted">
            No mock case studies yet.{" "}
            <Link href="/admin/case-studies/new" className="c-link">
              Create one now
            </Link>
            .
          </p>
        ) : (
          <div className="c-stack">
            {items.map((cs) => (
              <div key={cs.slug} className="card">
                <div className="card-body c-stack">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="type-h3">{cs.title}</h2>
                      <p className="type-small type-muted">
                        /admin/case-studies/mock/{cs.slug}
                      </p>
                      <p className="type-small type-muted">
                        <strong>Status:</strong> {cs.status}{" "}
                        <strong style={{ marginLeft: 12 }}>Visibility:</strong>{" "}
                        {cs.visibility}
                      </p>
                    </div>

                    <Link
                      href={`/admin/case-studies/mock/${cs.slug}`}
                      className="c-button"
                    >
                      View page
                    </Link>
                  </div>

                  <p className="type-body type-muted">{cs.summaryShort}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
