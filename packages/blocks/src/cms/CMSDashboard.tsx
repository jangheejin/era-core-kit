// packages/blocks/src/cms/CMSDashboard.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
//import type { CaseStudy } from "@kit/schema";
import { CaseStudy as CaseStudySchema } from "@kit/schema";
import type { CaseStudyInput, CaseStudyType } from "@kit/schema";
import {
  CASE_STUDY_VISIBILITY_VALUES,
  CASE_STUDY_STATUS_VALUES,
} from "@kit/schema";
import {
  type CaseStudyVisibilityValue,
  type CaseStudyStatusValue,
} from "@kit/schema";

//import { useAdminCaseStudies } from "apps/site/app/admin/AdminCaseStudyStore";

export interface CMSDashboardProps {
  items?: CaseStudyType[]; //pass CMS store items from app
  onCreate?: (cs: CaseStudyType) => void; // pass store addCaseStudy function from app
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const STATUS_OPTIONS = CASE_STUDY_STATUS_VALUES
const [status, setStatus] = useState<CaseStudyStatusValue>("Draft");

const VISIBILITY_OPTIONS = CASE_STUDY_VISIBILITY_VALUES
const [visibility, setVisibility] = useState<CaseStudyVisibilityValue>("Internal");


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
export function CMSDashboard({ items, onCreate }: CMSDashboardProps) {
//  const [caseStudies, setCaseStudies] = useState<CaseStudyType[]>([]);
  const [localItems, setLocalItems] = useState<CaseStudyType[]>([]);
  const displayItems = items ?? localItems;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");

  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>("Draft");
  const [visibility, setVisibility] =
    useState<(typeof VISIBILITY_OPTIONS)[number]>("Internal");

  const [errorLines, setErrorLines] = useState<string[]>([]);

  const computedSlug = useMemo(() => {
    const s = slug.trim();
    if (s) return s;
    return slugify(title);
  }, [slug, title]);

  function addCaseStudy() {
    setErrorLines([]);

    const finalSlug = computedSlug;
    //const newCaseStudy: CaseStudy = {
    const newCaseStudyInput: CaseStudyInput = {// 1. Create RAW INPUT (this is allowed to be incomplete)
      // User-provided fields:
      title: title || "Untitled case study",
      slug: finalSlug,
      bodyMDX: content,

      // REQUIRED fields from the schema, given placeholder data:
//      id: String(Date.now()),
      id: `draft-${Date.now()}`,
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

    const res = CaseStudySchema.safeParse(newCaseStudyInput);
    if (!res.success) {
      const lines = res.error.issues.map((iss) => {
        const path = iss.path.length ? iss.path.join(".") : "(root)";
        return `${path}: ${iss.message}`;
      });
      setErrorLines(lines);
      return;
    }

    // 2. VALIDATE / CREATE FINAL OUTPUT
    const newCaseStudy: CaseStudyType = res.data
    //const newCaseStudy: CaseStudyType = CaseStudySchema.parse(newCaseStudyInput);

    // 3. Store in component state. If caller provided a store hook, use it; otherwise keep local preview state.

//    setCaseStudies((prev) => [...prev, newCaseStudy]);
//    setCaseStudies((cs) => [...cs, newCaseStudy]);

    // 4. Also push upward into the shared mock CMS, if provided
    if (onCreate) onCreate(newCaseStudy);
    else setLocalItems((prev) => [...prev, newCaseStudy]);

    // 5. Reset form
    setTitle("");
    setSlug("");
    setContent("");
    setStatus("Draft");
    setVisibility("Internal");
  }

  return (
    <section className="c-stack">
      <h2 className="type-h2">CMS dashboard (mock)</h2>
      <p className="type-body type-muted">
        Demo admin navigation. (The real demo CMS store now lives in <code>apps/site/app/admin</code>.)
      </p>

      <div className="buttonRow">
        <div className="c-stack c-stack--row c-stack--gap">
          <Link href="/admin/case-studies/new" className="buttonLink-2">
            Create new case study
          </Link>
        </div>
        <div className="c-stack c-stack--row c-stack--gap">
          <Link href="/admin/case-studies/list" className="buttonLink-2">
            View case study list
          </Link>
        </div>
      </div>

      <p className="type-small type-muted" style={{ marginTop: "1rem" }}>
        Items in store: <strong>{items?.length ?? 0}</strong>
      </p>
    </section>
  );
}

/*   return (
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
          placeholder="Slug (e.g., my-case-study) (auto-generated from title if blank)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <div className="type-small type-muted">
          Using slug: <code>/{computedSlug || "(missing)"}</code>
        </div>
        <div className="c-stack c-stack--row c-stack--gap">
          <label className="c-stack" style={{ minWidth: 220 }}>
            <span className="type-small type-muted">Status</span>
            <select
              className="input"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as (typeof STATUS_OPTIONS)[number])
              }
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="c-stack" style={{ minWidth: 220 }}>
            <span className="type-small type-muted">Visibility</span>
            <select
              className="input"
              value={visibility}
              onChange={(e) =>
                setVisibility(
                  e.target.value as (typeof VISIBILITY_OPTIONS)[number],
                )
              }
            >
              {VISIBILITY_OPTIONS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
        </div>

        <textarea
          className="input"
          placeholder="Body Content (MDX)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {errorLines.length > 0 && (
          <div
          className="pad-2"
          style={{
            border: "1px solid var(--red-400)",
            borderRadius: "6px",
          }}
        >
          <div className="type-small" style={{ fontWeight: 600 }}>
              Validation errors
            </div>
            <ul className="type-small">
              {errorLines.map((l) => (
                <li key={l}>
                  <code>{l}</code>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button onClick={addCaseStudy} className="button">
          Save Case Study (mock)
        </button>
      </div>

      <hr />

      <h3 className="type-h3">
        Content Preview ({displayItems.length} mock items in this panel)
      </h3>

      <div className="c-stack">
        {displayItems.map((cs, idx) => (
          <div key={idx} className="card">
            <div className="card-body c-stack">
              <div className="flex justify-between items-center">
                <strong className="type-small type-muted">{cs.title}</strong> —{" "}

                <span className="type-small type-muted">
                  — <code>/{cs.slug}</code>
                </span>
              </div>

              <div className="type-small type-muted">
                <strong>Status:</strong> {cs.status}{" "}
                <strong style={{ marginLeft: 12 }}>Visibility:</strong>{" "}
                {cs.visibility}
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
 */