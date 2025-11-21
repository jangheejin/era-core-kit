//apps/site/app/admin/case-studies/new/page.tsx
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { CaseStudy as CaseStudySchema } from '@kit/schema';
//import { CaseStudy, type CaseStudy as CaseStudyType } from '@kit/schema';
export default function NewCaseStudyForm() {
    const [draft, setDraft] = useState({
        title: '',
        slug: '',
        sector: 'GovContracting',
        summaryShort: '',
        heroImageUrl: '',
    });
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState(null);
    function update(field, value) {
        setDraft((d) => ({ ...d, [field]: value }));
        setError(null);
        setPreview(null);
    }
    function validate() {
        const result = CaseStudySchema.safeParse(draft);
        if (!result.success) {
            const issue = result.error.issues[0];
            const path = issue?.path?.length ? issue.path.join('.') : '(root)';
            setError(`${path}: ${issue?.message ?? 'Validation failed.'}`);
            setPreview(null);
            return;
        }
        setError(null);
        setPreview(result.data);
    }
    return (_jsxs("main", { className: "max-w-2xl mx-auto py-10 space-y-8", children: [_jsx("h1", { className: "text-2xl font-semibold", children: "New Case Study" }), _jsxs("div", { className: "space-y-4", children: [_jsx("input", { placeholder: "Title", value: draft.title || '', onChange: (e) => update('title', e.target.value), className: "w-full p-2 border rounded" }), _jsx("input", { placeholder: "Slug", value: draft.slug || '', onChange: (e) => update('slug', e.target.value), className: "w-full p-2 border rounded" }), _jsx("input", { placeholder: "Hero Image URL", value: draft.heroImageUrl || '', onChange: (e) => update('heroImageUrl', e.target.value), className: "w-full p-2 border rounded" }), _jsx("input", { placeholder: "Summary (short)", value: draft.summaryShort || '', onChange: (e) => update('summaryShort', e.target.value), className: "w-full p-2 border rounded" }), _jsxs("select", { value: draft.sector || 'GovContracting', onChange: (e) => update('sector', e.target.value), className: "w-full p-2 border rounded", children: [_jsx("option", { value: "Defense", children: "Defense" }), _jsx("option", { value: "Health", children: "Health" }), _jsx("option", { value: "FinTech", children: "FinTech" }), _jsx("option", { value: "Education", children: "Education" }), _jsx("option", { value: "Nonprofit", children: "Nonprofit" }), _jsx("option", { value: "GovContracting", children: "GovContracting" }), _jsx("option", { value: "EmergencyMgmt", children: "EmergencyMgmt" })] })] }), _jsx("button", { onClick: validate, className: "bg-black text-white px-4 py-2 rounded hover:bg-gray-800", children: "Validate + Preview" }), error && _jsx("p", { className: "text-red-500 text-sm", children: error }), preview && (_jsx("pre", { className: "text-xs mt-4 p-4 border rounded bg-neutral-50 overflow-x-auto", children: JSON.stringify(preview, null, 2) }))] }));
}
