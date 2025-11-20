// apps/site/app/ClientWrapper.tsx
'use client';
import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
// Import any client-side context providers, state managers, etc. here
export default function ClientWrapper({ children }) {
    // Use client-only hooks or providers here if needed
    return _jsx(_Fragment, { children: children });
}
