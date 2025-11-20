// packages/blocks/src/types.ts

// Creates only the type system that describes the blocks
// No imports (except for types later if needed) - NEVER imports a component
// Never re-exports anything from elsewhere here
//DATA MODEL AND PROPS LIVE HERE. components for rendering are defined in app.

// Generic shape for all blocks
/*export type GenericBlock<T extends string, P> = {
  type: T;
  props: P;
};*/

export type GenericBlock<T extends keyof BlockComponentProps> = {
  type: T;
  props: BlockComponentProps[T];
  _key?: string;
};


// Props for ALL layout block components (not case study ones only)

export type HeroProps = {
  heading: string;
  subhead: string;
  imageUrl: string;
};

export type IntroWithImageProps = {
  heading: string;
  text: string;
  imageUrl: string;
};

export type MissionTextProps = {
  heading: string;
  text: string;
  imageUrl: string; // <-- NEW
};

export type WorkTextProps = {
  heading: string;
  text: string;
};

export type CaseGridProps = {
  layout?: string;
  items: {
    title: string;
    summary: string;
    imageUrl: string;
    slug: string;
  }[];
};

export type TeamStripProps = {
  people: {
    name: string;
    role: string;
    imageUrl: string;
  }[];
};

export type ContactFormProps = {
  heading: string;
};

// Props for each CASE STUDY block component (do NOT define in component files)
export type CalloutProps = { content: string };
export type PullQuoteProps = { content: string };
export type DocLinkProps = { href: string; children: React.ReactNode };
export type OutcomeListProps = { outcomes: string[] };
export type ImageFigureProps = {
  src: string;
  alt: string;
  caption?: string;
};

// Union of block types for different layouts
//Landing page blocks
/*export type LandingBlock =
| GenericBlock<'Hero', HeroProps>
| GenericBlock<'MissionText', MissionTextProps>
| GenericBlock<'WorkText', WorkTextProps>
| GenericBlock<'CaseGrid', CaseGridProps>
| GenericBlock<'TeamStrip', TeamStripProps>
| GenericBlock<'IntroWithImage', IntroWithImageProps>
| GenericBlock<'ContactForm', ContactFormProps>;

//per-page blocks go here
export type CaseStudyBlock =
  | GenericBlock<'Callout', CalloutProps>
  | GenericBlock<'PullQuote', PullQuoteProps>
  | GenericBlock<'DocLink', DocLinkProps>
  | GenericBlock<'OutcomeList', OutcomeListProps>;


// Final exported layout block types
export type LayoutBlock = LandingBlock | CaseStudyBlock;

// helper
export type BlockType = LayoutBlock['type'];
*/
// helper: map of block names (aka keys) to their prop types
export type BlockComponentProps = {
  Callout: CalloutProps;
  callout: CalloutProps;
  PullQuote: PullQuoteProps;
  pullQuote: PullQuoteProps;
  DocLink: DocLinkProps;
  docLink: DocLinkProps;
  OutcomeList: OutcomeListProps;
  outcomeList: OutcomeListProps;
  ImageFigure: ImageFigureProps;
  imageFigure: ImageFigureProps;
  Hero: HeroProps;
  MissionText: MissionTextProps;
  WorkText: WorkTextProps;
  CaseGrid: CaseGridProps;
  TeamStrip: TeamStripProps;
  IntroWithImage: IntroWithImageProps;
//  ContactForm: ContactFormProps;
//  contactForm: ContactFormProps;
};


// All layout blocks (shared + landing)
export type LayoutBlock = {
  [K in keyof BlockComponentProps]: GenericBlock<K>
}[keyof BlockComponentProps];

export type BlockType = LayoutBlock['type'];