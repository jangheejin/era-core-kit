// packages/blocks/src/cms/CMSDashboard.tsx
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { CaseStudy as CaseStudySchema } from "@kit/schema";
export function CMSDashboard({ items, onCreate }) {
    const [localItems, setLocalItems] = useState([]);
    const displayItems = items ?? localItems;
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [body, setBody] = useState("");
    const [error, setError] = useState(null);
    function add() {
        setError(null);
        const input = {
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
        }
        else {
            setLocalItems((prev) => [out, ...prev.filter((p) => p.slug !== out.slug)]);
        }
        setTitle("");
        setSlug("");
        setBody("");
    }
    return (_jsxs("section", { className: "c-stack", children: [_jsx("h2", { className: "type-h2", children: "CMS dashboard (mock)" }), error && _jsx("p", { className: "type-body", style: { color: "var(--red-600)" }, children: error }), _jsxs("div", { className: "c-stack", children: [_jsx("input", { className: "input", placeholder: "Title", value: title, onChange: (e) => setTitle(e.target.value) }), _jsx("input", { className: "input", placeholder: "Slug", value: slug, onChange: (e) => setSlug(e.target.value) }), _jsx("textarea", { className: "input", placeholder: "Body (MDX)", value: body, onChange: (e) => setBody(e.target.value) }), _jsx("button", { className: "button", onClick: add, children: "Save (mock)" })] }), _jsx("hr", {}), _jsx("div", { className: "c-stack", children: displayItems.map((cs) => (_jsx("div", { className: "card", children: _jsxs("div", { className: "card-body c-stack", children: [_jsx("strong", { children: cs.title }), _jsxs("code", { className: "type-small", children: ["/", cs.slug] }), _jsx("p", { className: "type-body type-muted", children: cs.summaryShort })] }) }, cs.id))) })] }));
}
