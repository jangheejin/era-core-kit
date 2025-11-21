// apps/site/src/utils/BlockRenderer.tsx
"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { Hero, IntroWithImage, MissionText, WorkText, CaseGrid, TeamStrip, Callout, PullQuote, DocLink, OutcomeList, ImageFigure, } from "@kit/blocks";
// Map each allowed block type to its React component.
// Note: lowercase aliases share the same component.
const componentMap = {
    Hero,
    IntroWithImage,
    MissionText,
    WorkText,
    CaseGrid,
    TeamStrip,
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
    // No ContactForm here on purpose
};
export default function BlockRenderer({ block, index }) {
    const Component = componentMap[block.type];
    if (!Component) {
        if (process.env.NODE_ENV !== "production") {
            console.error(`[BlockRenderer] Unknown block type: ${block.type}`);
        }
        return null;
    }
    return _jsx(Component, { ...block.props }, block._key ?? index);
}
