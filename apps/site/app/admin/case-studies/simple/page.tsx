// apps/site/app/admin/case-studies/simple/page.tsx
'use client';

import Link from 'next/link';
import { CMSDashboard } from '@kit/blocks';

export default function SimpleCaseStudyPage() {
  return (
    <main className="c-page c-page-admin">
      <div className="c-container c-section c-stack">
        <header className="c-stack c-stack--row c-stack--between c-stack--center">
          <div className="c-stack">
            <p className="type-eyebrow type-muted">Simple mock builder</p>
            <h1 className="type-h1">Quick case study creator</h1>
            <p className="type-body type-muted">
              Super stripped-down mock: title, slug, and body only. Nothing is saved
              outside this browser tab.
            </p>
          </div>

          <Link href="/admin" className="c-button c-button--secondary">
            ← Back to CMS admin
          </Link>
        </header>

        <section className="c-stack">
          {/* This is your original simple creator */}
          <CMSDashboard />
        </section>
      </div>
    </main>
  );
}
