//apps/site/app/our-work/OurWorkClient.tsx

// update: now the client page is separated into a client component
"use client";

import "@styles/work.css";
import { useMemo, useRef, useState } from "react";
//import { useEffect, useMemo, useRef, useState } from "react";
//import { deriveSummaryFromWriteUp, type CaseStudyType } from "@kit/schema";
//import { useAdminCaseStudies } from "../admin/AdminCaseStudyStore";

export type WorkOutcome = {
  label: string;
  description?: string;
};

export type WorkCase = {
  slug: string;
  sector: string;
  client: string;
  featured: boolean;
  summary: string;
  //outcomes?: string[];
  outcomes?: WorkOutcome[];
  imageUrl?: string;
};

export function OurWorkClient({
  cases,
  basePath = "/our-work",
  demo = false,
}: {
  cases: WorkCase[];
  basePath?: string;
  demo?: boolean;
}) {
  const featured = useMemo(() => {
    const flagged = cases.filter((c) => c.featured);
    if (flagged.length >= 6) return flagged;
    if (flagged.length === 0) return cases.slice(0, 6);
    const flaggedSlugs = new Set(flagged.map((c) => c.slug));
    const filler = cases.filter((c) => !flaggedSlugs.has(c.slug));
    return [...flagged, ...filler].slice(0, 6);
  }, [cases]);

  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    featured[0]?.slug ?? null,
  );

  const selected =
    featured.find((c) => c.slug === selectedSlug) ?? featured[0] ?? null;

  const stripRef = useRef<HTMLDivElement | null>(null);

  const scrollStrip = (direction: "left" | "right") => {
    const el = stripRef.current;
    if (!el) return;
    const CARD_STEP = 280;
    el.scrollBy({ left: direction === "left" ? -CARD_STEP : CARD_STEP, behavior: "smooth" });
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
  }

  const detailHref = `${basePath}/${selected.slug}${demo ? "?demo=1" : ""}`;
  const spotlight = selected ?? featured[0];

  return (
    <main>
      <section className="c-section work-section">
        <div className="c-container work-layout">
          <header className="work-header">
            <h1 className="type-h1">Our Work</h1>
            <p className="type-body work-header__intro">
              We work with clients across geospatial, emergency management,
              government contracting, and nonprofit sectors to translate
              technical capabilities into real traction in Washington.
            </p>
          </header>

          <p className="type-body work-grid__label">
            Select a case study to view its story below
          </p>

          {spotlight && (
            <div className="work-mobile">
              <section className="work-spotlight" aria-label="Featured case study">
                <div className="work-spotlight__text">
                  <p className="type-small work-spotlight__label">Spotlight</p>
                  <h2 className="type-h2 work-spotlight__title">{spotlight.client}</h2>
                  <p className="type-body work-spotlight__summary">{spotlight.summary}</p>
                  <a href={detailHref} className="c-button c-button--alt2 work-spotlight__link">
                    View full case study
                  </a>
                </div>
                {spotlight.imageUrl && (
                  <div className="work-spotlight__media">
                    <img src={spotlight.imageUrl} alt={spotlight.client} loading="lazy" />
                  </div>
                )}
              </section>
              <div className="work-mobile-grid" aria-label="Case study grid">
                {featured.map((cs) => (
                  <a key={cs.slug} href={`${basePath}/${cs.slug}${demo ? "?demo=1" : ""}`} className="work-mobile-card">
                    {cs.imageUrl && (
                      <div className="work-mobile-card__media">
                        <img src={cs.imageUrl} alt={cs.client} loading="lazy" />
                      </div>
                    )}
                    <div className="work-mobile-card__body">
                      <h3 className="type-h3 work-mobile-card__title">{cs.client}</h3>
                      <p className="type-small work-mobile-card__summary">{cs.summary}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="work-grid-shell">
            <button
              type="button"
              className="work-grid-nav work-grid-nav--left"
              onClick={() => scrollStrip("left")}
              aria-label="Scroll case studies left"
            >
              ‹
            </button>

            <section aria-label="Featured case studies" className="work-grid" ref={stripRef}>
              {featured.map((cs) => {
                const isActive = cs.slug === selected.slug;
                return (
                  <button
                    key={cs.slug}
                    type="button"
                    className={"work-card" + (isActive ? " work-card--active" : "")}
                    onClick={() => setSelectedSlug(cs.slug)}
                  >
                    {cs.imageUrl && (
                      <div className="work-card__media">
                        <img src={cs.imageUrl} alt={`${cs.client} case study`} loading="lazy" />
                      </div>
                    )}
                    {/* <h5 className="type-h5 work-card__sector">{cs.sector}</h5> */}
                    <h2 className="type-h3 work-card__client">{cs.client}</h2>
                  </button>
                );
              })}
            </section>

            <button
              type="button"
              className="work-grid-nav work-grid-nav--right"
              onClick={() => scrollStrip("right")}
              aria-label="Scroll case studies right"
            >
              ›
            </button>
          </div>

          <section className="work-detail" aria-label={`Case study detail: ${selected.client}`}>
            <p className="type-small work-detail__label">Currently viewing</p>

            <div className="work-detail__top">
              <div className="work-detail__text">
                {/* <h5 className="type-h5 work-detail__sector">{selected.sector}</h5> */}
                <h2 className="type-h2 work-detail__title">{selected.client}</h2>

                <p className="type-body work-detail__summary">{selected.summary}</p>

                <a href={detailHref} className="c-button c-button--alt2 work-detail__link">
                  View full case study
                </a>

{/* hiding this for now to simplify creation -> publishing flow for client */}
{/*                 {selected.outcomes?.length ? (
                  <div className="work-detail__outcomes">
                    <h3 className="type-h3">What we helped our client achieve</h3>
                    <ul>
                      {selected.outcomes.map((o, idx) => (
                        <li key={idx} className="type-body">
                          <strong>{o.label}:</strong> 
                          {o.description ? <> — {o.description}</> : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null} */}
              </div>

              {selected.imageUrl && (
                <div className="work-detail__media">
                  <img src={selected.imageUrl} alt={selected.client} loading="lazy" />
                </div>
              )}
            </div>

{/*             <a href={detailHref} className="c-button c-button--alt2 work-detail__link">
              View full case study
            </a> */}
          </section>
        </div>
      </section>
    </main>
  );
}
