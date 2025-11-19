//single source of truth for accessing CMS in the apps/site Next.js app only
// apps/site/app/lib/cms.ts
//import { createInMemoryCMS } from '@kit/adapters-sanity';
import { InMemoryCMS } from '@kit/adapters-sanity';
//import type { CMS } from '@kit/adapters-sanity';
//import type { CMS } from '@kit/adapters/CMS'; 
import type { CMS } from '@kit/cms-contract';

let cms: CMS | null = null;

export function getCMS(): CMS {
  if (!cms) {
    cms = new InMemoryCMS();
//    cms = createInMemoryCMS();
  }
  return cms;
}
