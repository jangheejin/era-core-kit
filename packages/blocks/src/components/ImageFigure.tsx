// packages/blocks/src/components/ImageFigure.tsx
// REACT COMPONENT FOR IMAGEFIGURE

import React from 'react';

// Use the base data model type from the shared types file.
// This avoids duplicating `ImageFigureProps` and triggering TS2308.
import type { ImageFigureProps as BaseImageFigureProps } from '../types';

// Add any *extra* component-only props here (style, etc.)
// We DO NOT export this type – it's internal to the component.
type ImageFigureComponentProps = BaseImageFigureProps & {
  style?: React.CSSProperties;
};

export function ImageFigure({
  src,
  alt,
  caption,
  aspect = '16/9',
  fill = false,
  style = {},
}: ImageFigureComponentProps) {
  const [w, h] = aspect.split('/').map(Number);
  const validW = w || 16;
  const validH = h || 9;
  const paddingBottom = `${(validH / validW) * 100}%`;

  const image = fill ? (
    <div style={{ position: 'relative', width: '100%', paddingBottom }}>
      <img
        src={src}
        alt={alt}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: (style as any).objectFit || 'cover',
          ...style,
        }}
      />
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      style={{
        width: '100%',
        height: 'auto',
        objectFit: (style as any).objectFit || 'cover',
        ...style,
      }}
    />
  );

  return caption ? (
    <figure className="imagefigure">
      {image}
      <figcaption>{caption}</figcaption>
    </figure>
  ) : (
    image
  );
}
