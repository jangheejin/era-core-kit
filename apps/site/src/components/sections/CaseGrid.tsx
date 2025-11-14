'use client';

import { ResponsiveImage } from '@kit/blocks';
import type { CaseGridProps } from '@/types/layout';

export function CaseGrid({ items }: CaseGridProps) {
  return (
    <section className="c-section" id="case-studies">
      <div className="c-container">
        <h2 className="type-h2">Our Work</h2>

        <div
          className="casegrid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)', // Fixed 2-column layout
            gap: '2rem',
            marginTop: '2rem',
          }}
        >
          {items.map((item) => (
            <a
              key={item.slug}
              href={`/case-studies/${item.slug}`}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                textDecoration: 'none',
                color: 'inherit',
                border: '1px solid var(--gray-300)',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              <div style={{ aspectRatio: '4 / 3', overflow: 'hidden' }}>
                <ResponsiveImage
                  src={item.imageUrl}
                  alt={item.title}
                  aspect="4/3"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div className="card-body" style={{ padding: '1.25rem' }}>
                <h3 className="type-h3" style={{ margin: 0 }}>{item.title}</h3>
                <p className="type-body" style={{ marginTop: '0.5rem' }}>{item.summary}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
