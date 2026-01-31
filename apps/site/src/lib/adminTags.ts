import {
  SECTOR_VALUES,
  sectorLabel,
  sectorRouteSlug,
  tagSlug,
} from "@kit/schema";

const CATEGORY_TAG_SLUGS = new Set(
  SECTOR_VALUES.flatMap((v) => {
    const labelSlug = tagSlug(sectorLabel(v));
    const valueSlug = tagSlug(v);
    const routeSlug = sectorRouteSlug(v);
    return [labelSlug, valueSlug, routeSlug].filter(Boolean);
  }),
);

export function isCategoryTag(tag: string): boolean {
  const slug = tagSlug(tag);
  return Boolean(slug && CATEGORY_TAG_SLUGS.has(slug));
}

export function splitCategoryTags(tags: string[]) {
  const visible: string[] = [];
  const hidden: string[] = [];

  for (const tag of tags) {
    if (isCategoryTag(tag)) {
      hidden.push(tag);
    } else {
      visible.push(tag);
    }
  }

  return { visible, hidden };
}

export function filterCategoryTags(tags: string[]) {
  return tags.filter((tag) => !isCategoryTag(tag));
}
