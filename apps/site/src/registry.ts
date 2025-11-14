// apps/site/src/registry.ts
import { Hero } from './components/sections/Hero';
import { CaseGrid } from './components/sections/CaseGrid';
import { TeamStrip } from './components/sections/TeamStrip';
import { MissionText } from './components/sections/MissionText';
import { WorkText } from './components/sections/WorkText';
import { ContactForm } from './components/sections/ContactForm';
import type { LayoutBlock } from '@/types/layout';
import { IntroWithImage } from './components/sections/IntroWithImage';

export const sectionRegistry: {
  [K in LayoutBlock['type']]: React.FC<Extract<LayoutBlock, { type: K }>['props']>;
} = {
  Hero,
  MissionText,
  WorkText,
  CaseGrid,
  TeamStrip,
  ContactForm,
  IntroWithImage,
  //etc
};