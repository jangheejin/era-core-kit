export type GenericBlock<T extends keyof BlockComponentProps> = {
    type: T;
    props: BlockComponentProps[T];
    _key?: string;
};
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
    imageUrl: string;
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
export type CalloutProps = {
    content: string;
};
export type PullQuoteProps = {
    content: string;
};
export type DocLinkProps = {
    href: string;
    children: React.ReactNode;
};
export type OutcomeListProps = {
    outcomes: string[];
};
export type ImageFigureProps = {
    src: string;
    alt: string;
    caption?: string;
};
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
    ContactForm: ContactFormProps;
    contactForm: ContactFormProps;
};
export type LayoutBlock = {
    [K in keyof BlockComponentProps]: GenericBlock<K>;
}[keyof BlockComponentProps];
export type BlockType = LayoutBlock['type'];
//# sourceMappingURL=types.d.ts.map