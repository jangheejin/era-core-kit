"use client";

import { MDXProvider } from "@mdx-js/react";
import {
  Callout,
  PullQuote,
  DocLink,
  OutcomeList,
  ImageFigure,
} from "@kit/blocks";

const components = {
  Callout,
  PullQuote,
  DocLink,
  OutcomeList,
  ImageFigure,
};

export function MDXClient({ children }: { children: React.ReactNode }) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}
