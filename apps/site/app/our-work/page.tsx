//apps/site/app/our-work/page.tsx

// THIS IS NOW A SERVER PAGE that supplies data
// - data comes from the client-side demo CMS store (localStorage)
// - later when the real CMS is finished, data will come from there
//'use client';

// demo edit: this is client-side again.

//"use client";

import '@styles/work.css';

import { OurWorkDataBridge } from "./OurWorkDataBridge";

//function toWorkCase(cs: any, featured: boolean): WorkCase {
export default async function OurWorkPage() {
  return (
    <div data-cms-ssr="1">
      <OurWorkDataBridge basePath="/our-work" />
    </div>
  );
}

/*   return (
    <>
      <div data-cms-ssr="1">
        <OurWorkClient cases={items} basePath="/our-work" demo={false} />
      </div>
 */
      {/* <DemoGate enabled={demo} /> */}
/*     </>
  ); 
}*/
  //const { items } = useAdminCaseStudies();

/*   const cases = useMemo(() => {
    const publicItems = items.filter((cs) => cs.isPublic);

    const anyFeatured = publicItems.some((cs) => Boolean(cs.isFeaturedHome));
    return publicItems.map((cs, idx) =>
      toWorkCase(cs, anyFeatured ? Boolean(cs.isFeaturedHome) : idx < 6),
    );
  }, [items]);

  return <OurWorkClient cases={cases} basePath="/our-work" demo={false} />; 
}*/
/* const ALL_CASES: WorkCase[] = [
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
    featured: true, // also featured → gives you 4 cards
    imageUrl: '/img/temp.svg',
    summary:
      'ERA supported MKR Fabricators in aligning their emergency response manufacturing capabilities with evolving federal program and procurement needs, with a focus on practical deployment in emergency and disaster-response contexts.',
    outcomes: [
      'Aligned manufacturing capabilities with specific federal emergency programs.',
      'Clarified how to position products against existing procurement pathways.',
      'Supported a strategy for sustainable public-sector engagement.',
    ],
  },
  {
    slug: 'stemheads',
    sector: 'Education',
    client: 'STEMheads',
    teaser:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
    featured: true, // also featured → gives you 4 cards
    imageUrl: '/img/temp2.svg',
    summary:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    outcomes: [
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    ],
  },
];
 */
/* const FEATURED_CASES = ALL_CASES.filter((c) => c.featured); */

/* export default function OurWorkPage() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    FEATURED_CASES[0]?.slug ?? null,
  );

  const selected =
    FEATURED_CASES.find((c) => c.slug === selectedSlug) ??
    FEATURED_CASES[0] ??
    null;

  
  // ref for the new horizontal strip
  const stripRef = useRef<HTMLDivElement | null>(null);

  // simple scroll helper – one “card width” per click
  const scrollStrip = (direction: 'left' | 'right') => {
    const el = stripRef.current;
    if (!el) return;

    // Approximate one card + gap, maybe tweak this
    const CARD_STEP = 280; // px

    const delta = direction === 'left' ? -CARD_STEP : CARD_STEP;

    el.scrollBy({
      left: delta,
      behavior: 'smooth',
    });
  };

  if (!selected) {
    return (
      <main>
        <section className="c-section work-section">
          <div className="c-container">
            <h1 className="type-h1">Our Work</h1>
            <p className="type-body">Case studies coming soon.</p>
          </div>
        </section>
      </main>
    );
  } */

/*   return (
    <main>
      <section className="c-section work-section">
        <div className="c-container work-layout"> */
          {/* Page header */}
{/*           <header className="work-header">
            <h1 className="type-h1">Our Work</h1>
            <p className="type-body work-header__intro">
              We work with clients across geospatial, emergency management,
              government contracting, and nonprofit sectors to translate
              technical capabilities into real traction in Washington. Explore a
              sample of featured engagements below.
            </p>
          </header> */}

          {/* Small label above the strip */}
{/*           <p className="type-body work-grid__label">
            Select a case study to view its story below
          </p> */}

          {/**NEW preview strip! shell: nav buttons + scrollable strip */}
{/* 
          <div className="work-grid-shell">
            <button
              type="button"
              className="work-grid-nav work-grid-nav--left"
              onClick={() => scrollStrip('left')}
              aria-label="Scroll case studies left"
            >
              ‹
            </button>

            <section
              aria-label="Featured case studies"
              className="work-grid"
              ref={stripRef}
            >
              {FEATURED_CASES.map((cs) => {
                const isActive = cs.slug === selected.slug;
                return (
                  <button
                    key={cs.slug}
                    type="button"
                    className={
                      'work-card' + (isActive ? ' work-card--active' : '')
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

                    <h5 className="type-h5 work-card__sector">{cs.sector}</h5>
                    <h2 className="type-h3 work-card__client">{cs.client}</h2>
                  </button>
                );
              })}
            </section>

            <button
              type="button"
              className="work-grid-nav work-grid-nav--right"
              onClick={() => scrollStrip('right')}
              aria-label="Scroll case studies right"
            >
              ›
            </button>
          </div> */}

          {/* OLD Preview strip – horizontal, scrolls when there are many cards */}
{/*           <section aria-label="Featured case studies" className="work-grid">
            {FEATURED_CASES.map((cs) => {
              const isActive = cs.slug === selected.slug;

              return (
                <button
                  key={cs.slug}
                  type="button"
                  className={
                    'work-card' + (isActive ? ' work-card--active' : '')
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

                  <h5 className="type-h5 work-card__sector">{cs.sector}</h5>
                  <h2 className="type-h3 work-card__client">{cs.client}</h2> */}
                  {/* If you want teaser back: */}
                  {/* {cs.teaser && (
                    <p className="type-body work-card__teaser">{cs.teaser}</p>
                  )} */}
{/*                 </button>
              );
            })}
          </section> */}

          {/* Detail panel below grid */}
{/*           <section
            className="work-detail"
            aria-label={`Case study detail: ${selected.client}`}
          >
            <p className="type-small work-detail__label">Currently viewing</p>

            <div className="work-detail__top"> */}
              {/* TEXT COLUMN: sector → title → summary → outcomes */}
{/*               <div className="work-detail__text">
                <h5 className="type-h5 work-detail__sector">
                  {selected.sector}
                </h5>
                <h2 className="type-h2 work-detail__title">
                  {selected.client}
                </h2>

                <p className="type-body work-detail__summary">
                  {selected.summary}
                </p>

                {selected.outcomes && selected.outcomes.length > 0 && (
                  <div className="work-detail__outcomes">
                    <h3 className="type-h3">
                      What we helped our client achieve
                    </h3>
                    <ul>
                      {selected.outcomes.map((item, idx) => (
                        <li key={idx} className="type-body">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div> */}

              {/* IMAGE COLUMN */}
{/*               {selected.imageUrl && (
                <div className="work-detail__media">
                  <img
                    src={selected.imageUrl}
                    alt={selected.client}
                    loading="lazy"
                  />
                </div>
              )}
            </div>
 */}
            {/* CTA */}
{/*             <a
              href={`/case-studies/${selected.slug}`}
              className="c-button c-button--alt2 work-detail__link"
            >
              View full case study
            </a>
          </section>
        </div>
      </section>
    </main>
  );
}
 */}
