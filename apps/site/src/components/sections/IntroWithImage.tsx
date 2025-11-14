// apps/site/src/components/sections/IntroWithImage.tsx
'use client';

import type { IntroWithImageProps } from '@/types/layout';
import { ResponsiveImage } from '@kit/blocks';

export function IntroWithImage({ heading, text, imageUrl }: IntroWithImageProps) {
  return (
    <section className="c-section" id="intro">
      <div className="c-container c-grid" style={{ alignItems: 'center' }}>
        <div>
          <h2 className="type-h2">{heading}</h2>
          <p className="type-body">{text}</p>
        </div>
        <div>
          <ResponsiveImage
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
