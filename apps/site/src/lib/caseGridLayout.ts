export function resolveCaseGridLayout(
  count: number,
  fallback: string = "3col",
): string {
  if (!Number.isFinite(count) || count <= 0) return fallback;
  if (count >= 4 && count % 4 === 0) return "4col";
  if (count % 3 === 0) return "3col";
  if (count === 3) return "3col";
  if (count === 2) return "2col";
  if (count === 1) return "2col";
  if (count % 2 === 0) return "2col";
  if (count % 2 !== 0) return "3col";
  return fallback;
}
