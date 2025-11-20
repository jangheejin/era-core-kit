import { jsx as _jsx } from "react/jsx-runtime";
import dynamic from 'next/dynamic'; // Next.js dynamic import
import { blockRegistry } from '@kit/blocks';
//Dynamically import all registered blocks with ssr: false. fixes the unstable_prefetch.mode error.
const dynamicBlockComponents = {};
for (const [key, Component] of Object.entries(blockRegistry)) {
    dynamicBlockComponents[key] = dynamic(() => Promise.resolve({ default: Component }), { ssr: false });
}
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
