// apps/site/src/utils/BlockRenderer.tsx
'use client';

import React from 'react';
import type { ComponentType } from 'react';

import type { LayoutBlock, BlockType } from '@kit/blocks';
import {
  Hero,
  IntroWithImage,
  MissionText,
  WorkText,
  CaseGrid,
  TeamStrip,
  Callout,
  PullQuote,
  DocLink,
  OutcomeList,
  ImageFigure,
} from '@kit/blocks';

const componentMap: Record<BlockType, ComponentType<any>> = {
  Hero,
  IntroWithImage,
  MissionText,
  WorkText,
  CaseGrid,
  TeamStrip,
  Callout,
  callout: Callout,
  PullQuote,
  pullQuote: PullQuote,
  DocLink,
  docLink: DocLink,
  OutcomeList,
  outcomeList: OutcomeList,
  ImageFigure,
  imageFigure: ImageFigure,
  // ContactForm intentionally NOT included here
};

interface BlockRendererProps {
  block: LayoutBlock;
  index: number;
}

export default function BlockRenderer({ block, index }: BlockRendererProps) {
  const Component = componentMap[block.type];

  if (!Component) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[BlockRenderer] Unknown block type: ${block.type}`);
    }
    return null;
  }

  return <Component key={block._key ?? index} {...(block as any).props} />;
}
