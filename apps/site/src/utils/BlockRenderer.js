// apps/site/src/utils/BlockRenderer.tsx
"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { Hero, MissionText, WorkText, CaseGrid, TeamStrip, IntroWithImage, ContactForm, Callout, PullQuote, DocLink, OutcomeList, ImageFigure, } from '@kit/blocks';
const blockComponents = {
    Hero,
    MissionText,
    WorkText,
    CaseGrid,
    TeamStrip,
    IntroWithImage,
    ContactForm,
    contactForm: ContactForm,
    Callout,
    callout: Callout,
    PullQuote,
    pullQuote: PullQuote,
    DocLink,
    docLink: DocLink,
    OutcomeList,
    outcomeList: OutcomeList,
    ImageFigure,
    imageFigure: ImageFigure,
};
export default function BlockRenderer({ block, index }) {
    const Component = blockComponents[block.type];
    if (!Component) {
        console.error(`Unknown block type: ${block.type}`);
        return null;
    }
    return _jsx(Component, { ...block.props }, block._key ?? index);
}
