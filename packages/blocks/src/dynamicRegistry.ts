// packages/blocks/src/dynamicRegistry.ts

// PURE data only — no React components imported

//import dynamic from 'next/dynamic';

import type { BlockType } from './types';export const blockRegistry: Record<BlockType, string> = {
  Callout: 'Callout',
  callout: 'Callout',

  PullQuote: 'PullQuote',
  pullQuote: 'PullQuote',

  DocLink: 'DocLink',
  docLink: 'DocLink',

  OutcomeList: 'OutcomeList',
  outcomeList: 'OutcomeList',

  ImageFigure: 'ImageFigure',
  imageFigure: 'ImageFigure',

  Hero: 'Hero',
  MissionText: 'MissionText',
  WorkText: 'WorkText',
  CaseGrid: 'CaseGrid',
  TeamStrip: 'TeamStrip',
  IntroWithImage: 'IntroWithImage',
  ContactForm: 'ContactForm',
  contactForm: 'ContactForm',
};