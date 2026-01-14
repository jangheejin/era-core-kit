//apps/site/app/case-studies/[slug]/page.tsx

// now a server wrapper

import CaseStudyPublicClient from "./CaseStudyPublicClient";

export default function CaseStudyPublicPage({
  params,
}: {
  params: { slug: string };
}) {
  return <CaseStudyPublicClient slug={params.slug} />;
}
