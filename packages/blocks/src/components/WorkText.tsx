// apps/site/src/components/sections/WorkText.tsx
// REACT COMPONENT FOR WORKTEXT
//'use client';

import { ImageFigure } from './ImageFigure';
import type { WorkTextProps } from '../types';
import { ClientAnimations } from './ClientAnimations';

export function WorkText({ heading, text, }: WorkTextProps) {
  return (
    <section className="c-section" id="work">
      <div className="c-container">
      <h2 className="type-h2">{heading}</h2>
      <ClientAnimations />
      <p className="type-body">{text}</p>
      </div>
    </section>
  );
}