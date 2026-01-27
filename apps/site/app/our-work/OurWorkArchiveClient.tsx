//apps/site/app/our-work/OurWorkArchiveClient.tsx

// archived: previous interactive Our Work layout
"use client";

import "@styles/work.css";
import { useMemo, useRef, useState } from "react";
import type { WorkCase } from "./OurWorkClient";

export function OurWorkArchiveClient({
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
    el.scrollBy({
      left: direction === "left" ? -CARD_STEP : CARD_STEP,
      behavior: "smooth",
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
  }

  const detailHref = `${basePath}/${selected.slug}${demo ? "?demo=1" : ""}`;

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

          <div className="work-grid-shell">
            <button
              type="button"
              className="work-grid-nav work-grid-nav--left"
              onClick={() => scrollStrip("left")}
              aria-label="Scroll case studies left"
            >
              ‹
            </button>

            <section
              aria-label="Featured case studies"
              className="work-grid"
              ref={stripRef}
            >
              {featured.map((cs) => {
                const isActive = cs.slug === selected.slug;
                return (
                  <button
                    key={cs.slug}
                    type="button"
                    className={
                      "work-card" + (isActive ? " work-card--active" : "")
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

          <section
            className="work-detail"
            aria-label={`Case study detail: ${selected.client}`}
          >
            <p className="type-small work-detail__label">Currently viewing</p>

            <div className="work-detail__top">
              <div className="work-detail__text">
                <h2 className="type-h2 work-detail__title">{selected.client}</h2>

                <p className="type-body work-detail__summary">
                  {selected.summary}
                </p>

                <a
                  href={detailHref}
                  className="c-button c-button--alt2 work-detail__link"
                >
                  View full case study
                </a>
              </div>

              {selected.imageUrl && (
                <div className="work-detail__media">
                  <img src={selected.imageUrl} alt={selected.client} loading="lazy" />
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
