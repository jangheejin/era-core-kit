//apps/site/app/sectors/(sector-pages)/[sector]/page.tsx

// THE ROOT ROUTE, /:sectorSlug

//A root dynamic route that only accepts sector slugs and makes the "prettier" urls
//Adding this so we can have pages like mainpage.com/<sector name> instead of mainpage.com/sector/<sector name>
// avoids rewrites entirely and keeps everything in TS where the mappings already exist
//
// WHAT THIS DOES:
// - catches /<sector name>
// - decides if that string is a valid sector slug
// - renders the exact same sector archive page

import { SECTOR_ROUTE_SLUG, sectorFromRouteSlug, tagSlug } from "@kit/schema";
import SectorPageView from "@sectors/SectorPageView";
import { TagPageClient } from "@tag/TagPageClient";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return Object.values(SECTOR_ROUTE_SLUG).map((sector) => ({ sector }));
}

export default async function RootSectorPage({
  params,
}: {
  params: { sector: string };
}) {
  const sector = sectorFromRouteSlug(params.sector);
  if (sector) {
    return <SectorPageView sectorSlug={params.sector} />;
  }

  const wanted = tagSlug(params.sector);
  if (!wanted) return notFound();
  return <TagPageClient tagSlugParam={params.sector} />;
}

/* export default function RootSectorPage({ params }: { params: { sector: string } }) {
  return <SectorPageView sectorSlug={params.sector} />;
}
 */
