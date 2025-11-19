'use client';

import { MDXProvider } from '@mdx-js/react';
import { Callout, PullQuote, DocLink, OutcomeList, ImageFigure } from '@kit/blocks';
//import { useMDXComponent } from 'next-contentlayer/hooks'; // or wherever your MDX source comes from
import { useMemo } from 'react';
import * as runtime from 'react/jsx-runtime';
//import { compile } from '@mdx-js/mdx';
import { Fragment } from 'react';


const components = {
  Callout,
  PullQuote,
  DocLink,
  OutcomeList,
  ImageFigure
};

export function MDXClient({ children }: { children: React.ReactNode }) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}


type Props = { code: string };
/*
export function MDXClient({ code }: Props) {
  const Component = useMDXComponent(code);
  return (
    <Component
      components={{
        Callout,
        PullQuote,
        OutcomeList,
        DocLink,
        ImageFigure,
      }}
    />
  );
}*/