// apps/site/src/components/sections/ContactForm.tsx
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function ContactForm({ heading = "Get in touch", description = "Fill out the contact form below", }) {
    return (_jsx("section", { className: "c-section", id: "contact", children: _jsxs("div", { className: "c-container c-stack", children: [_jsx("h2", { className: "type-h2", children: heading }), _jsxs("form", { children: [_jsxs("label", { children: ["Name", _jsx("input", { type: "text", placeholder: "Name", required: true })] }), _jsxs("label", { children: ["Email", _jsx("input", { type: "email", placeholder: "Email", required: true })] }), _jsxs("label", { children: ["Message", _jsx("textarea", { placeholder: "Message", required: true })] }), _jsx("button", { type: "submit", children: "Send" })] })] }) }));
}
