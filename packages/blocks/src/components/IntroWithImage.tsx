// packages/blocks/src/components/IntroWithImage.tsx
// REACT COMPONENT FOR INTROWITHIMAGE
//'use client';

// This is actually the mission section but renaming the actual components caused havoc

import '@styles/intro.css'
import type { IntroWithImageProps } from '../types';
import { ImageFigure } from './ImageFigure';
import { ClientAnimations } from './ClientAnimations';

export function IntroWithImage({ heading, text, text2, imageUrl }: IntroWithImageProps) {
  return (
    <section className="c-section" id="intro">
      {/* <div className="c-container c-grid" style={{ alignItems: 'center' }}> */}
      <div className="c-container intro-grid">
        <div className="intro-copy">
          <h2 className="type-h2">{heading}</h2>
          <ClientAnimations />
          {text && <p className="type-body intro-lead">{text}</p>}
          {text2 && <p className="type-body intro-body">{text2}</p>}
        </div>
        {/* <div className="intro-image"> */}
{/*           <ImageFigure
            src={imageUrl}
            alt={heading}
            aspect="4/3"
            style={{ objectFit: 'cover' }}
          /> */}
          {/* <img src={imageUrl} alt={heading} className="intro-image"/>
        </div> */}
        {imageUrl && (
          <div className="intro-image">
            <img src={imageUrl} alt={heading} />
          </div>
        )}
      </div>
    </section>
  );
}
