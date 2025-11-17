import { jsx as _jsx } from "react/jsx-runtime";
import BlockRenderer from './BlockRenderer';
export function renderBlock(block, index) {
    // 1. Initial safety check (handling null/undefined blocks from the array)
    if (!block) {
        console.warn(`Attempted to render a null or undefined block at index ${index}.`);
        return null;
    }
    // 2. Pass the block to the type-safe renderer.
    // The type safety checks now happen INSIDE BlockRenderer.
    return _jsx(BlockRenderer, { block: block, index: index });
}
