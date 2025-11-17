//single source of truth for accessing CMS in the apps/site Next.js app only
// apps/site/app/lib/cms.ts
//import { createInMemoryCMS } from '@kit/adapters/in-memory';
import { createInMemoryCMS } from '@kit/adapters-sanity';

import type { CMS } from '@kit/cms-contract';
//import type { CMS } from '@kit/adapters-sanity';
//import type { CMS } from '@kit/adapters/CMS'; 
let cms: CMS | null = null;

export function getCMS(): CMS {
  if (!cms) {
    cms = createInMemoryCMS();
  }
  return cms;
}
