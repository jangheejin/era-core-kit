// packages/blocks/src/cms/CMSDashboard.tsx
'use client';

import Link from 'next/link';

export function CMSDashboard() {
  return (
    <section className="c-stack">
      <h2 className="type-h2">CMS dashboard (mock)</h2>
      <p className="type-body type-muted">
        This is a demo admin view. Users can create a new case study using the
        full schema-aware builder, or browse the current mock library.
      </p>
      <div className="buttonRow">
        <div className="c-stack c-stack--row c-stack--gap">
          <Link href="/admin/case-studies/new" className="buttonLink-2">
            Create new case study
          </Link>
        </div>
        <div className="c-stack c-stack--row c-stack--gap">
          <Link href="/admin/case-studies/list" className="buttonLink-2">
            View case study list
          </Link>
        </div>
      </div>
    </section>
  );
}
