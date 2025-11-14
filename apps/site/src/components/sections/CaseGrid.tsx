// apps/site/src/components/sections/CaseGrid.tsx
'use client';

import { ResponsiveImage } from '@kit/blocks';
import type { CaseGridProps } from '@/types/layout';

export function CaseGrid({ items }: CaseGridProps) {
  return (
    <section className="c-section" id="case-studies">
      <div className="c-container">
        <h2 className="type-h2">Our Work</h2>
        <div
          className="c-grid"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginTop: '2rem',
          }}
        >
          {items.map((item) => (
            <a
              key={item.slug}
              href={`/case-studies/${item.slug}`}
              className="card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="card-media">
                <ResponsiveImage
                  src={item.imageUrl}
                  alt={item.title}
                  aspect="1/1" // square aspect ratio
                  style={{ borderBottom: '1px solid var(--gray-200)' }}
                />
              </div>
              <div className="card-body">
                <h3 className="type-h3">{item.title}</h3>
                <p className="type-body">{item.summary}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
