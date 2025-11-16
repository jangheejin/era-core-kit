// packages/blocks/src/registry.ts

import type { LayoutBlock } from "./types";

import { Callout } from "./components/Callout";
import { PullQuote } from "./components/PullQuote";
import { DocLink } from "./components/DocLink";
import { OutcomeList } from "./components/OutcomeList";

import { Hero } from "./components/Hero";
import { MissionText } from "./components/MissionText";
import { WorkText } from "./components/WorkText";
import { CaseGrid } from "./components/CaseGrid";
import { TeamStrip } from "./components/TeamStrip";
import { IntroWithImage } from "./components/IntroWithImage";
import { ContactForm } from "./components/ContactForm";
import { ImageFigure } from "./components/ImageFigure";

// 💡 This builds a map from block type string → props type
type RegistryType = {
  [K in LayoutBlock["type"]]: React.FC<
    Extract<LayoutBlock, { type: K }>["props"]
  >;
};

export const blockRegistry: RegistryType = {
  Callout,
  callout: Callout, //alias
  PullQuote,
  pullQuote: PullQuote, //alias
  DocLink,
  docLink: DocLink, //alias
  OutcomeList,
  outcomeList: OutcomeList, //alias
  ImageFigure,
  imageFigure: ImageFigure, //alias
  Hero,
  MissionText,
  WorkText,
  CaseGrid,
  TeamStrip,
  IntroWithImage,
  ContactForm,
};
