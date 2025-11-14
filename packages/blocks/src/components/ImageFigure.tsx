import React from 'react';

export function ImageFigure({
  src,
  alt,
  caption
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure style={{ textAlign: 'center' }}>
      <img src={src} alt={alt} style={{ maxWidth: '100%' }} />
      {caption && <figcaption style={{ fontSize: '0.875rem', color: '#666' }}>{caption}</figcaption>}
    </figure>
  );
}
