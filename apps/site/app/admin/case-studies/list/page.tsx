// apps/site/app/admin/case-studies/list/page.tsx
// "database" view of case studies
'use client';

import Link from 'next/link';
import { useAdminCaseStudies } from '../../AdminCaseStudyStore';

export default function CaseStudyListPage() {
  const { items } = useAdminCaseStudies();

  return (
    <main className="c-section">
      <div className="c-container c-stack">
        <h1 className="type-h2">Mock Case Study Database</h1>
        <p className="type-body type-muted">
          These entries exist only in your current browser session and are not stored anywhere permanent.
        </p>

        {items.length === 0 ? (
          <p className="type-body type-muted">
            No mock case studies yet.{' '}
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
