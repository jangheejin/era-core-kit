// packages/blocks/src/components/ImageFigure.tsx
// REACT COMPONENT FOR IMAGEFIGURE
import React from 'react';

//Import the base data model type from the single source of truth to avoid TS2308 collision.
import type { ImageFigureProps as BaseImageFigureProps } from '../types';
/*export type ImageFigureProps = {
  src: string;
  alt: string;
  caption?: string;
  aspect?: string; // e.g. '16/9'
  fill?: boolean;
  style?: React.CSSProperties;
};*/

// Define the component-specific presentation props locally using an interface.
// These are props the data layer does not care about (e.g., styling/layout).
interface ComponentProps {
  aspect?: string; // e.g. '16/9'
  fill?: boolean;
//  style?: React.CSSProperties;
  className?: string; 
}

// Combine the base data model props with the local component props.
// This creates the final, complete props type, but critically, we DO NOT export it.
type ImageFigureComponentProps = BaseImageFigureProps & ComponentProps;


export function ImageFigure({
  src,
  alt,
  caption,
  aspect = '16/9',
  fill = false,
  style = {},
  className = '',
}: ImageFigureComponentProps) {// Use the internal, combined type

  const [w, h] = aspect.split('/').map(Number);
  const validW = w || 16;
  const validH = h || 9;

  // CALCULATED STYLE: This is the ONLY style that must remain inline. 
  // It provides the aspect ratio and must be dynamically calculated at runtime.
  const dynamicWrapperStyle: React.CSSProperties = { 
    paddingBottom: `${(validH / validW) * 100}%` 
  };

  //const paddingBottom = `${(validH / validW) * 100}%`;

  const image = fill ? (
    // Semantic class for the wrapper (sets structural CSS: relative, width: 100%)
    // Later the wrapper will use Tailwind classes for position and size, plus the dynamic style object
    <div 
      className="ImageFigure__fill-container" 
      style={dynamicWrapperStyle}
    >
      <img
        src={src}
        alt={alt}
        // Semantic class for the image (sets structural CSS: absolute, inset-0, object-cover)
        // Tailwind class will go here later
        className="ImageFigure__fill-image"
        style={style} // Apply user's style prop for CSS overrides
      />
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      // Semantic class for the standard image (sets structural CSS: w-full, object-cover)
      // Tailwind class will go here later
      className="ImageFigure__standard-image"
      style={style} // Apply user's style prop for CSS overrides
    />
  );

  return caption ? (
    // Apply external className to the figure element
    <figure className={`ImageFigure ${className}`}>
      {image}
      <figcaption>{caption}</figcaption>
    </figure>
  ) : (
    // Apply external className to the wrapper div
    <div className={`ImageFigure ${className}`}>
      {image}
    </div>
  );
}
