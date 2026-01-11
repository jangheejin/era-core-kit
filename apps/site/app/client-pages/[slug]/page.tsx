// apps/site/app/client-pages/[slug]/page.tsx
import ClientPagePublicClient from "./ClientPagePublicClient";

export default function ClientPagePublic({ params }: { params: { slug: string } }) {
  return <ClientPagePublicClient slug={params.slug} />;
}
