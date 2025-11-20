import { InMemoryCMS } from './inMemoryCMS';
export { InMemoryCMS };
// Temporary implementation backed by the in-memory CMS fixture data.
// Swap this out for a real Sanity client when available.
//maybe remove???????
export const sanityAdapter = new InMemoryCMS();
//"factory" style, using the class
export function createInMemoryCMS() {
    return new InMemoryCMS();
}
