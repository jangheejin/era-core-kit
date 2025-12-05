// packages/blocks/src/cms/CMSDashboard.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
//import type { CaseStudy } from "@kit/schema";
import { CaseStudy as CaseStudySchema } from "@kit/schema";
import type { CaseStudyInput, CaseStudyType } from "@kit/schema";

export interface CMSDashboardProps {
  onCreate?: (cs: CaseStudyType) => void;
}

/*export function CMSDashboard() {
  return (
    <section className="c-stack">
      <h2 className="type-h2">CMS dashboard (mock)</h2>
      <p className="type-body type-muted">
        This is a demo admin view. Users can create a new case study using the
        full schema-aware builder, or browse the current mock library.
      </p>
      <div className="buttonRow">
        <div className="c-stack c-stack--row c-stack--gap">
          <Link href="/admin/case-studies/new" className="buttonLink-2">
            Create new case study (detailed)
          </Link>
        </div>
        <div className="c-stack c-stack--row c-stack--gap">
          <Link href="/admin/case-studies/list" className="buttonLink-2">
            View case study list
          </Link>
        </div>
      </div>
    </section>
  );
}
*/
export function CMSDashboard({ onCreate }: CMSDashboardProps) {
  const [caseStudies, setCaseStudies] = useState<CaseStudyType[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");

  function addCaseStudy() {
    //const newCaseStudy: CaseStudy = {
    const newCaseStudyInput: CaseStudyInput = {// 1. Create RAW INPUT (this is allowed to be incomplete)
      // User-provided fields:
      title,
      slug,
      bodyMDX: content,

      // REQUIRED fields from the schema, given placeholder data:
      id: String(Date.now()),
      sector: "GovContracting",
      tags: ["mock", "admin-entry"],
      summaryShort: `Mock summary for ${title || "Untitled case study"}`,
      heroImageUrl: "https://placehold.co/1200x600",

      mechanisms: [],
      jurisdictions: [],
      outcomes: [],
      evidence: [],
      sections: [],
      attachments: [],
      links: [],

      isFeaturedHome: false,
      isPublic: true,
    };

    // 2. VALIDATE / CREATE FINAL OUTPUT
    const newCaseStudy: CaseStudyType = CaseStudySchema.parse(newCaseStudyInput);

    // 3. Store in component state
    setCaseStudies((prev) => [...prev, newCaseStudy]);
//    setCaseStudies((cs) => [...cs, newCaseStudy]);

    // 4. Also push upward into the shared mock CMS, if provided
    if (onCreate) onCreate(newCaseStudy);

    // 5. Reset form
    setTitle("");
    setSlug("");
    setContent("");
  }

  return (
    <div className="c-container c-section c-stack">
      <h2 className="type-h2">CMS Content Editor (Mock)</h2>

      <div className="c-stack">
        <h3 className="type-h3">Add New Case Study (quick inline)</h3>

        <input
          className="input"
          placeholder="Case Study Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="input"
          placeholder="Slug (e.g., my-case-study)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <textarea
          className="input"
          placeholder="Body Content (MDX)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={addCaseStudy} className="button">
          Save Case Study (mock)
        </button>
      </div>

      <hr />

      <h3 className="type-h3">
        Content Preview ({caseStudies.length} mock items in this panel)
      </h3>
      <div className="c-stack">
        {caseStudies.map((cs, idx) => (
          <div key={idx} className="card">
            <div className="card-body c-stack">
              <div className="flex justify-between items-center">
                <strong className="type-small type-muted">{cs.title}</strong> —{" "}
                <code className="type-small type-muted">/{cs.slug}</code>
              </div>

              <p className="type-body type-muted">
                <strong>Summary:</strong> {cs.summaryShort}
              </p>

              <div
                className="pad-2"
                style={{
                  border: "1px solid var(--gray-300)",
                  borderRadius: "4px",
                }}
              >
                <span className="type-small type-muted">bodyMDX:</span>
                <pre className="whitespace-pre-wrap">
                  {cs.bodyMDX || "(No MDX Content)"}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
