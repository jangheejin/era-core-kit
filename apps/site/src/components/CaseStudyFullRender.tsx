/* eslint-disable @next/next/no-img-element */
//apps/site/src/components/CaseStudyFullRender.tsx
// “full case study renderer” component
// (so that instead of having case study cards on the filter-by-tag or filter-by-category
// pages, you can have full case studies)
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type {
  CaseStudyType,
  CaseStudyAttachment,
  CaseStudyLink,
  Outcome,
} from "@kit/schema";
import { Markdown } from "./Markdown";

export function CaseStudyFull({
  cs,
  hideHeader = false,
}: {
  cs: CaseStudyType;
  hideHeader?: boolean;
}) {
  const sections = (cs.sections ?? []).filter((s) => {
    if (cs.outcomes?.length) {
      const title = (s.title ?? "").trim().toLowerCase();
      const id = (s.id ?? "").trim().toLowerCase();
      if (title === "outcomes" || id === "impact" || id === "outcomes")
        return false;
    }
    return true;
  });

  return (
    <article className="case-study-full">
      {!hideHeader && (
        <header className="case-study-full__header">
          <h1 className="type-h1">{cs.title}</h1>

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
      )}

      {!!cs.outcomes?.length && (
        <section className="case-study-full__section">
          <h3 className="type-h3">Outcomes</h3>
          <ul>
            {cs.outcomes.map((o: Outcome, idx) => (
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
          {/*           <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: (props) => <h2 className="type-h3" {...props} />,
              h2: (props) => <h3 className="type-h4" {...props} />,
              h3: (props) => <h4 className="type-h4" {...props} />,
            }}
          > */}
          <Markdown>{cs.bodyMDX}</Markdown>
          {/*           </ReactMarkdown>
           */}{" "}
        </section>
      ) : null}

      {!!cs.sections?.length && (
        <section className="case-study-full__section">
          {sections.map((s, idx) => (
            <div
              key={s.id ?? s.title ?? idx}
              className="case-study-full__subsection"
            >
              {s.title ? <h3 className="type-h3">{s.title}</h3> : null}
              {s.bodyMDX ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {s.bodyMDX}
                </ReactMarkdown>
              ) : null}
            </div>
          ))}
          {/*           {cs.sections.map((s: any) => (
            <div key={s.id} className="case-study-full__subsection">
              <h3 className="type-h3">{s.title}</h3>
              {s.bodyMDX ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{s.bodyMDX}</ReactMarkdown>
              ) : null}
            </div>
          ))} */}
        </section>
      )}

      {!!cs.attachments?.length && (
        <section className="case-study-full__section">
          <h3 className="type-h3">Attachments</h3>
          <ul>
            {cs.attachments.map((a: CaseStudyAttachment, idx: number) => (
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
            {cs.links.map((l: CaseStudyLink, idx: number) => (
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
