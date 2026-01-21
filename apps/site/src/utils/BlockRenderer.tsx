// apps/site/src/utils/BlockRenderer.tsx
"use client";

import React from "react";

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
//  WorkWithCaseGrid,
} from "@kit/blocks";

import { WorkWithCaseGridSmart as WorkWithCaseGrid } from "../components/sections/WorkWithCaseGridSmart";

// Map each allowed block type to its React component.
// Note: lowercase aliases share the same component.

//const blockComponentMap: Record<BlockType, ComponentType<any>> = {
//const blockComponentMap: Partial<Record<BlockType, React.ComponentType<any>>> = {
const blockComponents: Partial<Record<BlockType, React.ComponentType<Record<string, unknown>>>> = {
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

type BlockGroup = {
  groupId?: string;
  blocks: LayoutBlock[];
};

function groupBlocks(blocks: LayoutBlock[]): BlockGroup[] {
  return blocks.reduce<BlockGroup[]>((groups, block) => {
    if (!block.groupId) {
      groups.push({ blocks: [block] });
      return groups;
    }

    const lastGroup = groups[groups.length - 1];
    if (lastGroup?.groupId === block.groupId) {
      lastGroup.blocks.push(block);
      return groups;
    }

    groups.push({ groupId: block.groupId, blocks: [block] });
    return groups;
  }, []);
}

function renderBlock(block: LayoutBlock, key: string) {
  const Component = blockComponents[block.type as BlockType];

  if (!Component) {
    console.warn("[BlockRenderer] Unknown block type:", block.type);
    return null;
  }

  const componentProps =
    (block as LayoutBlock & { props?: Record<string, unknown> }).props ?? {};
  return <Component key={key} {...componentProps} />;
}

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
  const groups = groupBlocks(blocks);

  return (
    <>
      {groups.flatMap((group, groupIndex) => {
        if (!group.groupId) {
          return group.blocks.map((block, idx) =>
            renderBlock(
              block,
              block._key ?? `${block.type}-${groupIndex}-${idx}`,
            ),
          );
        }

        return (
          <div
            key={`group-${group.groupId}-${groupIndex}`}
            className={`c-section-group c-section-group--${group.groupId}`}
            data-section-group={group.groupId}
          >
            {group.blocks.map((block, idx) =>
              renderBlock(
                block,
                block._key ?? `${block.type}-${groupIndex}-${idx}`,
              ),
            )}
          </div>
        );
      })}
    </>
  );
}
