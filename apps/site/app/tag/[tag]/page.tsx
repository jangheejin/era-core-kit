// apps/site/app/tag/[tag]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCaseStudies } from "@/lib/caseStudies";
import { getCaseStudiesByTagRouteSlug, listTagRoutes } from "@/lib/caseStudiesPublic";
import { CASE_STUDIES_FIXTURE_CARDS, type CaseStudyType } from "@kit/schema";
import { tagSlug } from "@kit/schema";

/* function tagSlug(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
} */

/* export default async function TagArchivePage({
  params,
}: {
  params: { tag: string };
}) { */

function matchesTag(cs: CaseStudyType, tagParamSlug: string) {
  return (cs.tags ?? []).some((t) => tagSlug(t) === tagParamSlug);
}

export default async function TagPage({ params }: { params: { tag: string } }) {
  const tagParamSlug = params.tag;
  const wanted = tagSlug(params.tag);
  if (!wanted) return notFound();

  const all = await getCaseStudies();//FOR LATER!!!
  //const all: CaseStudyType[] = CASE_STUDIES_FIXTURE_CARDS;//TEMPORARY while cms is only demo

/*   const items = all.filter((cs) => {
    if (!cs.isPublic) return false;
    const tags = Array.isArray(cs.tags) ? cs.tags : [];
    return tags.some((t) => tagSlug(t) === wanted);
  }); */

  const items = all.filter((cs) => cs.isPublic && matchesTag(cs, tagParamSlug));

  if (items.length === 0) return notFound();
  
  // For display, use the first matching “pretty” tag string if we can find it
  const displayTag =
    items
      .flatMap((cs) => cs.tags ?? [])
      .find((t) => tagSlug(t) === wanted) ?? wanted;

  return (
    <main className="c-page">
      <h1 className="type-h2">Tag: {params.tag}</h1>

      {items.map((cs) => (
        <article key={cs.slug} className="card">
          <h2 className="type-h3">{cs.title}</h2>
          <p className="muted">{cs.summaryShort}</p>
        </article>
      ))}
    </main>
  );
}
