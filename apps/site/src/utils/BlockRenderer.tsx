// apps/site/src/utils/BlockRenderer.tsx
"use client";

import React from 'react';
import dynamic from 'next/dynamic'; // Next.js dynamic import
import type { ComponentType } from 'react';

import { blockRegistry } from '@kit/blocks';
//import type { LayoutBlock } from '@kit/blocks';
import * as Components from '@kit/blocks/client';

// Define the props interface
interface BlockRendererProps {
  block: LayoutBlock;
  index: number;
}

type DynamicBlockMap = Record<string, ComponentType<any>>;

//Dynamically import all registered blocks with ssr: false. fixes the unstable_prefetch.mode error.

const dynamicBlockComponents: DynamicBlockMap = {};

for (const [key, Component] of Object.entries(blockRegistry)) {
  const Component = Components[componentName];
  dynamicBlockComponents[key] = dynamic(
    () => Promise.resolve({ default: Component }),
    { ssr: false }
  );
}

/**
 * Renders a layout block by dynamically loading the corresponding component on the client.
 */
export default function BlockRenderer({ block, index }: BlockRendererProps) {
  const Component = dynamicBlockComponents[block.type]; 

  if (!Component) {
    console.error(`Unknown block type encountered: ${block.type}`);
    return null;
  }
  
  // Render the dynamically imported component
  return <Component key={block._key ?? index} {...block.props} />;
}

