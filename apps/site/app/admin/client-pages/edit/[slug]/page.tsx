// apps/site/app/admin/client-pages/edit/[slug]/page.tsx
"use client";

import ClientPageEditor from "../../ClientPageEditor";

export default function EditClientPage({ params }: { params: { slug: string } }) {
  return <ClientPageEditor slug={params.slug} />;
}
