import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// packages/blocks/src/components/Hero.tsx
// SERVER COMPONENT
//'use client';
import "@styles/hero.css";
import { ClientAnimations } from "./ClientAnimations";
//export function Hero({ heading, text, text2, text3, imageUrl }: HeroProps) {
export function Hero(props) {
    // DEBUGGING / CAN REMOVE LATER!!!!!!!!
    //  console.log('HERO props at runtime:', props);
    const { heading, text, text2, text3, imageUrl } = props;
    const paragraphs = [text, text2, text3].filter(Boolean);
    return (_jsx("section", { className: "c-section c-section--hero", id: "hero", children: _jsx("div", { className: "c-container", children: _jsxs("div", { className: "hero-grid", children: [_jsx("div", { className: "hero-logo", children: _jsx("div", { className: "hero-image-container", children: _jsx("img", { src: imageUrl, alt: "ERA Government Affairs logo", className: "heroimage" }) }) }), _jsxs("div", { className: "hero-copy", children: [_jsx("h1", { className: "type-hero", children: heading }), _jsx(ClientAnimations, {}), paragraphs.map((p, i) => (_jsx("p", { className: "type-body", children: p }, i)))] })] }) }) }));
}
