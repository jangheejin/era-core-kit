// apps/site/app/our-work/page.tsx
'use client';

import { useState } from 'react';
import '@styles/work.css';

type WorkCase = {
  slug: string;
  sector: string;
  client: string;
  teaser?: string;
  featured: boolean;
  summary: string;
  outcomes?: string[];
  imageUrl?: string;
};

const ALL_CASES: WorkCase[] = [
  {
    slug: 'sanborn-appgeo',
    sector: 'Geospatial Solutions',
    client: 'Sanborn + AppGeo',
    teaser:
      'Supporting geospatial modernization and federal engagement for critical mapping and location intelligence.',
    featured: true,
    imageUrl: '/img/case1.webp',
    summary:
      'ERA Government Affairs partnered with Sanborn and AppGeo to strengthen their federal profile, align geospatial capabilities with agency program needs, and position them for long-term contract and grant opportunities across emergency management, transportation, and homeland security.',
    outcomes: [
      'Positioned combined capabilities within key federal geospatial programs.',
      'Developed targeted engagement strategy with priority agencies and committees.',
      'Improved visibility for geospatial contributions to national preparedness.',
    ],
  },
  {
    slug: 'napsg-foundation',
    sector: 'Nonprofit Organizations',
    client: 'NAPSG Foundation',
    teaser:
      'Helping a nonprofit translate technical geospatial work into policy-relevant impact stories in DC.',
    featured: true,
    imageUrl: '/img/case2.webp',
    summary:
      'For the NAPSG Foundation, ERA helped bridge the gap between highly technical geospatial work and decision-makers in Washington. We translated complex capabilities into accessible narratives, aligned them with current federal priorities, and supported outreach to agencies and Hill offices.',
    outcomes: [
      'Clarified value proposition for non-technical federal audiences.',
      'Connected nonprofit initiatives to active federal policy conversations.',
      'Supported durable relationships with key emergency management stakeholders.',
    ],
  },
  {
    slug: 'crucis',
    sector: 'Government Contracting',
    client: 'Crucis',
    teaser:
      'Guiding a growing government contractor through the realities of federal procurement and engagement.',
    featured: true,
    imageUrl: '/img/case3.webp',
    summary:
      'ERA advised Crucis on how to navigate the federal marketplace, including realistic pathways into procurement, program alignment, and long-term relationship-building with agencies and Hill staff. The work centered on strategy over spectacle: understanding timelines, constraints, and where Crucis could authentically add value.',
    outcomes: [
      'Mapped realistic entry points into federal programs and contracts.',
      'Developed a targeted plan for outreach and capability briefing.',
      'Helped avoid common missteps that slow or stall federal growth.',
    ],
  },
  {
    slug: 'mkr-fabricators',
    sector: 'Emergency Response',
    client: 'MKR Fabricators',
    teaser:
      'Connecting real-world emergency response manufacturing needs with the federal ecosystem.',
    featured: true, // now also featured → gives you 4 cards
    imageUrl: '/img/temp.svg',
    summary:
      'ERA supported MKR Fabricators in aligning their emergency response manufacturing capabilities with evolving federal program and procurement needs, with a focus on practical deployment in emergency and disaster-response contexts.',
    outcomes: [
      'Aligned manufacturing capabilities with specific federal emergency programs.',
      'Clarified how to position products against existing procurement pathways.',
      'Supported a strategy for sustainable public-sector engagement.',
    ],
  },
];

const FEATURED_CASES = ALL_CASES.filter((c) => c.featured);

export default function OurWorkPage() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    FEATURED_CASES[0]?.slug ?? null,
  );

  const selected =
    FEATURED_CASES.find((c) => c.slug === selectedSlug) ??
    FEATURED_CASES[0] ??
    null;

  return (
    <main>
      <section className="c-section work-section">
        <div className="c-container work-layout">
          {/* Page header */}
          <header className="work-header">
            <h1 className="type-h2">Our Work</h1>
            <p className="type-body work-header__intro">
              We work with clients across geospatial, emergency management,
              government contracting, and nonprofit sectors to translate
              technical capabilities into real traction in Washington. Explore a
              sample of featured engagements below.
            </p>
          </header>

          {/* Preview grid – auto wraps for 3, 4, 6, etc. */}
          {/* small label above the strip */}
          <p className="type-body work-grid__label">
            Select a case study to view its story below
          </p>

          <section aria-label="Featured case studies" className="work-grid">
            {FEATURED_CASES.map((cs) => (
              <button
                key={cs.slug}
                type="button"
                className={
                  'work-card' +
                  (cs.slug === selected?.slug ? ' work-card--active' : '')
                }
                onClick={() => setSelectedSlug(cs.slug)}
              >
                {cs.imageUrl && (
                  <div className="work-card__media">
                    <img
                      src={cs.imageUrl}
                      alt={`${cs.client} case study`}
                      loading="lazy"
                    />
                  </div>
                )}

                <p className="type-small work-card__sector">{cs.sector}</p>
                <h2 className="type-h3 work-card__client">{cs.client}</h2>
                {/* <p className="type-body work-card__teaser">{cs.teaser}</p> */}
              </button>
            ))}
          </section>

          {/* Detail panel below grid */}
          {selected && (
            <section
              className="work-detail"
              aria-label={`Case study detail: ${selected.client}`}
            >

              {/* label mirrors the strip copy */}
              <p className="type-small work-detail__label">
                Currently viewing
              </p>

              <div className="work-detail__top">
                <div className="work-detail__text">
                  <p className="type-small work-detail__sector">
                    {selected.sector}
                  </p>
                  <h2 className="type-h2 work-detail__title">
                    {selected.client}
                  </h2>

                  <p className="type-body work-detail__summary">
                    {selected.summary}
                  </p>

                  {/* image column */}
                  {selected.imageUrl && (
                    <div className="work-detail__media">
                      <img src={selected.imageUrl} alt={selected.client} loading="lazy" />
                    </div>
                  )}
                </div>

                {selected.outcomes && selected.outcomes.length > 0 && (
                  <div className="work-detail__outcomes">
                    <h3 className="type-h4">
                      What we helped our client achieve
                    </h3>
                    <ul>
                      {selected.outcomes.map((item,idx) => (
                        <li key={idx} className="type-body">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                </div>

{/*                 {selected.imageUrl && (
                  <div className="work-detail__media">
                    <img
                      src={selected.imageUrl}
                      alt={selected.client}
                      loading="lazy"
                    />
                  </div>
                )}
              </div> */}

{/*               {selected.outcomes && selected.outcomes.length > 0 && (
                <div className="work-detail__outcomes">
                  <h3 className="type-h4">What we helped our client achieve</h3>
                  <ul>
                    {selected.outcomes.map((item, idx) => (
                      <li key={idx} className="type-body">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}

              <a
                href={`/case-studies/${selected.slug}`}
                className="c-button c-button--secondary work-detail__link"
              >
                View full case study
              </a>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
