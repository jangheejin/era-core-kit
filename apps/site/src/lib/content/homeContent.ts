// apps/site/src/content/homeContent.ts
import type {
  HeroProps,
  IntroWithImageProps,
  LayoutBlock,
  MissionTextProps,
  WorkWithCaseGridProps,
} from "@kit/blocks";

export type HomeWorkContent = WorkWithCaseGridProps & {
  itemsSource?: "featured" | "manual";
  caseStudySlugs: string[];
  featuredCaseStudySlugs: string[];
};

export type HomeContent = {
  hero: HeroProps;
  mission: MissionTextProps;
  intro: IntroWithImageProps;
  work: HomeWorkContent;
  sectionOrder: string[];
  extraSections: LayoutBlock[];
};

export const DEFAULT_HOME_CONTENT: HomeContent = {
  hero: {
    heading: "Welcome to a new era",
    subhead: "",
    text: "ERA Government Affairs, LLC is a premier government affairs, consulting and public affairs firm.",
    text2:
      "We solve problems, enhance your brand, offer strategic advice and leverage robust relationships to advance your interests in Washington D.C.",
    text3:
      "With years of experience working both in Congress and as government affairs professionals, we have a proud track record of getting legislation signed into law by working across the aisle with Congress, the Administration and their staff.",
    imageUrl: "/img/ERAgovaffairs.png",
  },
  mission: {
    heading: "Our Mission",
    text: "Our mission is to develop and maintain a close relationship with our clients, which means understanding their mission needs and objectives, and to jointly develop a targeted and pragmatic strategy to achieve them.",
    text2:
      "Since leaving government service, we have collectively represented, as lobbyists and advisors, a large geospatial industry association, non-geospatial-related industry associations, non-profit and charitable organizations, tribal governments, and individual companies, to name a few.",
  },
  intro: {
    heading: "Your voice in Washington",
    text: "We are a federal advocacy and business consultant team with expertise in federal policy on Capitol Hill as well as robust experience working with industry, the federal government and its programmatic efforts across myriad departments and agencies.",
    text2:
      "As former Senior Advisors to Members of the United States Senate, we have experience working on Congressional issues that include, but are not limited to, geospatial, natural resources, emergency management, and natural disaster response, agriculture, transportation, appropriations, and programmatic grant funding. As legislative leads in these areas, we worked closely with federal departments and agencies on related programs and efforts, as well as outside companies, foundations, non-profits, county, state, and tribal governments, among others.",
    imageUrl: "/img/capitol-building.jpg",
  },
  work: {
    heading: "FEATURED CASE STUDIES",
    layout: "3col",
    itemsSource: "featured",
    maxItems: 3,
    items: [],
    caseStudySlugs: [],
    featuredCaseStudySlugs: [],
  },
  sectionOrder: ["hero", "mission", "intro", "work"],
  extraSections: [],
};

export function buildHomeLayout(content: HomeContent): LayoutBlock[] {
  const baseBlocks: Record<string, LayoutBlock> = {
    hero: {
      type: "Hero",
      groupId: "home-intro",
      props: content.hero,
    },
    mission: {
      type: "MissionText",
      groupId: "home-intro",
      props: content.mission,
    },
    intro: {
      type: "IntroWithImage",
      groupId: "home-intro",
      props: content.intro,
    },
    work: {
      type: "WorkWithCaseGrid",
      props: content.work,
    },
  };

  const extrasById = new Map(
    content.extraSections
      .filter((block) => Boolean(block._key))
      .map((block) => [String(block._key), block]),
  );

  const order = content.sectionOrder.length
    ? content.sectionOrder
    : DEFAULT_HOME_CONTENT.sectionOrder;

  const blocks: LayoutBlock[] = [];
  for (const id of order) {
    const base = baseBlocks[id];
    if (base) {
      blocks.push(base);
      continue;
    }
    const extra = extrasById.get(id);
    if (extra) blocks.push(extra);
  }
  return blocks;
}

export function createExtraSection(id: string): LayoutBlock {
  return {
    type: "RichTextSection",
    _key: id,
    props: {
      heading: "New section",
      body: "Add supporting text for this section.",
      subheads: [],
      imageUrl: "",
    },
  };
}
