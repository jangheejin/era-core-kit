import { jsx as _jsx } from "react/jsx-runtime";
import dynamic from 'next/dynamic'; // Next.js dynamic import
//import { blockRegistry } from '@kit/blocks';
import { blockRegistry } from '@kit/blocks/src/dynamicRegistry';
//Dynamically import all registered blocks with ssr: false. fixes the unstable_prefetch.mode error.
const dynamicBlockComponents = Object.fromEntries(Object.entries(blockRegistry).map(([type, Component]) => [
    type,
    dynamic(
    // dynamic() expects a function that returns a Promise resolving to a Component
    () => Promise.resolve(Component), {
        // This is the key: forces the component's bundle to skip Server-Side Rendering (SSR)
        ssr: false
    }),
]));
/**
 * Renders a layout block by dynamically loading the corresponding component on the client.
 */
function BlockRenderer({ block, index }) {
    const Component = dynamicBlockComponents[block.type];
    if (!Component) {
        console.error(`Unknown block type encountered: ${block.type}`);
        return null;
    }
    // Render the dynamically imported component
    return _jsx(Component, { ...block.props }, block._key ?? index);
}
export default BlockRenderer;
