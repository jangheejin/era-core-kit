import EditClient from "./EditClient";

export default function Page({ params }: { params: { slug: string } }) {
  return <EditClient slug={params.slug} />;
}
