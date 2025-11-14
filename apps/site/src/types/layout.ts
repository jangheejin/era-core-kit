// types/layout.ts
// Define prop types for each section
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

// Define a discriminated union for layout blocks
export type LayoutBlock =
  | { type: 'Hero'; props: HeroProps }
  | { type: 'MissionText'; props: MissionTextProps }
  | { type: 'WorkText'; props: WorkTextProps }
  | { type: 'CaseGrid'; props: CaseGridProps }
  | { type: 'TeamStrip'; props: TeamStripProps }
  | { type: 'IntroWithImage'; props: IntroWithImageProps }
  | { type: 'ContactForm'; props: ContactFormProps };

// Keys that are allowed in the registry
export type SectionKey = LayoutBlock['type'];
