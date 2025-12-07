//apps/site/app/sectors/[sector]/page.tsx
import { notFound } from "next/navigation";
import { sectorFromRouteSlug } from "@kit/schema";
import { SECTOR_VALUES, type SectorValue } from "@kit/schema";
import { getCaseStudies } from "@/lib/caseStudies"; //TO DO: UPDATE LATER
//import { CASE_STUDIES_FIXTURE, type CaseStudyType } from "@kit/schema";//for now, since we don't have the real CMS, we will use fixtures from the demo CMS
import { CaseStudyCard } from "@/components/CaseStudyCard";

export default async function SectorArchivePage({ params, }: { params: { sector: string };}) {
  //const sector = sectorSlugToValue(params.sector);
  const sector = sectorFromRouteSlug(params.sector);
  if (!sector) return notFound();

  const all = await getCaseStudies(); // TO DO: UPDATE later
  const items = all.filter((cs) => cs.isPublic && cs.sectors?.includes(sector));

  return (
    <main className="c-page">
      <h1 className="type-h2">Sector: {sector}</h1>

      {items.length === 0 ? (
        <p className="muted">No public case studies in this sector yet.</p>
      ) : (
        
        <div className="case-grid">
          {items.map((cs) => (
            <CaseStudyCard key={cs.id} cs={cs} />
          ))}
        </div>
      )}
    </main>
  );
}


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