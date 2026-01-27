import type { CaseStudyType } from "@kit/schema";

type CaseStudyOrderingOptions = {
  items: CaseStudyType[];
  itemsSource?: "featured";
  maxItems?: number;
};

export function getOrderedCaseStudies({
  items,
  itemsSource,
  maxItems,
}: CaseStudyOrderingOptions): CaseStudyType[] {
  const publicItems = items.filter(
    (cs) => Boolean(cs.isPublic) && cs.status === "Published",
  );

  if (itemsSource !== "featured") {
    return publicItems;
  }

  const featured = publicItems.filter((cs) => Boolean(cs.isFeaturedHome));
  let ordered = featured;

  if (typeof maxItems === "number" && featured.length < maxItems) {
    const featuredSlugs = new Set(featured.map((cs) => cs.slug));
    const filler = publicItems.filter((cs) => !featuredSlugs.has(cs.slug));
    ordered = [...featured, ...filler];
  }

  return typeof maxItems === "number" ? ordered.slice(0, maxItems) : ordered;
}
