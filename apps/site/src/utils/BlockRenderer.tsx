// apps/site/src/utils/BlockRenderer.tsx
type _DEBUG_BlockTypes = LayoutBlock["type"];
import React from "react";
import { blockRegistry } from "@kit/blocks";
import { LayoutBlock } from "@kit/blocks";

interface BlockRendererProps {
  block: LayoutBlock;
  index: number;
}

function BlockRenderer({ block, index }: BlockRendererProps) {
  // The switch forces TypeScript to correctly correlate 'block.type' with 'block.props'
  switch (block.type) {
    case "Hero": {
      const Component = blockRegistry.Hero; // Component is guaranteed to be React.FC<HeroProps>
      return <Component key={index} {...block.props} />;
    }
    case "MissionText": {
      const Component = blockRegistry.MissionText;
      return <Component key={index} {...block.props} />;
    }
    case "WorkText": {
      const Component = blockRegistry.WorkText;
      return <Component key={index} {...block.props} />;
    }
    case "CaseGrid": {
      const Component = blockRegistry.CaseGrid;
      return <Component key={index} {...block.props} />;
    }
    case "TeamStrip": {
      const Component = blockRegistry.TeamStrip;
      return <Component key={index} {...block.props} />;
    }
    case "IntroWithImage": {
      const Component = blockRegistry.IntroWithImage;
      return <Component key={index} {...block.props} />;
    }
    case "ContactForm": {
      const Component = blockRegistry.ContactForm;
      return <Component key={index} {...block.props} />;
    }
    case "callout":
    case "Callout": {
      //CMS ITEMS NEED DUAL CASING BECAUSE OF HOW THE CMS STUFF WORKS IDK
      const Component = blockRegistry.Callout;
      return <Component key={index} {...block.props} />;
    }
    case "pullQuote":
    case "PullQuote": {
      const Component = blockRegistry.PullQuote;
      return <Component key={index} {...block.props} />;
    }
    case "docLink":
    case "DocLink": {
      const Component = blockRegistry.DocLink;
      return <Component key={index} {...block.props} />;
    }
    case "outcomeList":
    case "OutcomeList": {
      const Component = blockRegistry.OutcomeList;
      return <Component key={index} {...block.props} />;
    }
    case "imageFigure":
    case "ImageFigure": {
      const Component = blockRegistry.ImageFigure;
      return <Component key={index} {...block.props} />;
    }
    // YOU MUST ADD ALL DEFINED BLOCK TYPES HERE to achieve exhaustiveness.

    default: {
      // BUILD-TIME FAILSAFE: This line will throw a TypeScript error
      // if a new type is added to LayoutBlock but not handled above.
      const exhaustiveCheck: never = block;
      console.error(
        `Unknown block type encountered: ${(exhaustiveCheck as LayoutBlock).type}`,
      );
      return null;
    }
  }
}

export default BlockRenderer;
