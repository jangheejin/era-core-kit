// packages/blocks/src/components/Hero.tsx
// SERVER COMPONENT
//'use client';

import '@styles/hero.css';
import { ImageFigure } from './ImageFigure';
import type { HeroProps } from '../types';
import { ClientAnimations } from './ClientAnimations';

export function Hero({ heading, subhead, imageUrl }: HeroProps) {
  return (
    <section className="c-section" id="hero">
      <div className="c-container">
        <div className="hero-grid">
          <div className="hero-image-container">
            <img src={imageUrl} alt="ERA logo" className="heroimage" />
          </div>

          <div className="hero-copy">
            <h1 className="type-hero">{heading}</h1>
            <ClientAnimations />

            <p className="type-body">
              ERA Government Affairs, LLC is a premier government affairs, consulting and public affairs 
              firm. We solve problems, enhance your brand, offer strategic advice and leverage robust 
              relationships to advance your interests in Washington D.C.
            </p>
            <p className="type-body">
              With years of experience working both in Congress and as government affairs professionals, 
              we have a proud track record of getting legislation signed into law by working across the aisle 
              with Congress, the Administration and their staff.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
