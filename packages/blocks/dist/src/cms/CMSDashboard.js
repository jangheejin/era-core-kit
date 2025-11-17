// WAS: apps/site/app/admin/CMSDashboard.tsx
// packages/blocks/src/cms/CMSDashboard.tsx
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
/*
type CaseStudy = {
  title: string;
  slug: string;
  blocks: Array<{ type: string; content: string }>;
};*/
export function CMSDashboard() {
    const [caseStudies, setCaseStudies] = useState([]);
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    function addCaseStudy() {
        const newCaseStudy = {
            //User-provided fields:
            title,
            slug,
            bodyMDX: content, // Map the textarea content to the primary body
            // REQUIRED fields from the schema, given placeholder data to pass type check
            id: String(Date.now()), // Unique ID
            sector: 'GovContracting', // Default to a valid enum value
            tags: ['mock', 'admin-entry'],
            summaryShort: `Mock summary for ${title}`,
            heroImageUrl: 'https://placehold.co/1200x600', // Must be a valid URL
            // REQUIRED Array fields (defaulted to empty arrays)
            mechanisms: [],
            jurisdictions: [],
            outcomes: [],
            evidence: [],
            sections: [],
            attachments: [],
            links: [],
            // REQUIRED Boolean fields
            isFeaturedHome: false,
            isPublic: true,
        };
        setCaseStudies(cs => [...cs, newCaseStudy]);
        // Clear state
        setTitle('');
        setSlug('');
        setContent('');
    }
    return (
    //still using the strcutural wrappers defined in primitives.css
    _jsxs("div", { className: "c-container c-section c-stack", children: [_jsx("h2", { className: "type-h2", children: "CMS Content Editor (Mock) " }), _jsxs("div", { className: "c-stack", children: [_jsx("h3", { className: "type-h2", children: "Add New Case Study" }), _jsx("input", { className: "input", placeholder: "Case Study Title", value: title, onChange: e => setTitle(e.target.value) }), _jsx("input", { className: "input", placeholder: "Slug (e.g., my-case-study)", value: slug, onChange: e => setSlug(e.target.value) }), _jsx("textarea", { className: "input", placeholder: "Body Content (MDX)", value: content, onChange: e => setContent(e.target.value) }), _jsx("button", { onClick: addCaseStudy, className: "button", children: "Save Case Study (mock)" })] }), _jsx("hr", {}), _jsxs("h3", { className: "type-h3", children: ["Content Preview (", caseStudies.length, " items)"] }), _jsx("div", { className: "c-stack", children: caseStudies.map((cs, idx) => (_jsx("div", { className: "card", children: _jsxs("div", { className: "card-body c-stack", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("strong", { className: "type-small type-muted", children: cs.title }), " \u2014", _jsxs("code", { className: "type-small type-muted", children: ["/", cs.slug] })] }), _jsxs("p", { className: "type-body type-muted", children: ["**Summary:** ", cs.summaryShort] }), _jsxs("div", { className: "pad-2", style: { border: '1px solid var(--gray-300)', borderRadius: '4px' }, children: [_jsx("span", { className: "type-small type-muted", children: "bodyMDX:" }), _jsx("pre", { className: "whitespace-pre-wrap", children: cs.bodyMDX || '(No MDX Content)' })] })] }) }, idx))) })] }));
}
