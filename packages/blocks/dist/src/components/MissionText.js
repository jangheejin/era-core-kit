import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// apps/site/src/components/sections/MissionText.tsx
// REACT COMPONENT FOR MISSIONTEXT
//'use client';
import { ImageFigure } from './ImageFigure';
import { ClientAnimations } from './ClientAnimations';
/*
Renders the string you pass in text (as mission text?)
Hardcoded heading is "Our Mission" (could be made flexible if needed later)
If you want to allow CMS control over the heading too, change props to { heading: string, text: string }
*/
export function MissionText({ heading, text, imageUrl }) {
    return (_jsx("section", { className: "c-section", id: "missiontext", children: _jsxs("div", { className: "c-container c-grid", children: [_jsxs("div", { children: [_jsx("h2", { className: "type-h2", children: heading }), _jsx(ClientAnimations, {}), _jsx("p", { className: "type-body", children: text })] }), _jsx("div", { className: "card-media", children: _jsx(ImageFigure, { src: imageUrl, alt: heading, aspect: "4/3", fill: true, style: { objectFit: 'cover' } }) })] }) }));
}
