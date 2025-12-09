//apps/site/app/our-work/_demo/DemoOurWorkDetail.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAdminCaseStudies } from "../../admin/AdminCaseStudyStore";

export function DemoOurWorkDetail({ slug }: { slug: string }) {
  const { items } = useAdminCaseStudies();
  const cs = useMemo(() => items.find((x) => x.slug === slug), [items, slug]);

  if (!cs || !cs.isPublic) {
    return (
      <div className="c-stack">
        <h2 className="type-h3">Not found (demo store)</h2>
        <p className="muted">No public draft exists in this browser for: <code>{slug}</code></p>
        <Link href="/our-work?demo=1">Back to Our Work (Demo)</Link>
      </div>
    );
  }

  return (
    <div className="c-stack">
      <Link href="/our-work?demo=1" className="muted">← Back to Our Work (Demo)</Link>
      <h1 className="type-h2">{cs.client?.trim() || cs.title?.trim() || cs.slug}</h1>
      {cs.heroImageUrl ? <img className="case-study__hero" src={cs.heroImageUrl} alt="" /> : null}
      {cs.brief ? <p className="muted">{cs.brief}</p> : null}
      {cs.bodyMDX ? <div style={{ whiteSpace: "pre-wrap" }}>{cs.bodyMDX}</div> : null}
    </div>
  );
}
