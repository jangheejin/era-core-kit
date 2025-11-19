// apps/site/src/components/PageRenderer.tsx

'use client'; 

import React from 'react';
import type { LayoutBlock } from '@kit/blocks/types';
import BlockRenderer from '@/utils/BlockRenderer'; 
// MUST import the LayoutBlock type from the contract package

// Define the component's props interface
interface PageRendererProps {
    blocks: LayoutBlock[];
}
//    blocks: CMS.LayoutBlock[];

// Define  final component structure 
/**
 * Renders an array of LayoutBlocks on the client side.
 * Data is passed via props from the parent Server Component.
 */

export function PageRenderer({ blocks }: PageRendererProps) {
    if (!blocks || blocks.length === 0) {
        // Return a clean, non-crashing fallback.
        return <div className="p-8 text-center text-gray-500">No content blocks configured for this page. Check your CMS integration.</div>;
    }

    return (
        <main>
          {/* This loop is now correctly typed and scope-safe, fixing the TS2552 
            ("Cannot find name 'blocks'") and TS7006 (implicit 'any') errors previously seen.
          */}
          {blocks.map((block: LayoutBlock, index: number) => (
            <BlockRenderer 
              // Use block._key for stability, fallback to index
              key={block._key ?? index}
              block={block}
              index={index}
            />
          ))}
        </main>
    );
}