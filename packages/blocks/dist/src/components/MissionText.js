import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ClientAnimations } from "./ClientAnimations";
/*
Renders the string you pass in text (as mission text?)
Hardcoded heading is "Our Mission" (could be made flexible if needed later)
If you want to allow CMS control over the heading too, change props to { heading: string, text: string }
*/
export function MissionText({ heading, text, text2, imageUrl, }) {
    return (_jsx("section", { className: "c-section", id: "mission", children: _jsx("div", { className: "c-container c-grid", children: _jsxs("div", { children: [_jsx("h2", { className: "type-h2", children: heading }), _jsx(ClientAnimations, {}), _jsx("p", { className: "type-body", children: text }), text2 && _jsx("p", { className: "type-body", children: text2 })] }) }) }));
}
