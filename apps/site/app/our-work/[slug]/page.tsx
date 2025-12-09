// apps/site/app/our-work/[slug]/page.tsx

import Link from "next/link";
import { getPublicCaseStudyBySlug } from "@/features/caseStudies/publicRepo.server";
import { DemoGate } from "../_demo/DemoGate";

function isDemoOn(v: unknown) {
  if (typeof v === "string") return v === "1";
  if (Array.isArray(v)) return v.includes("1");
  return false;
}

export default async function OurWorkDetailPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { demo?: string | string[] };
}) {
  const demo = isDemoOn(searchParams?.demo);
  const cs = await getPublicCaseStudyBySlug(params.slug);

  if (!cs && !demo) {
    return (
      <main className="c-page">
        <div className="c-container c-stack">
          <h1 className="type-h2">Not found</h1>
          <Link href="/our-work">Back</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="c-page">
      <div className="c-container c-stack">
        <Link href="/our-work" className="muted">← Back to Our Work</Link>

        <div data-cms-ssr="1" className="c-stack">
          {cs ? (
            <>
              <h1 className="type-h2">{cs.client?.trim() || cs.title?.trim() || cs.slug}</h1>
              {cs.heroImageUrl ? <img className="case-study__hero" src={cs.heroImageUrl} alt="" /> : null}
              {cs.brief ? <p className="muted">{cs.brief}</p> : null}
              {cs.bodyMDX ? <div style={{ whiteSpace: "pre-wrap" }}>{cs.bodyMDX}</div> : null}
            </>
          ) : (
            <>
              <h1 className="type-h2">Not found (published)</h1>
              <p className="muted">In demo mode, a draft may load below.</p>
            </>
          )}
        </div>

        <DemoGate enabled={demo} slug={params.slug} />
      </div>
    </main>
  );
}
