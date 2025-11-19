// apps/site/src/components/sections/MissionText.tsx
// REACT COMPONENT FOR MISSIONTEXT
//'use client';
import { ImageFigure } from './ImageFigure';
import type { MissionTextProps } from '../types';
/*
Renders the string you pass in text (as mission text?)
Hardcoded heading is "Our Mission" (could be made flexible if needed later)
If you want to allow CMS control over the heading too, change props to { heading: string, text: string }
*/

export function MissionText({ heading, text, imageUrl }: MissionTextProps & { imageUrl: string }) {
    return (
      <section className="c-section" id="missiontext">
        <div className="c-container c-grid">
          <div>
            <h2 className="type-h2">{heading}</h2>
            <p className="type-body">{text}</p>
          </div>
          <div className="card-media">
            <ImageFigure
              src={imageUrl}
              alt={heading}
              aspect="4/3"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>
    );
  }