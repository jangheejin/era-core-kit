// packages/blocks/src/components/ImageFigure.tsx
// REACT COMPONENT FOR IMAGEFIGURE
import React from 'react';

export type ImageFigureProps = {
  src: string;
  alt: string;
  caption?: string;
  aspect?: string; // e.g. '16/9'
  fill?: boolean;
  style?: React.CSSProperties;
};

export function ImageFigure({
  src,
  alt,
  caption,
  aspect = '16/9',
  fill = false,
  style = {},
}: ImageFigureProps) {
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
          objectFit: style.objectFit || 'cover',
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
        objectFit: style.objectFit || 'cover',
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
