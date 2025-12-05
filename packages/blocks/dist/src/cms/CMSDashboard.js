// packages/blocks/src/cms/CMSDashboard.tsx
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
//import type { CaseStudy } from "@kit/schema";
import { CaseStudy as CaseStudySchema } from "@kit/schema";
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
export function CMSDashboard({ onCreate }) {
    const [caseStudies, setCaseStudies] = useState([]);
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [content, setContent] = useState("");
    function addCaseStudy() {
        //const newCaseStudy: CaseStudy = {
        const newCaseStudyInput = {
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
        const newCaseStudy = CaseStudySchema.parse(newCaseStudyInput);
        // 3. Store in component state
        setCaseStudies((prev) => [...prev, newCaseStudy]);
        //    setCaseStudies((cs) => [...cs, newCaseStudy]);
        // 4. Also push upward into the shared mock CMS, if provided
        if (onCreate)
            onCreate(newCaseStudy);
        // 5. Reset form
        setTitle("");
        setSlug("");
        setContent("");
    }
    return (_jsxs("div", { className: "c-container c-section c-stack", children: [_jsx("h2", { className: "type-h2", children: "CMS Content Editor (Mock)" }), _jsxs("div", { className: "c-stack", children: [_jsx("h3", { className: "type-h3", children: "Add New Case Study (quick inline)" }), _jsx("input", { className: "input", placeholder: "Case Study Title", value: title, onChange: (e) => setTitle(e.target.value) }), _jsx("input", { className: "input", placeholder: "Slug (e.g., my-case-study)", value: slug, onChange: (e) => setSlug(e.target.value) }), _jsx("textarea", { className: "input", placeholder: "Body Content (MDX)", value: content, onChange: (e) => setContent(e.target.value) }), _jsx("button", { onClick: addCaseStudy, className: "button", children: "Save Case Study (mock)" })] }), _jsx("hr", {}), _jsxs("h3", { className: "type-h3", children: ["Content Preview (", caseStudies.length, " mock items in this panel)"] }), _jsx("div", { className: "c-stack", children: caseStudies.map((cs, idx) => (_jsx("div", { className: "card", children: _jsxs("div", { className: "card-body c-stack", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("strong", { className: "type-small type-muted", children: cs.title }), " \u2014", " ", _jsxs("code", { className: "type-small type-muted", children: ["/", cs.slug] })] }), _jsxs("p", { className: "type-body type-muted", children: [_jsx("strong", { children: "Summary:" }), " ", cs.summaryShort] }), _jsxs("div", { className: "pad-2", style: {
                                    border: "1px solid var(--gray-300)",
                                    borderRadius: "4px",
                                }, children: [_jsx("span", { className: "type-small type-muted", children: "bodyMDX:" }), _jsx("pre", { className: "whitespace-pre-wrap", children: cs.bodyMDX || "(No MDX Content)" })] })] }) }, idx))) })] }));
}
