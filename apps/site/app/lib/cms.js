//single source of truth for accessing CMS in the apps/site Next.js app only
// apps/site/app/lib/cms.ts
import { createInMemoryCMS } from '@kit/adapters-sanity';
let cms = null;
export function getCMS() {
    if (!cms) {
        cms = createInMemoryCMS();
    }
    return cms;
}
