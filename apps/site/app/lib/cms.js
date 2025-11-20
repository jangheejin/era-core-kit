//single source of truth for accessing CMS in the apps/site Next.js app only
// apps/site/app/lib/cms.ts
//import { createInMemoryCMS } from '@kit/adapters-sanity';
import { InMemoryCMS } from '@kit/adapters-sanity';
//import type { CMS } from '../../../../packages/cms-contract/src/CMS';
let cms = null;
export function getCMS() {
    if (!cms) {
        cms = new InMemoryCMS();
        //    cms = createInMemoryCMS();
    }
    return cms;
}
