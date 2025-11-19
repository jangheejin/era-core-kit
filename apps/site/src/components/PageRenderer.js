// apps/site/src/components/PageRenderer.tsx
'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import BlockRenderer from '@/utils/BlockRenderer';
//    blocks: CMS.LayoutBlock[];
// Define  final component structure 
/**
 * Renders an array of LayoutBlocks on the client side.
 * Data is passed via props from the parent Server Component.
 */
export function PageRenderer({ blocks }) {
    if (!blocks || blocks.length === 0) {
        // Return a clean, non-crashing fallback.
        return _jsx("div", { className: "p-8 text-center text-gray-500", children: "No content blocks configured for this page. Check your CMS integration." });
    }
    return (_jsx("main", { children: blocks.map((block, index) => (_jsx(BlockRenderer
        // Use block._key for stability, fallback to index
        , { block: block, index: index }, block._key ?? index))) }));
}
