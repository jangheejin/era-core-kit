//apps/site/src/lib/tags.ts
import { normalizeTag, tagSlug } from "@kit/schema";
import { getCaseStudies } from "./caseStudies";

export type TagIndexItem = { slug: string; label: string; count: number };

export async function getTagIndex(): Promise<TagIndexItem[]> {
  const all = await getCaseStudies();

  const bySlug = new Map<string, TagIndexItem>();

  for (const cs of all) {
    for (const raw of cs.tags ?? []) {
      const label = normalizeTag(raw);
      if (!label) continue;

      const slug = tagSlug(label);
      const prev = bySlug.get(slug);

      if (!prev) bySlug.set(slug, { slug, label, count: 1 });
      else bySlug.set(slug, { ...prev, count: prev.count + 1 });
    }
  }

  return [...bySlug.values()].sort((a, b) =>
    b.count !== a.count ? b.count - a.count : a.label.localeCompare(b.label),
  );
}
