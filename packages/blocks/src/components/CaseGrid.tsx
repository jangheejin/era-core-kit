'use client';

import { ImageFigure } from './ImageFigure';
import type { CaseGridProps } from '../types';

export function CaseGrid({ items, layout }: CaseGridProps) {
  return (
    <section className="c-section" id="case-studies">
      <div className="c-container">
        <h2 className="type-h2">Our Work</h2>

        <div className="c-grid layout-2x2">
          {items.map((item) => (
            <a
              key={item.slug}
              href={`/case-studies/${item.slug}`}
              className="case-card"
            >
              <div className="case-card__image">
                <ImageFigure
                  src={item.imageUrl}
                  alt={item.title}
                  aspect="4/3"
                />
              </div>

              <div className="case-card__body">
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