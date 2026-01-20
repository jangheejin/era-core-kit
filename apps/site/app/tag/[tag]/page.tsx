// apps/site/app/tag/[tag]/page.tsx
import { notFound } from "next/navigation";
import { tagSlug } from "@kit/schema";
import { getCaseStudiesByTagRouteSlug } from "@/lib/caseStudies";
import { TagPageClient } from "../TagPageClient";

export default async function TagPage({ params }: { params: { tag: string } }) {
  const wanted = tagSlug(params.tag);
  if (!wanted) return notFound();

  const fallbackItems = await getCaseStudiesByTagRouteSlug(wanted);

  return (
    <TagPageClient tagSlugParam={params.tag} fallbackItems={fallbackItems} />
  );
}
