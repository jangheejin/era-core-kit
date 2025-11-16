// packages/adapters/sanity/src/index.ts


//export type { CMS } from '../../CMS';
export { createInMemoryCMS } from './inMemoryCMS';

export const sanityAdapter = {
  get: (slug: string) => {
    return {
      title: "Mock case study",
      slug,
      blocks: [
        { type: "callout", content: "This is a callout!" },
        { type: "pullQuote", content: "Big idea goes here" }
      ],
    };
  },
};