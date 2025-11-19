// packages/blocks/src/index.ts

// This file defines the public API for the @kit/blocks package.
// This is the one typescript actually sees

// (Re-export layout components for use in apps)

//export * from './components';
/*export * from './components/Callout';
export * from './components/DocLink';
export * from './components/Hero';
export * from './components/ImageFigure';
export * from './components/IntroWithImage';
export * from './components/MissionText';
export * from './components/OutcomeList';
export * from './components/PullQuote';
export * from './components/TeamStrip';
export * from './components/WorkText';
export { Callout } from './components/Callout';
export { DocLink } from './components/DocLink';
export { PullQuote } from './components/PullQuote';
export { OutcomeList } from './components/OutcomeList';
export { ImageFigure } from './components/ImageFigure';*/

// This line exposes all components from the 'cms' directory to the outside world,
export * from './cms'; 

// --- Export utility types and registry ---
//export * from './blockRegistry';
export * from './registry';

/*export type { 
    LayoutBlock, 
    BlockType,

    // Landing Page Props
    HeroProps,
    IntroWithImageProps,
    MissionTextProps,
    WorkTextProps,
    CaseGridProps,
    TeamStripProps,
    ContactFormProps,
    
    // Case Study/Content Props
    CalloutProps,
    PullQuoteProps,
    DocLinkProps,
    OutcomeListProps,
    ImageFigureProps
} from './types';*/

export * from './types';

export * from './components';