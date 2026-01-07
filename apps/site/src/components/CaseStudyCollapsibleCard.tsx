import type { CaseStudyType } from "@kit/schema";
import { CaseStudyFull } from "./CaseStudyFullRender";

export function CaseStudyCollapsibleCard({ cs }: { cs: CaseStudyType }) {
  return (
    <details className="cs-accordion">
      <summary className="cs-accordion__summary">
        <div className="cs-accordion__top">
          <h3 className="type-h3 cs-accordion__title">{cs.title}</h3>

          <div className="cs-accordion__actions">
            <span className="cs-accordion__cta" aria-hidden="true">
              <span className="cs-accordion__cta--closed"><strong>Expand</strong></span>
              <span className="cs-accordion__cta--open"><strong>Collapse</strong></span>
            </span>
            <span className="cs-accordion__toggle" aria-hidden="true">
              ▸
            </span>
          </div>
        </div>

        <div className="muted cs-accordion__meta">
          {cs.client ? <span>{cs.client}</span> : null}
          {!!cs.sectors?.length ? <span>• {cs.sectors.join(", ")}</span> : null}
        </div>

        {cs.summaryShort ? <p className="muted cs-accordion__summaryText">{cs.summaryShort}</p> : null}
      </summary>

      <div className="cs-accordion__body">
        <div className="prose">
          <CaseStudyFull cs={cs} hideHeader />
        </div>
      </div>
    </details>
  );
}
