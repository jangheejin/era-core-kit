// apps/site/app/sectors/SectorPageClient.tsx
"use client";

import { useMemo, useState } from "react";
import { CaseGrid } from "@kit/blocks";
import type { CaseGridItem } from "@kit/blocks/types"; // adjust path to wherever CaseGridItem lives

type Props = {
  items: CaseGridItem[];
  layout?: string;
};

export function SectorPageClient({ items, layout = "layout-3" }: Props) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;

    return items.filter((it) => {
      const haystack = [
        it.title,
        it.client,
        it.summary,
        it.brief,
        it.sectorsReadable,
        ...(it.sectors ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(s);
    });

    /* return items.filter((it) =>
      `${it.title ?? ""} ${it.description ?? ""}`.toLowerCase().includes(s)
    ); */
  }, [items, q]);

  return (
    <div className="c-stack" style={{ gap: "1rem" }}>
      <input
        className="c-input"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search case studies…"
      />

      {filtered.length === 0 ? (
        <div className="muted">No matches.</div>
      ) : (
        <CaseGrid layout={layout} items={filtered} />
      )}
    </div>
  );
}
