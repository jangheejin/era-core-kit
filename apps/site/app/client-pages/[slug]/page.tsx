// apps/site/app/client-pages/[slug]/page.tsx
import { Suspense } from "react";
import ClientPagePublicClient from "./ClientPagePublicClient";

export default function ClientPagePublic({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <Suspense fallback={null}>
      <ClientPagePublicClient slug={params.slug} />
    </Suspense>
  );
}
