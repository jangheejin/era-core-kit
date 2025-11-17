//apps/site/src/lib/cms.ts

//import { sanityAdapter } from '@kit/adapters/sanity';
//import { sanityAdapter } from '../../../packages/adapters/sanity';
import { sanityAdapter } from '@kit/adapters-sanity';

//export const cms = null;
//export const cms = sanityAdapter;

type CmsStub = {
    // Add methods you actually call, if any, so TypeScript stops complaining.
    // For now, all of them just throw or no-op.
    // Example:
    // getPage: (...args: any[]) => Promise<never>;
  };
  
  export const cms: CmsStub = {
    // getPage: async () => {
    //   throw new Error('CMS is not configured in this deployment.');
    // },
  } as any;