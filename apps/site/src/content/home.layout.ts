// apps/site/src/content/home.layout.ts
import type { LayoutBlock } from '@kit/blocks';

export const homeLayout: LayoutBlock[] = [
  {
    type: "Hero",
    props: {
      heading: "Welcome to a new era",
      subhead: "Your voice in Washington",
      imageUrl: "/img/ERAgovaffairs.png",
    },
  },
  {
    type: "MissionText",
    props: {
      heading: "Your voice in Washington",
      text: "We are a federal advocacy and business consultant team with expertise in federal policy on Capitol Hill as well as robust experience working with industry, the federal government and its programmatic efforts across myriad departments and agencies.",
      imageUrl: "/img/capitol-building.jpg", // Move here
    },
  },
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
  },
  {
    type: "ContactForm",
    props: {
      heading: "We’re here to advance your interests",
    },
  },
];
