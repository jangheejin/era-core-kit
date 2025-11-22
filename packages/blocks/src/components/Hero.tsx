// packages/blocks/src/components/Hero.tsx
// SERVER COMPONENT
//'use client';

import '@styles/hero.css';
import { ImageFigure } from './ImageFigure';
import type { HeroProps } from '../types';
import { ClientAnimations } from './ClientAnimations';

//export function Hero({ heading, text, text2, text3, imageUrl }: HeroProps) {
export function Hero(props: HeroProps) {
// DEBUGGING / CAN REMOVE LATER!!!!!!!!
//  console.log('HERO props at runtime:', props);
  const { heading, text, text2, text3, imageUrl } = props;
  const paragraphs = [text, text2, text3].filter(Boolean);

  return (
    <section className="c-section c-section--hero" id="hero">
      <div className="c-container">
        <div className="hero-grid">

          <div className="hero-logo">
            <div className="hero-image-container">
              <img src={imageUrl} alt="ERA Government Affairs logo" className="heroimage" />
            </div>
          </div>

          <div className="hero-copy">
            <h1 className="type-hero">{heading}</h1>
            <ClientAnimations />
            
            {/* For fixed paragraphs instead of dynamic: */}
             {/* <p className="type-body">{text}</p>
            {text2 && <p className="type-body">{text2}</p>}
            {text3 && <p className="type-body">{text3}</p>} */}
            {/**the above says, if text2 is truthy (non-empty string, etc.) → React renders */}

            {/* DYNAMIC loading of the multiple text props: */}
            {paragraphs.map((p, i) => (
              <p className="type-body" key={i}>
                {p}
              </p>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
