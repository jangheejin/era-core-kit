import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// packages/blocks/src/components/CaseGrid.tsx
// REACT COMPONENT FOR CASEGRID
//'use client';
import "@styles/casegrid.css";
import { ImageFigure } from "./ImageFigure";
//import { ClientAnimations } from './ClientAnimations';
export function CaseGrid({ items, layout }) {
    return (_jsx("section", { id: "case-studies", children: _jsx("div", { className: "casegrid layout-2x2", id: "case-studies", children: items.map((item) => (_jsxs("a", { href: `/case-studies/${item.slug}`, className: "case-card", children: [_jsx("div", { className: "case-card__image", children: _jsx(ImageFigure, { src: item.imageUrl, alt: item.client, aspect: "4/3" }) }), _jsxs("div", { className: "case-card__body", children: [_jsx("h3", { className: "card-h3", children: item.sector }), _jsx("h2", { className: "card-h2", children: item.client }), item.summary && (_jsx("p", { className: "type-body case-card__summary", children: item.summary }))] })] }, item.slug))) }) }));
}
