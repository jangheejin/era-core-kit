//apps/site/src/components/CaseStudyCollapsibleCard.tsx
import { sectorLabel, type CaseStudyType } from "@kit/schema";
import { CaseStudyFull } from "./CaseStudyFullRender";

export function CaseStudyCollapsibleCard({ cs }: { cs: CaseStudyType }) {
  //const SECTOR_SEPARATOR = ", "; // or " · "
  const sectors = cs.sectors;
  if (!sectors?.length) return null;

  const firstSector = sectors[0];
  if (firstSector == null) return null;

  //  return sectors?.length ? (
  return (
    <details className="cs-accordion">
      <summary className="cs-accordion__summary">
        <div className="cs-accordion__top">
          <h3 className="type-h3 cs-accordion__title">{cs.title}</h3>

          <div className="cs-accordion__actions">
            <span className="cs-accordion__cta" aria-hidden="true">
              <span className="cs-accordion__cta--closed">
                <strong>Expand</strong>
              </span>
              <span className="cs-accordion__cta--open">
                <strong>Collapse</strong>
              </span>
            </span>
            <span className="cs-accordion__toggle" aria-hidden="true">
              ▸
            </span>
          </div>
        </div>

        <div className="muted cs-accordion__meta">
          {cs.client ? <span>{cs.client}</span> : null}
          {/* {!!cs.sectors?.length ? <span>• {cs.sectors.join(SECTOR_SEPARATOR)}</span> : null} */}
          {!!cs.sectors?.length ? (
            <span>
              • {sectorLabel(firstSector)}
              {/* • {sectorLabel(sectors[0]!)} */}
              {cs.sectors.length > 1 ? ` +${cs.sectors.length - 1}` : ""}
            </span>
          ) : null}
        </div>

        {cs.summaryShort ? (
          <p className="muted cs-accordion__summaryText">{cs.summaryShort}</p>
        ) : null}
      </summary>

      <div className="cs-accordion__body">
        <div className="prose">
          <CaseStudyFull cs={cs} hideHeader />
        </div>
      </div>
    </details>
  ); //;
}
