// packages/blocks/src/index.ts

// Re-export layout components for use in apps
// This is the one typescript actually sees

export * from './components';
export * from './registry';
export type { 
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
} from './types';
//export { Callout } from './components/Callout';
