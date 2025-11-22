// apps/site/src/content/home.layout.ts
import type { LayoutBlock } from '@kit/blocks';

export const homeLayout: LayoutBlock[] = [
  {
    type: "Hero",
    props: {
      heading: "Welcome to a new era",
      subhead: "",
      text: "ERA Government Affairs, LLC is a premier government affairs, consulting and public affairs firm.",
      text2: "We solve problems, enhance your brand, offer strategic advice and leverage robust relationships to advance your interests in Washington D.C.",
      text3: "With years of experience working both in Congress and as government affairs professionals, we have a proud track record of getting legislation signed into law by working across the aisle with Congress, the Administration and their staff.",
      imageUrl: "/img/ERAgovaffairs.png",
    },
  },
  {
    type: "IntroWithImage",
    props: {
      heading: "Your voice in Washington",
      text: "We are a federal advocacy and business consultant team with expertise in federal policy on Capitol Hill as well as robust experience working with industry, the federal government and its programmatic efforts across myriad departments and agencies.",
//      text2: "Our mission is to develop and maintain a close relationship our clients, which means understanding their mission needs and objectives, and to jointly develop a targeted and pragmatic strategy to achieve them.",
      imageUrl: '/img/capitol-building.jpg', // Move here
    }
  },
  {
    type: "MissionText",
    props: {
      heading: "Our Mission",
      text: "We are a federal advocacy and business consultant team with expertise in federal policy on Capitol Hill as well as robust experience working with industry, the federal government and its programmatic efforts across myriad departments and agencies.",
      text2: "Our mission is to develop and maintain a close relationship our clients, which means understanding their mission needs and objectives, and to jointly develop a targeted and pragmatic strategy to achieve them.",
    },
  },
  {
    type: 'WorkWithCaseGrid',
    props: {
      heading: 'Our Work',
      text: 'Our mission is to develop and maintain a close relationship our clients, which means understanding their mission needs and objectives, and to jointly develop a targeted and pragmatic strategy to achieve them. We work across disciplines and jurisdictions, helping clients navigate agencies, secure funding, and shape policy outcomes.',
      layout: '4col',
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
      ]
    }
  },
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
  heading: 'Our Mission',
  text:
    'Our mission is to develop and maintain a close relationship with our clients, which means understanding their mission needs and objectives, and jointly developing a targeted and pragmatic strategy to achieve them. We work across disciplines and jurisdictions, helping clients navigate agencies, secure funding, and shape policy outcomes.',
} as const;

export const caseGridProps = {
  layout: '4col' as const,
  items: [
    {
      title: 'Geospatial Solutions',
      summary: 'Sanborn + AppGeo',
      imageUrl: '/img/case1.webp',
      slug: 'sanborn-appgeo',
    },
    {
      title: 'Nonprofit Organizations',
      summary: 'NAPSG Foundation',
      imageUrl: '/img/case2.webp',
      slug: 'napsg-foundation',
    },
    {
      title: 'Government Contracting',
      summary: 'Crucis',
      imageUrl: '/img/case3.webp',
      slug: 'crucis',
    },
    {
      title: 'Emergency Response',
      summary: 'MKR Fabricators',
      imageUrl: '/img/temp.svg',
      slug: 'mkr-fabricators',
    },
  ],
} as const;