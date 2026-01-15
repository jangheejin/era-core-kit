// apps/site/app/our-work/[slug]/page.tsx

// Server wrapper. The case-study content for the demo is driven by the browser store.

import OurWorkDetailClient from "./OurWorkDetailClient";

export default function OurWorkDetailPage({ params }: { params: { slug: string } }) {
  return <OurWorkDetailClient slug={params.slug} />;
}
