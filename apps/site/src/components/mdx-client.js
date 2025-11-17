'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { MDXProvider } from '@mdx-js/react';
import { Callout, PullQuote, DocLink, OutcomeList, ImageFigure } from '@kit/blocks';
const components = {
    Callout,
    PullQuote,
    DocLink,
    OutcomeList,
    ImageFigure
};
export function MDXClient({ children }) {
    return _jsx(MDXProvider, { components: components, children: children });
}
