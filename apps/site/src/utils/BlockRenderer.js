// apps/site/src/utils/BlockRenderer.tsx
'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { blockRegistry } from '@kit/blocks';
// Define the BlockRenderer functional component
function BlockRenderer({ block, index }) {
    // The switch forces TypeScript to correctly correlate 'block.type' with 'block.props'
    switch (block.type) {
        case 'Hero': {
            const Component = blockRegistry.Hero; // Component is guaranteed to be React.FC<HeroProps>
            return _jsx(Component, { ...block.props }, index);
        }
        case 'MissionText': {
            const Component = blockRegistry.MissionText;
            return _jsx(Component, { ...block.props }, index);
        }
        case 'WorkText': {
            const Component = blockRegistry.WorkText;
            return _jsx(Component, { ...block.props }, index);
        }
        case 'CaseGrid': {
            const Component = blockRegistry.CaseGrid;
            return _jsx(Component, { ...block.props }, index);
        }
        case 'TeamStrip': {
            const Component = blockRegistry.TeamStrip;
            return _jsx(Component, { ...block.props }, index);
        }
        case 'IntroWithImage': {
            const Component = blockRegistry.IntroWithImage;
            return _jsx(Component, { ...block.props }, index);
        }
        case 'ContactForm': {
            const Component = blockRegistry.ContactForm;
            return _jsx(Component, { ...block.props }, index);
        }
        case 'callout':
        case 'Callout': { //CMS ITEMS NEED DUAL CASING BECAUSE OF HOW THE CMS STUFF WORKS IDK
            const Component = blockRegistry.Callout;
            return _jsx(Component, { ...block.props }, index);
        }
        case 'pullQuote':
        case 'PullQuote': {
            const Component = blockRegistry.PullQuote;
            return _jsx(Component, { ...block.props }, index);
        }
        case 'docLink':
        case 'DocLink': {
            const Component = blockRegistry.DocLink;
            return _jsx(Component, { ...block.props }, index);
        }
        case 'outcomeList':
        case 'OutcomeList': {
            const Component = blockRegistry.OutcomeList;
            return _jsx(Component, { ...block.props }, index);
        }
        case 'imageFigure':
        case 'ImageFigure': {
            const Component = blockRegistry.ImageFigure;
            return _jsx(Component, { ...block.props }, index);
        }
        // YOU MUST ADD ALL DEFINED BLOCK TYPES HERE to achieve exhaustiveness.
        default: {
            // BUILD-TIME FAILSAFE: This line will throw a TypeScript error 
            // if a new type is added to LayoutBlock but not handled above.
            const exhaustiveCheck = block;
            console.error(`Unknown block type encountered: ${exhaustiveCheck.type}`);
            return null;
        }
    }
}
export default BlockRenderer;
