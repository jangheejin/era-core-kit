// apps/site/src/components/sections/IntroWithImage.tsx
// REACT COMPONENT FOR INTROWITHIMAGE
'use client';

import type { IntroWithImageProps } from '../types';
import { ImageFigure } from './ImageFigure';

export function IntroWithImage({ heading, text, imageUrl }: IntroWithImageProps) {
  return (
    <section className="c-section" id="intro">
      <div className="c-container c-grid" style={{ alignItems: 'center' }}>
        <div>
          <h2 className="type-h2">{heading}</h2>
          <p className="type-body">{text}</p>
          <p className="type-body">Our mission is to develop and maintain a close relationship our clients, which means understanding their mission needs and objectives, and to jointly develop a targeted and pragmatic strategy to achieve them.</p>
        </div>
        <div>
          <ImageFigure
            src={imageUrl}
            alt={heading}
            aspect="4/3"
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
    </section>
  );
}
