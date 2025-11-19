// apps/site/src/components/sections/WorkText.tsx
// REACT COMPONENT FOR WORKTEXT
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function WorkText({ heading, text, }) {
    return (_jsx("section", { className: "c-section", id: "work", children: _jsxs("div", { className: "c-container", children: [_jsx("h2", { className: "type-h2", children: heading }), _jsx("p", { className: "type-body", children: text })] }) }));
}
