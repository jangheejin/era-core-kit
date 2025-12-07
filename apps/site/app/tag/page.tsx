//apps/site/app/tag/page.tsx
import Link from "next/link";
import { getTagIndex } from "@/lib/tags";

export default async function TagIndexPage() {
  const tags = await getTagIndex();

  return (
    <main className="c-page">
      <h1 className="type-h2">Tags</h1>

      <div className="card">
        {tags.length === 0 ? (
          <p className="muted">No tags yet.</p>
        ) : (
          <ul className="tag-index">
            {tags.map((t) => (
              <li key={t.slug}>
                <Link href={`/tag/${t.slug}`}>{t.label}</Link>{" "}
                <span className="muted">({t.count})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}