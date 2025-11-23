// packages/blocks/src/components/CaseGrid.tsx
// REACT COMPONENT FOR CASEGRID
//'use client';
import '@styles/casegrid.css'
import { ImageFigure } from './ImageFigure';
import type { CaseGridProps } from '../types';
//import { ClientAnimations } from './ClientAnimations';

export function CaseGrid({ items, layout }: CaseGridProps) {
  return (
    <section id="case-studies">
    {/* <section className="c-section" id="case-studies"> */}
      {/* <div className="c-container"> */}
        {/* <h2 className="type-h2">Our Work</h2> */}

        <div className="casegrid layout-2x2" id="case-studies">
          {items.map((item) => (
            <a
              key={item.slug}
              href={`/case-studies/${item.slug}`}
              className="case-card"
            >
              <div className="case-card__image">
                <ImageFigure
                  src={item.imageUrl}
                  alt={item.client}
                  aspect="4/3"
                />
              </div>

              <div className="case-card__body">
                <h3 className="card-h3">{item.sector}</h3>
                <h2 className="card-h2">{item.client}</h2>
                {item.summary && (
                  <p className="type-body case-card__summary">{item.summary}</p>
                )}
              </div>
            </a>
          ))}
        </div>
      {/* </div> */}
    </section>
  );
}