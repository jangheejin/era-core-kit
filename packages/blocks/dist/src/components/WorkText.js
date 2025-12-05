import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ClientAnimations } from "./ClientAnimations";
export function WorkText({ heading, text, text2 }) {
    return (_jsxs("section", { className: "temp", id: "work", children: [_jsx("h2", { className: "type-h2", children: heading }), _jsx(ClientAnimations, {}), _jsx("p", { className: "type-body", children: text }), text2 && _jsx("p", { className: "type-body", children: text2 })] }));
}
