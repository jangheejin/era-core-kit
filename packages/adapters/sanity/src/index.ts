// packages/adapters/sanity/src/index.ts
import type { CMS } from '@kit/cms-contract';
//import { createInMemoryCMS } from './inMemoryCMS';
import { InMemoryCMS } from './inMemoryCMS';

export type { CMS } from '@kit/cms-contract';
export { InMemoryCMS };

// Temporary implementation backed by the in-memory CMS fixture data.
// Swap this out for a real Sanity client when available.

export const sanityAdapter: CMS = new InMemoryCMS();