// packages/blocks/src/cms/CMSDashboard.tsx
"use client";


import { useState } from "react";
import { CaseStudy as CaseStudySchema, type CaseStudyInput, type CaseStudyType } from "@kit/schema";

export type CMSDashboardProps = {
  items?: CaseStudyType[];
  onCreate?: (cs: CaseStudyType) => void;
};

export function CMSDashboard({ items, onCreate }: CMSDashboardProps) {
  const [localItems, setLocalItems] = useState<CaseStudyType[]>([]);
  const displayItems = items ?? localItems;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  function add() {
    setError(null);

    const input: CaseStudyInput = {
      id: typeof crypto !== "undefined" ? crypto.randomUUID() : String(Date.now()),
      title: title.trim(),
      slug: slug.trim(),
      client: undefined,
      //sector: "GovContracting",
      sectors: ["GovContracting"],
      year: undefined,

      tags: ["mock"],
      summaryShort: `Mock summary for ${title.trim() || "Untitled"}`,
      brief: undefined,
      heroImageUrl: "/img/case1.webp",

      mechanisms: [],
      jurisdictions: [],
      outcomes: [],
      evidence: [],

      bodyMDX: body,
      sections: [],

      attachments: [],
      links: [],

      isFeaturedHome: false,
      isPublic: true,
      // status/visibility can be omitted if your schema defaults them
    };

    const res = CaseStudySchema.safeParse(input);
    if (!res.success) {
      const issue = res.error.issues[0];
      const path = issue?.path?.length ? issue.path.join(".") : "(root)";
      const msg = issue?.message ?? "Validation failed";
      setError(`${path}): ${msg}`);
//      setError(`${path}: ${issue.message}`);
      return;
    }

    const out = res.data;

    if (onCreate) {
      onCreate(out);
    } else {
      setLocalItems((prev) => [out, ...prev.filter((p) => p.slug !== out.slug)]);
    }

    setTitle("");
    setSlug("");
    setBody("");
  }

  return (
    <section className="c-stack">
      <h2 className="type-h2">CMS dashboard (mock)</h2>

      {error && <p className="type-body" style={{ color: "var(--red-600)" }}>{error}</p>}

      <div className="c-stack">
        <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="input" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <textarea className="input" placeholder="Body (MDX)" value={body} onChange={(e) => setBody(e.target.value)} />
        <button className="button" onClick={add}>Save (mock)</button>
      </div>

      <hr />

      <div className="c-stack">
        {displayItems.map((cs) => (
          <div key={cs.id} className="card">
            <div className="card-body c-stack">
              <strong>{cs.title}</strong>
              <code className="type-small">/{cs.slug}</code>
              <p className="type-body type-muted">{cs.summaryShort}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}