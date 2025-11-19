//apps/site/src/components/mdx-client.tsx
'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { MDXProvider } from '@mdx-js/react';
/*
const components = {
  Callout,
  PullQuote,
  DocLink,
  OutcomeList,
  ImageFigure
};*/
// TEMP FIX: STUB UI
const components = {
    Callout: () => _jsx("div", { children: "Coming soon: Callout" }),
    PullQuote: () => _jsx("div", { children: "Coming soon: PullQuote" }),
    DocLink: () => _jsx("div", { children: "Coming soon: DocLink" }),
    OutcomeList: () => _jsx("div", { children: "Coming soon: OutcomeList" }),
    ImageFigure: () => _jsx("div", { children: "Coming soon: ImageFigure" }),
};
export function MDXClient({ children }) {
    return _jsx(MDXProvider, { components: components, children: children });
}
