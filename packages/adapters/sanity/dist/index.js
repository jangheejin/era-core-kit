import { createInMemoryCMS } from './inMemoryCMS';
export { createInMemoryCMS };
// Temporary implementation backed by the in-memory CMS fixture data.
// Swap this out for a real Sanity client when available.
export const sanityAdapter = createInMemoryCMS();
