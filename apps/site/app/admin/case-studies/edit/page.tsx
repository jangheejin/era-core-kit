//apps/site/app/admin/case-studies/edit/page.tsx

/* import EditClient from "./EditClient";

export default function Page({ params }: { params: { slug: string } }) {
  return <EditClient slug={params.slug} />;
}
 */

// This route exists only as a safety net. The real editor lives at:
//   /admin/case-studies/edit/[slug]

import { redirect } from "next/navigation";

export default function AdminCaseStudyEditIndex() {
  redirect("/admin/case-studies/list");
}