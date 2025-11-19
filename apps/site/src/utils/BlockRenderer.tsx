// apps/site/src/utils/BlockRenderer.tsx
//MUST NOT have 'use client'
//must run on the server to handle dynamic imports.

import React from 'react';
import dynamic from 'next/dynamic'; // Next.js dynamic import

//import { blockRegistry } from '@kit/blocks';
import { blockRegistry } from '@kit/blocks/src/dynamicRegistry';
//import { LayoutBlock } from '@kit/blocks';
import type { LayoutBlock } from '@kit/blocks';
/*import { 
  LayoutBlock, HeroProps, MissionTextProps, WorkTextProps, CaseGridProps, TeamStripProps, IntroWithImageProps, ContactFormProps, CalloutProps, PullQuoteProps, DocLinkProps, OutcomeListProps, ImageFigureProps 
} from '@kit/blocks';*/
import { 
  Hero
} from '@kit/blocks'

// Define the props interface
interface BlockRendererProps {
  block: LayoutBlock;
  index: number;
}


//Dynamically import all registered blocks with ssr: false. fixes the unstable_prefetch.mode error.
const dynamicBlockComponents = Object.fromEntries(
  Object.entries(blockRegistry).map(([type, Component]) => [
      type,
      dynamic(
        // dynamic() expects a function that returns a Promise resolving to a Component
        () => Promise.resolve(Component), 
        { 
          // This is the key: forces the component's bundle to skip Server-Side Rendering (SSR)
          ssr: false 
        }
      ),
  ])
);

/**
 * Renders a layout block by dynamically loading the corresponding component on the client.
 */
function BlockRenderer({ block, index }: BlockRendererProps) {
  const Component = dynamicBlockComponents[block.type]; 

  if (!Component) {
    console.error(`Unknown block type encountered: ${block.type}`);
    return null;
  }
  
  // Render the dynamically imported component
  return <Component key={block._key ?? index} {...block.props} />;
}

export default BlockRenderer;