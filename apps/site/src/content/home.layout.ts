// apps/site/src/content/home.layout.ts
import type { LayoutBlock } from "@kit/blocks";

export const homeLayout: LayoutBlock[] = [
  {
    type: "Hero",
    props: {
      heading: "Welcome to a new era",
      subhead: "",
      text: "ERA Government Affairs, LLC is a premier government affairs, consulting and public affairs firm.",
      text2:
        "We solve problems, enhance your brand, offer strategic advice and leverage robust relationships to advance your interests in Washington D.C.",
      text3:
        "With years of experience working both in Congress and as government affairs professionals, we have a proud track record of getting legislation signed into law by working across the aisle with Congress, the Administration and their staff.",
      imageUrl: "/img/ERAgovaffairs.png",
    },
  },
  {
    type: "IntroWithImage",
    props: {
      heading: "Your voice in Washington",
      text: "We are a federal advocacy and business consultant team with expertise in federal policy on Capitol Hill as well as robust experience working with industry, the federal government and its programmatic efforts across myriad departments and agencies.",
      //      text2: "Our mission is to develop and maintain a close relationship our clients, which means understanding their mission needs and objectives, and to jointly develop a targeted and pragmatic strategy to achieve them.",
      imageUrl: "/img/capitol-building.jpg", // Move here
    },
  },
  {
    type: "MissionText",
    props: {
      heading: "Our Mission",
      text: "ERA Government Affairs is a federal advocacy and business consulting team with expertise in federal policy on Capitol Hill and extensive experience working with industry, the federal government, and relevant programmatic efforts across various departments and agencies.",
      text2:
        "Our mission is to develop and maintain a close relationship our clients, which means understanding their mission needs and objectives, and to jointly develop a targeted and pragmatic strategy to achieve them.",
    },
  },
  {
    type: "WorkWithCaseGrid",
    props: {
      heading: "Our Work",
      text: "As former Senior Advisors to Members of the United States Senate, we have experience working on Congressional issues that include, but are not limited to, geospatial, natural resources, emergency management, and natural disaster response, agriculture, transportation, appropriations, and programmatic grant funding. As legislative leads in these areas, we worked closely with federal departments and agencies on related programs and efforts, as well as outside companies, foundations, non-profits, county, state, and tribal governments, among others.",
      text2:
        "Since leaving government service, we have collectively represented, as lobbyists and advisors, a large geospatial industry association, non-geospatial-related industry associations, non-profit and charitable organizations, tribal governments, and individual companies, to name a few.",
      gridHeading: "Selected Case Studies",
      layout: "4col",

      itemsSource: "featured",
      maxItems: 6,
      items: [],
    },
  },
  /* {
    type: "WorkWithCaseGrid",
    props: {
      heading: "Our Work",
      text: "As former Senior Advisors to Members of the United States Senate, we have experience working on Congressional issues that include, but are not limited to, geospatial, natural resources, emergency management, and natural disaster response, agriculture, transportation, appropriations, and programmatic grant funding. As legislative leads in these areas, we worked closely with federal departments and agencies on related programs and efforts, as well as outside companies, foundations, non-profits, county, state, and tribal governments, among others.",
      text2:
        "Since leaving government service, we have collectively represented, as lobbyists and advisors, a large geospatial industry association, non-geospatial-related industry associations, non-profit and charitable organizations, tribal governments, and individual companies, to name a few.",
      gridHeading: "Selected Case Studies",
      layout: "4col",

      itemsSource: "featured",
      maxItems: 6,
      items: [
        {
          primarySector: "Geospatial",
          sectors: [
            "Geospatial", "GovContracting", "EmergencyMgmt", 
            "PrivateSector",
            "Appropriations", "GrantFunding",
          ],
          client: "Sanborn + AppGeo",
          //summary: "Sanborn + AppGeo",
          imageUrl: "/img/case1.webp",
          slug: "sanborn-appgeo",
        },
        {
          primarySector: "Nonprofit",
          sectors: ["Nonprofit", "GovContracting", "Geospatial", 
            "PublicSector", "EmergencyMgmt",
            "Appropriations", "GrantFunding",
          ],
          client: "NAPSG Foundation",
          //summary: "NAPSG Foundation",
          imageUrl: "/img/case2.webp",
          slug: "napsg-foundation",
        },
        {
          primarySector: "GovContracting",
          sectors: [
            "GovContracting", "Industry", 
            "Manufacturing", "PrivateSector",
            "Appropriations",
          ],
          client: "Crucis",
          //summary: "Crucis",
          imageUrl: "/img/case3.webp",
          slug: "crucis",
        },
        {
          primarySector: "EmergencyMgmt",
          sectors: [
            "EmergencyMgmt", "Manufacturing", "Defense",
            "Industry", "PrivateSector",
            "Appropriations",
          ],
          client: "MKR Fabricators",
          //summary: "MKR Fabricators",
          imageUrl: "/img/temp.svg",
          slug: "mkr-fabricators",
        },
        {
          primarySector: "Education",
          sectors: ["Education", "Nonprofit"],
          client: "STEMheads",
          //summary: "MKR Fabricators",
          imageUrl: "/img/temp2.svg",
          slug: "stemheads",
        },
        {
          primarySector: "Agriculture",
          sectors: [
            "Agriculture", "Energy", "Health", "Defense", "Transportation", "NaturalResources",
            "PublicSector", "StateGovernment", "LocalGovernment", "TribalGovernment",
            "Environment", "Infrastructure", "PublicWorks", "CivicTech",
            "Appropriations", "GrantFunding",
          ],
          client: "Placeholder Org",
          //summary: "MKR Fabricators",
          imageUrl: "/img/temp.svg",
          slug: "non-profit",
        },
      ],
    },
  }, */
  /* COMBINING WORKTEXT AND CASEGRID INTO ONE SECTION
  {
    type: "WorkText",
    props: {
      heading: "Our Mission",
      text: "Our mission is to develop and maintain a close relationship our clients, which means understanding their mission needs and objectives, and to jointly develop a targeted and pragmatic strategy to achieve them. We work across disciplines and jurisdictions, helping clients navigate agencies, secure funding, and shape policy outcomes.",
    },
  },
  {
    type: "CaseGrid",
    props: {
      layout: "4col",
      items: [
        { 
          title: "Geospatial Solutions", 
          summary: "Sanborn + AppGeo",
          imageUrl: '/img/case1.webp',
          slug: 'sanborn-appgeo',
        },
        {
          title: "Nonprofit Organizations", 
          summary: "NAPSG Foundation",
          imageUrl: '/img/case2.webp',
          slug: 'napsg-foundation',
        },
        {
          title: "Government Contracting", 
          summary: "Crucis",
          imageUrl: '/img/case3.webp',
          slug: 'crucis',
        },
        { 
          title: "Emergency Response", 
          summary: "MKR Fabricators",
          imageUrl: '/img/temp.svg',
          slug: 'mkr-fabricators',
        },
      ],
    },
  }*/
  /*,
  {
    type: "ContactForm",
    props: {
      heading: "We’re here to advance your interests",
    },
  },*/
];
export const workTextProps = {
  heading: "Our Work",
  text: "As former Senior Advisors to Members of the United States Senate, we have experience working on Congressional issues that include, but are not limited to, geospatial, natural resources, emergency management, and natural disaster response, agriculture, transportation, appropriations, and programmatic grant funding. As legislative leads in these areas, we worked closely with federal departments and agencies on related programs and efforts, as well as outside companies, foundations, non-profits, county, state, and tribal governments, among others.",
  text2:
    "Since leaving government service, we have collectively represented, as lobbyists and advisors, a large geospatial industry association, non-geospatial-related industry associations, non-profit and charitable organizations, tribal governments, and individual companies, to name a few.",
} as const;

export const caseGridProps = {
  layout: "4col" as const,
  items: [
    {
      title: "Geospatial Solutions",
      summary: "Sanborn + AppGeo",
      imageUrl: "/img/case1.webp",
      slug: "sanborn-appgeo",
    },
    {
      title: "Nonprofit Organizations",
      summary: "NAPSG Foundation",
      imageUrl: "/img/case2.webp",
      slug: "napsg-foundation",
    },
    {
      title: "Government Contracting",
      summary: "Crucis",
      imageUrl: "/img/case3.webp",
      slug: "crucis",
    },
    {
      title: "Emergency Response",
      summary: "MKR Fabricators",
      imageUrl: "/img/temp.svg",
      slug: "mkr-fabricators",
    },
  ],
} as const;
