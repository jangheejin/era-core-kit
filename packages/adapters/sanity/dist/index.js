//import { createInMemoryCMS } from './inMemoryCMS';
import { InMemoryCMS } from './inMemoryCMS';
export { InMemoryCMS };
// Temporary implementation backed by the in-memory CMS fixture data.
// Swap this out for a real Sanity client when available.
//export const sanityAdapter: CMS = createInMemoryCMS();
export const sanityAdapter = new InMemoryCMS();
