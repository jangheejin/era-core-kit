import { Callout } from './components/Callout';
import { PullQuote } from './components/PullQuote';
import { DocLink } from './components/DocLink';
import { OutcomeList } from './components/OutcomeList';
import { Hero } from './components/Hero';
import { MissionText } from './components/MissionText';
import { WorkText } from './components/WorkText';
import { CaseGrid } from './components/CaseGrid';
import { TeamStrip } from './components/TeamStrip';
import { IntroWithImage } from './components/IntroWithImage';
import { ContactForm } from './components/ContactForm';
import { ImageFigure } from './components/ImageFigure';
//export const blockRegistry: RegistryType = {
// Actual React components, registered by block type
/*export const blockRegistry: Record<BlockType, React.ComponentType<any>> = {
  Callout,
  callout: Callout, //alias
  PullQuote,
  pullQuote: PullQuote,//alias
  DocLink,
  docLink: DocLink,//alias
  OutcomeList,
  outcomeList: OutcomeList,//alias
  ImageFigure,
  imageFigure: ImageFigure,//alias
  Hero,
  MissionText,
  WorkText,
  CaseGrid,
  TeamStrip,
  IntroWithImage,
  ContactForm,
};
*/
export const blockRegistry = {
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
    Hero,
    MissionText,
    WorkText,
    CaseGrid,
    TeamStrip,
    IntroWithImage,
    ContactForm,
    contactForm: ContactForm,
};
