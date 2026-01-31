//apps/site/app/admin/case-studies/edit/[slug]/page.tsx

// server wrapper

import EditCaseStudyClient from "./EditCaseStudyClient";

export default function EditCaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  return <EditCaseStudyClient slug={params.slug} />;
}
