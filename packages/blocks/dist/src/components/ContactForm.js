// apps/site/src/components/sections/ContactForm.tsx
// REACT COMPONENT FOR CONTACTFORM
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function ContactForm({ heading = "Get in touch", description = "Fill out the contact form below",
//}: ContactFormProps) {
 }) {
    return (_jsx("section", { className: "c-section", id: "contact", children: _jsxs("div", { className: "c-container c-stack", children: [_jsx("h2", { className: "type-h2", children: heading }), description && _jsx("p", { className: "type-body", children: description }), _jsx("form", { className: "contact-form", children: _jsxs("div", { className: "field-group", children: [_jsxs("label", { className: "type-label", htmlFor: "name", children: ["Name", _jsx("input", { type: "text", placeholder: "Name", id: "name", name: "name", required: true })] }), _jsxs("label", { className: "type-label", htmlFor: "email", children: ["Email", _jsx("input", { type: "email", placeholder: "Email", id: "email", name: "email", required: true })] }), _jsxs("label", { className: "type-label", htmlFor: "message", children: ["Message", _jsx("textarea", { placeholder: "Message", id: "message", name: "message", required: true })] }), _jsx("button", { type: "submit", className: "c-button", children: "Send" })] }) })] }) }));
}
