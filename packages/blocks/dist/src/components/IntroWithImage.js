import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ImageFigure } from './ImageFigure';
import { ClientAnimations } from './ClientAnimations';
export function IntroWithImage({ heading, text, imageUrl }) {
    return (_jsx("section", { className: "c-section", id: "intro", children: _jsxs("div", { className: "c-container c-grid", style: { alignItems: 'center' }, children: [_jsxs("div", { children: [_jsx("h2", { className: "type-h2", children: heading }), _jsx(ClientAnimations, {}), _jsx("p", { className: "type-body", children: text }), _jsx("p", { className: "type-body", children: "Our mission is to develop and maintain a close relationship our clients, which means understanding their mission needs and objectives, and to jointly develop a targeted and pragmatic strategy to achieve them." })] }), _jsx("div", { children: _jsx(ImageFigure, { src: imageUrl, alt: heading, aspect: "4/3", style: { objectFit: 'cover' } }) })] }) }));
}
