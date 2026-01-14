// apps/site/app/admin/case-studies/mock/[slug]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useAdminCaseStudies } from "../../../AdminCaseStudyStore";

//import { AlertBanner } from "../../../components/AlertBanner";
//import { AlertBanner } from "@/components/AlertBanner";
import { ContextBanner } from "../../../components/ContextBanner";
import { CaseStudyMetadata } from "../../../components/CaseStudyMetadata";

import { Markdown } from "@/components/Markdown";

export default function MockCaseStudyPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const { getBySlug } = useAdminCaseStudies();
  const cs = getBySlug(slug);
  const SECTOR_SEPARATOR = ", "; // or " · "

//  const { items } = useAdminCaseStudies();

  //const slug = params?.slug;
//  const cs = items.find((i) => i.slug === slug);

  if (!cs) {
    return (
      <main className="c-admin">
        <h1>Not found</h1>
        <p className="muted">No case study in the demo store matches: <code>{slug}</code></p>
        <div className="row" style={{ marginTop: "1rem" }}>
          <Link href="/admin/case-studies/list">Back to list</Link>
          <Link href="/admin/case-studies/new">Create new</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="c-admin">
{/*       <div className="cms-console">
        <strong>Preview mode:</strong> This is a local-only preview of a mock case study. Changes are not saved permanently.
      </div> */}
      <ContextBanner view="preview">
        This is a local-only preview of a mock case study. Changes are not saved permanently.
      </ContextBanner>

      {/* Title + Client */}
      <div className="card" style={{ marginTop: "1rem" }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h1><strong>Title:</strong> {cs.title || "Untitled case study"}</h1>
            <div className="row">
              <Link href="/admin/case-studies/list">List</Link>
              <Link href="/admin/case-studies/new">New</Link>
            </div>
          </div>
        <h3><strong>Client:</strong> {cs.client ?? "—"}</h3>
      </div>
      
      {/* Metadata summary */}
      <div className="card metadata-card">
        {/* <h3>Metadata</h3> */}
        <CaseStudyMetadata caseStudy={cs} />
{/*         <dl className="metadata-list">
          <div>
            <dt>Client</dt>
            <dd>{cs.client || "—"}</dd>
          </div>
          <div>
            <dt>Sectors</dt>
            <dd>{(cs.sectors ?? []).join(", ") || "—"}</dd>
          </div>
          {cs.tags?.length ? (
            <div>
              <dt>Tags</dt>
              <dd>
                <div className="tag-list">
                  {cs.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </dd>
            </div>
          ) : null}
          <div>
            <dt>Status</dt>
            <dd>{cs.status || "—"}</dd>
          </div>
          <div>
            <dt>Visibility</dt>
            <dd>{cs.visibility || "—"}</dd>
          </div>
          <div>
            <dt>Slug</dt>
            <dd>
              <code>/{cs.slug}</code>
            </dd>
          </div>
        </dl>*/}
      </div> 
{/* 
      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Metadata</h3>
        <p className="muted">
          <strong>Sectors:</strong> {(cs.sectors ?? []).join(", ") || "—"} <br />
          {cs.tags?.length ? (
            <>
              <strong>Tags:</strong> {cs.tags.join(", ")} <br />
            </>
          ) : null}
          <strong>Status:</strong> {cs.status ?? "—"} <br />
          <strong>Visibility:</strong> {cs.visibility ?? "—"} <br />
          <strong>Slug:</strong> <code>/{cs.slug}</code>
        </p>
      </div> */}

      <div className="card" style={{ marginTop: "1rem" }}>
        <div className="muted" style={{ marginBottom: ".5rem" }}>
          Hero image
        </div>
{/* now using aspect-ratio wrapper so the layout remains stable in the case that there is no hero image */}
        <div className="heroMedia">
          <img src={cs.heroImageUrl}
            alt=""
          />
        </div>
      </div>

{/* SUMMARY */}      
      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Summary</h3>
          <div className="muted">
            {cs.summaryShort && <p>{cs.summaryShort}</p>}
            {cs.brief && <p>{cs.brief}</p>}
          </div>

        {cs.tags?.length ? (
          <p className="muted">
            <strong>Tags:</strong> {cs.tags.join(", ")}
          </p>
        ) : null}
      </div>

      {/* Sections */}
      {cs.sections?.length > 0 && (
        <div className="card" style={{ marginTop: "1rem" }}>
          <h3>Sections</h3>
          <div className="c-stack">
            {cs.sections.map((section) => (
              <div key={section.id}>
                <h4>{section.title}</h4>
                <p className="muted">{section.bodyMDX}</p>
              </div>
            ))}
          </div>
        </div>
      )}

 {/* Body MDX (raw display for now) */}
      {cs.bodyMDX ? (
        <div className="card" style={{ marginTop: "1rem" }}>
          <h3>Full Body (Raw text)</h3>
          {/* <pre style={{ whiteSpace: "pre-wrap" }}>{cs.bodyMDX}</pre> */}
          <Markdown>{cs.bodyMDX}</Markdown>
        </div>
      ) : null}

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Debug view</h3>
        {cs.outcomes?.length > 0 && (
            <div>
              <dt>Outcomes</dt>
              <dd>
                <ul>
                  {cs.outcomes.map((o, i) => (
                    <li key={i}><strong>{o.label}:</strong> {o.description}</li>
                  ))}
                </ul>
              </dd>
            </div>
          )}

          {cs.sections?.length > 0 && (
            <div>
              <dt>Sections</dt>
              <dd>
                <ul>
                  {cs.sections.map((s) => (
                    <li key={s.id}><strong>{s.title}</strong>: {s.bodyMDX}</li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
        <dl className="c-stack" style={{ fontFamily: "monospace", fontSize: ".9rem", gap: ".5rem" }}>
          <div>
            <dt>ID</dt>
            <dd>{cs.id}</dd>
          </div>

          <div>
            <dt>Title</dt>
            <dd>{cs.title}</dd>
          </div>

          <div>
            <dt>Slug</dt>
            <dd><code>{cs.slug}</code></dd>
          </div>

          <div>
            <dt>Client</dt>
            <dd>{cs.client}</dd>
          </div>

          <div>
            <dt>Sectors</dt>
            <dd>{cs.sectors?.join(SECTOR_SEPARATOR) || "—"}</dd>
          </div>

          <div>
            <dt>Tags</dt>
            <dd>{cs.tags?.join(", ") || "—"}</dd>
          </div>

          <div>
            <dt>Year</dt>
            <dd>{cs.year || "—"}</dd>
          </div>

          <div>
            <dt>Status</dt>
            <dd>{cs.status}</dd>
          </div>

          <div>
            <dt>Visibility</dt>
            <dd>{cs.visibility}</dd>
          </div>


        </dl>
      </div>


{/* Raw object (debug info) */}
      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Raw object (debug)</h3>
        <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(cs, null, 2)}</pre>
      </div>
    </main>
  );
}
