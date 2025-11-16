// apps/site/src/utils/renderBlock.tsx
import React from "react";
import { blockRegistry } from "@kit/blocks";
import type { LayoutBlock, BlockComponentProps } from "@kit/blocks";
import BlockRenderer from "./BlockRenderer";

export function renderBlock(block: LayoutBlock, index: number) {
  // 1. Initial safety check (handling null/undefined blocks from the array)
  if (!block) {
    console.warn(
      `Attempted to render a null or undefined block at index ${index}.`,
    );
    return null;
  }

  // 2. Pass the block to the type-safe renderer.
  // The type safety checks now happen INSIDE BlockRenderer.
  return <BlockRenderer block={block} index={index} />;
}
