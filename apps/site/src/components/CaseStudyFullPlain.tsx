/* eslint-disable @next/next/no-img-element */
//apps/site/src/components/CaseStudyFullRender.tsx
// “full case study renderer” component
// (so that instead of having case study cards on the filter-by-tag or filter-by-category
// pages, you can have full case studies)
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { CaseStudyType } from "@kit/schema";

export function CaseStudyFull({ cs }: { cs: CaseStudyType }) {
  return (
    <article className="card case-study-full">
      <header className="case-study-full__header">
        <h2 className="type-h2">{cs.title}</h2>

        <div className="muted case-study-full__meta">
          {cs.client ? (
            <span>
              <strong>Client:</strong> {cs.client}
            </span>
          ) : null}
          {typeof cs.year === "number" ? (
            <span>
              <strong>Year:</strong> {cs.year}
            </span>
          ) : null}
        </div>

        {!!cs.sectors?.length && (
          <div className="case-study-full__chips">
            {cs.sectors.map((s) => (
              <span key={s} className="chip">
                {s}
              </span>
            ))}
          </div>
        )}

        {!!cs.tags?.length && (
          <div className="case-study-full__chips">
            {cs.tags.map((t) => (
              <span key={t} className="chip chip--soft">
                {t}
              </span>
            ))}
          </div>
        )}

        {cs.heroImageUrl ? (
          <img
            className="case-study-full__hero"
            src={cs.heroImageUrl}
            alt=""
            loading="lazy"
          />
        ) : null}

        {cs.summaryShort ? (
          <p className="type-body">{cs.summaryShort}</p>
        ) : null}
        {cs.brief ? <p className="muted">{cs.brief}</p> : null}
      </header>

      {!!cs.outcomes?.length && (
        <section className="case-study-full__section">
          <h3 className="type-h3">Outcomes</h3>
          <ul>
            {cs.outcomes.map((o, idx) => (
              <li key={o.label ?? idx}>
                <strong>{o.label}</strong>
                {o.description ? <> — {o.description}</> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {cs.bodyMDX ? (
        <section className="case-study-full__section">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {cs.bodyMDX}
          </ReactMarkdown>
        </section>
      ) : null}

      {!!cs.sections?.length && (
        <section className="case-study-full__section">
          {cs.sections.map((s) => (
            <div key={s.id} className="case-study-full__subsection">
              <h3 className="type-h3">{s.title}</h3>
              {s.bodyMDX ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {s.bodyMDX}
                </ReactMarkdown>
              ) : null}
            </div>
          ))}
        </section>
      )}

      {!!cs.attachments?.length && (
        <section className="case-study-full__section">
          <h3 className="type-h3">Attachments</h3>
          <ul>
            {cs.attachments.map((a, idx) => (
              <li key={a.url ?? idx}>
                <a href={a.url}>{a.label}</a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!!cs.links?.length && (
        <section className="case-study-full__section">
          <h3 className="type-h3">Links</h3>
          <ul>
            {cs.links.map((l, idx) => (
              <li key={l.url ?? idx}>
                <a href={l.url}>{l.label}</a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
