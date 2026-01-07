// apps/site/src/components/HomeCmsCaseGridPreview.tsx
'use client';

import { CaseGrid } from '@kit/blocks';
import { useMockCMS } from '@/cms/mockCmsStore'; 
// OR useAdminCaseStudyStore, whatever the actual hook is

// This is the shape we need for CaseGrid
type CaseGridItem = {
  title: string;
  summary: string;
  imageUrl: string;
  slug: string;
};

export function HomeCmsCaseGridPreview() {
  // 
  const { items: caseStudies, add: addCaseStudy } = useMockCMS(); 

  if (!caseStudies || caseStudies.length === 0) {
    // Strict + explicit: if nothing in store, render nothing
    return null;
  }

  const featured = caseStudies.filter((cs) => cs.isFeaturedHome);

/*   const items: CaseGridItem[] = caseStudies.map((cs) => ({
    title: cs.title,
    summary: cs.summaryShort ?? cs.summary ?? '',
    imageUrl: cs.heroImageUrl || '/img/temp.svg',
    slug: cs.slug,
  })); */

  return (
/*     <section className="c-section" id="case-studies-demo">
      <div className="c-container c-stack">
        <h2 className="type-h2">Draft case studies (CMS demo)</h2>
        <p className="type-body type-muted">
          These cards are coming directly from the CMS demo (no real database yet).
        </p>

        <CaseGrid layout="4col" items={items} />
      </div>
    </section> */

    <CaseGrid
      layout="4col"
      items={featured.map((cs) => ({
        title: cs.title,
        summary: cs.summaryShort ?? "",
        imageUrl: cs.heroImage?.src ?? "/img/placeholder.webp",
        slug: cs.slug,
      }))}
    />
  );
}
