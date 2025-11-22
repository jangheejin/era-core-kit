// apps/site/src/utils/BlockRenderer.tsx
"use client";

import React from "react";
import type { ComponentType } from "react";

import type { LayoutBlock, BlockType } from "@kit/blocks";
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
  WorkWithCaseGrid,
} from "@kit/blocks";

// Map each allowed block type to its React component.
// Note: lowercase aliases share the same component.

//const blockComponentMap: Record<BlockType, ComponentType<any>> = {
//const blockComponentMap: Partial<Record<BlockType, React.ComponentType<any>>> = {
const blockComponents: Partial<Record<BlockType, React.ComponentType<any>>> = {
  Hero,
  IntroWithImage,
  MissionText,
  WorkText,
  CaseGrid,
  TeamStrip,
  WorkWithCaseGrid,

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
  // No ContactForm here on purpose
};
/*
interface BlockRendererProps {
  block: LayoutBlock;
  index: number;
}*/
type BlockRendererProps = {
  blocks: LayoutBlock[];
};

/*
export default function BlockRenderer({ block, index }: BlockRendererProps) {
  const Component = blockComponentMap[block.type];

  if (!Component) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`[BlockRenderer] Unknown block type: ${block.type}`);
    }
    return null;
  }

  return <Component key={block._key ?? index} {...(block as any).props} />;
}
*/
export default function BlockRenderer({ blocks }: BlockRendererProps) {
  return (
    <>
      {blocks.map((block, idx) => {
        const Component = blockComponents[block.type as BlockType];

        if (!Component) {
          console.warn('[BlockRenderer] Unknown block type:', block.type);
          return null;
        }

        return (
          <Component
            key={block._key ?? `${block.type}-${idx}`}
            {...(block as any).props}
          />
        );
      })}
    </>
  );
}