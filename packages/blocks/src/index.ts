// packages/blocks/src/index.ts

// Re-export layout components for use in apps
// This is the one typescript actually sees
//ONLY EXPORT TYPES AND UTILITIES HERE
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
//    ContactFormProps,
    
    // Case Study/Content Props
    CalloutProps,
    PullQuoteProps,
    DocLinkProps,
    OutcomeListProps,
    ImageFigureProps
} from './types';
//export { Callout } from './components/Callout';
export {
  Hero,
  IntroWithImage,
  MissionText,
  WorkText,
  CaseGrid,
  TeamStrip,
//  ContactForm,

  // Case Study components
  Callout,
  PullQuote,
  DocLink,
  OutcomeList,
  ImageFigure
} from './components';

export { blockRegistry } from './dynamicRegistry';
