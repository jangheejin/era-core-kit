// packages/adapters/sanity/src/index.ts
import type { CMS } from '@kit/cms-contract';
import { InMemoryCMS } from './inMemoryCMS';
//import { createInMemoryCMS } from './inMemoryCMS';

export type { CMS } from '@kit/cms-contract';
export { InMemoryCMS };

// Temporary implementation backed by the in-memory CMS fixture data.
// Swap this out for a real Sanity client when available.

//maybe remove???????
export const sanityAdapter: CMS = new InMemoryCMS();

//"factory" style, using the class
export function createInMemoryCMS(): CMS {
  return new InMemoryCMS();
}