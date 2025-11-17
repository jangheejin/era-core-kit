'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ImageFigure } from './ImageFigure';
export function CaseGrid({ items, layout }) {
    return (_jsx("section", { className: "c-section", id: "case-studies", children: _jsxs("div", { className: "c-container", children: [_jsx("h2", { className: "type-h2", children: "Our Work" }), _jsx("div", { className: "c-grid layout-2x2", children: items.map((item) => (_jsxs("a", { href: `/case-studies/${item.slug}`, className: "case-card", children: [_jsx("div", { className: "case-card__image", children: _jsx(ImageFigure, { src: item.imageUrl, alt: item.title, aspect: "4/3" }) }), _jsxs("div", { className: "case-card__body", children: [_jsx("h3", { className: "type-h3", children: item.title }), _jsx("p", { className: "type-body", children: item.summary })] })] }, item.slug))) })] }) }));
}
