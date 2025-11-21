// apps/site/src/cms/CaseStudyTable.tsx
'use client';

import type { CaseStudy } from '@kit/schema';

type Props = {
  items: CaseStudy[];
};

export function CaseStudyTable({ items }: Props) {
  if (!items.length) {
    return <p className="type-body">No case studies yet.</p>;
  }

  return (
    <section className="c-section">
      <div className="c-container c-stack">
        <div className="cms-table-header">
          <h1 className="type-h2">Case Studies</h1>
          <span className="type-label">{items.length} total</span>
        </div>

        <div className="cms-table-wrapper">
          <table className="cms-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Client</th>
                <th>Sector</th>
                <th>Year</th>
                <th>Featured</th>
                <th>Public</th>
              </tr>
            </thead>
            <tbody>
              {items.map((cs) => (
                <tr key={cs.id}>
                  <td>{cs.title}</td>
                  <td>{cs.client ?? '—'}</td>
                  <td>{cs.sector}</td>
                  <td>{cs.year ?? '—'}</td>
                  <td>{cs.isFeaturedHome ? 'Yes' : 'No'}</td>
                  <td>{cs.isPublic ? 'Public' : 'Internal'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
