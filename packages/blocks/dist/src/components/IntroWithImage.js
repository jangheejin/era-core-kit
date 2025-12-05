import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// packages/blocks/src/components/IntroWithImage.tsx
// REACT COMPONENT FOR INTROWITHIMAGE
//'use client';
// This is actually the mission section but renaming the actual components caused havoc
import "@styles/intro.css";
import { ClientAnimations } from "./ClientAnimations";
export function IntroWithImage({ heading, text, text2, imageUrl, }) {
    return (_jsx("section", { className: "c-section c-section--intro", id: "intro", children: _jsxs("div", { className: "c-container intro-grid", children: [_jsxs("div", { className: "intro-copy", children: [_jsx("h2", { className: "type-h2", children: heading }), _jsx(ClientAnimations, {}), text && _jsx("p", { className: "type-body intro-lead", children: text }), text2 && _jsx("p", { className: "type-body intro-body", children: text2 })] }), imageUrl && (_jsx("div", { className: "intro-image", children: _jsx("img", { src: imageUrl, alt: heading }) }))] }) }));
}
