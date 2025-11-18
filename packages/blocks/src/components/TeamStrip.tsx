// apps/site/src/components/sections/TeamStrip.tsx
// REACT COMPONENT FOR TEAMSTRIP
'use client';
import { ImageFigure } from './ImageFigure';
import React from 'react';
import type { TeamStripProps } from '../types';

export function TeamStrip({ people }: TeamStripProps) {
  return (
    <section className="c-section" id="team" style={{ background: 'var(--bg-2)' }}>
      <div className="c-container">
        <h2 className="type-h2">Our Team</h2>
        <ul className="team-list c-stack">
          {people.map((person) => (
            <li key={person.name} className="team-card">
                <img src={person.imageUrl} alt={person.name} className="team-image" />
                <p className="type-h3">{person.name}</p>
                <p className="type-body">{person.role}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
