// apps/site/app/our-work/[slug]/DemoGate.tsx
"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useMemo } from "react";
import { useAdminCaseStudies } from "../../admin/AdminCaseStudyStore";

export default function DemoGate({ enabled, slug }: { enabled: boolean; slug: string }) {
  const { items } = useAdminCaseStudies();

  const cs = useMemo(() => items.find((x) => x.slug === slug), [items, slug]);

  if (!enabled) return null;
  if (!cs) return null;

  return (
    <section className="card" style={{ marginTop: "1rem" }}>
      <div className="c-stack">
        <div className="muted" style={{ fontWeight: 600 }}>
          Demo draft (from this browser)
        </div>

        <h2 className="type-h3">{cs.client?.trim() || cs.title?.trim() || cs.slug}</h2>

        {cs.brief ? <p className="muted">{cs.brief}</p> : null}

        {cs.bodyMDX ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{cs.bodyMDX}</ReactMarkdown>
        ) : null}
      </div>
    </section>
  );
}
