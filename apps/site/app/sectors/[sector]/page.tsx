//apps/site/app/sectors/[sector]/page.tsx

// use the component, SectorPageView, into which we extracted the actual page UI
// in the existing /sectors/[sector] route
// this is the canonical sector archive route

import { SECTOR_ROUTE_SLUG } from "@kit/schema";
import SectorPageView from "../SectorPageView";

export async function generateStaticParams() {
  return Object.values(SECTOR_ROUTE_SLUG).map((sector) => ({ sector }));
}

export default async function SectorArchivePage({
  params,
}: {
  params: { sector: string };
}) {
  return <SectorPageView sectorSlug={params.sector} />;
}

/* export default function SectorPage({ params }: { params: { sector: string } }) {
  return <SectorPageView sectorSlug={params.sector} />;
} */
/* 
import { notFound } from "next/navigation";
import { sectorFromRouteSlug } from "@kit/schema";
import { SECTOR_VALUES, type SectorValue } from "@kit/schema";
import { getCaseStudies } from "@/lib/caseStudies"; //TO DO: UPDATE LATER
//import { CASE_STUDIES_FIXTURE, type CaseStudyType } from "@kit/schema";//for now, since we don't have the real CMS, we will use fixtures from the demo CMS
import { CaseStudyCard } from "@components/CaseStudyCard";
import { getCaseStudiesBySectorRouteSlug } from "@/lib/caseStudies";
import { SECTOR_ROUTE_SLUG } from "@kit/schema";
import { ContextBanner } from "@admin/components/ContextBanner";
import Link from "next/link";
import { CaseStudyFull } from "@components/CaseStudyFullRender";
import { CaseStudyCollapsibleCard } from "@components/CaseStudyCollapsibleCard";


import "@styles/admin-cms-buttons.css";
import "@styles/admin-cms.css";

export async function generateStaticParams() {
  // prebuild all sector archive pages
  return Object.values(SECTOR_ROUTE_SLUG).map((sector) => ({ sector }));
}

export default async function SectorArchivePage({ params, }: { params: { sector: string };}) {
  //const sector = sectorSlugToValue(params.sector);
  //const sector = sectorFromRouteSlug(params.sector);
  const { sector, items } = await getCaseStudiesBySectorRouteSlug(params.sector);
  if (!sector) return notFound();

  const all = await getCaseStudies(); // TO DO: UPDATE later
  //const items = all.filter((cs) => cs.isPublic && cs.sectors?.includes(sector));

  return (
    <main className="c-admin">
      <ContextBanner view="preview">You are now viewing all of the case studies in the <strong>{sector}</strong> category
      </ContextBanner>
      <div className="card card-new mt1">
        <div className="mb">
          <h1 className="type-h1-over type-gray">Sector: {sector}</h1>
        </div>
        <div className="mb">
          <p className="muted" style={{ marginTop: ".25rem" }}>
            Click a case study preview card to expand the full write-up.
          </p>
        </div>

        {items.length === 0 ? (
          <p className="muted">No public case studies in this sector yet.</p>
        ) : (
          
          <div className="case-grid">
            {items.map((cs) => (
              <CaseStudyCollapsibleCard key={cs.id} cs={cs} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
} */

/*   return (
    <main className="c-page">
      <h1 className="type-h2">Sector: {sector}</h1>

      {items.map((cs) => (
        <article key={cs.slug} className="card">
          <h2 className="type-h3">{cs.title}</h2>
          <p className="muted">{cs.summaryShort}</p>

        </article>
      ))}
    </main>
  ); 
}
*/
