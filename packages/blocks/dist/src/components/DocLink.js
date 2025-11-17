import { jsx as _jsx } from "react/jsx-runtime";
export function DocLink({ href, children }) {
    return (_jsx("a", { className: "doclink", href: href, children: children }));
}
