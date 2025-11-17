// apps/site/src/components/sections/TeamStrip.tsx
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function TeamStrip({ people }) {
    return (_jsx("section", { className: "c-section", id: "team", style: { background: 'var(--bg-2)' }, children: _jsxs("div", { className: "c-container", children: [_jsx("h2", { className: "type-h2", children: "Our Team" }), _jsx("ul", { className: "team-list c-stack", children: people.map((person) => (_jsxs("li", { className: "team-card", children: [_jsx("img", { src: person.imageUrl, alt: person.name, className: "team-image" }), _jsx("p", { className: "type-h3", children: person.name }), _jsx("p", { className: "type-body", children: person.role })] }, person.name))) })] }) }));
}
