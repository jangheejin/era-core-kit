// apps/site/app/admin/case-studies/mock/[slug]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAdminCaseStudies } from '../../../AdminCaseStudyStore';

export default function MockCaseStudyPage() {
  const params = useParams<{ slug: string }>();
  const { items } = useAdminCaseStudies();

  const slug = params?.slug;
  const cs = items.find((i) => i.slug === slug);

  if (!cs) {
    return (
      <main className="c-section">
        <div className="c-container c-stack">
          <h1 className="type-h2">Mock case study not found</h1>
          <p className="type-body type-muted">
            This mock entry only lives in your current browser session. If you refresh or open a new browser, it disappears.
          </p>
          <Link href="/admin/case-studies/list" className="c-link">
            Back to mock database
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="c-section">
      <div className="c-container c-stack">
        <header className="c-stack">
          <p className="type-small type-muted">Mock preview only</p>
          <h1 className="type-hero">{cs.title}</h1>
          <p className="type-body type-muted">{cs.summaryShort}</p>
        </header>

        <section className="c-stack">
          {cs.heroImageUrl && (
            <div className="hero-image-container">
              {/* For demo only – in real CMS we’d use Next/Image */}
              <img
                src={cs.heroImageUrl}
                alt={cs.title}
                style={{ width: '100%', maxHeight: 360, objectFit: 'cover' }}
              />
            </div>
          )}

          {cs.bodyMDX && (
            <article className="type-body">
              {/* For now, treat bodyMDX as plain text. Later this will go
                 through your MDX renderer pipeline. */}
              <p style={{ whiteSpace: 'pre-wrap' }}>{cs.bodyMDX}</p>
            </article>
          )}
        </section>

        <footer className="c-stack" style={{ marginTop: '2rem' }}>
          <Link href="/admin/case-studies/list" className="c-link">
            ← Back to mock database
          </Link>
          <Link href="/admin" className="c-link">
            ← Back to admin home
          </Link>
        </footer>
      </div>
    </main>
  );
}
