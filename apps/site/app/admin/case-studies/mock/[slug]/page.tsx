// apps/site/app/admin/case-studies/mock/[slug]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useAdminCaseStudies } from "../../../AdminCaseStudyStore";

export default function MockCaseStudyPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const { getBySlug } = useAdminCaseStudies();
  const cs = getBySlug(slug);

//  const { items } = useAdminCaseStudies();

  //const slug = params?.slug;
//  const cs = items.find((i) => i.slug === slug);

  if (!cs) {
    return (
      <main className="c-admin">
        <h1>Not found</h1>
        <p className="muted">No case study in the demo store matches: <code>{slug}</code></p>
        <div className="row" style={{ marginTop: "1rem" }}>
          <Link href="/admin/case-studies/list">Back to list</Link>
          <Link href="/admin/case-studies/new">Create new</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="c-admin">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h1>{cs.title}</h1>
        <div className="row">
          <Link href="/admin/case-studies/list">List</Link>
          <Link href="/admin/case-studies/new">New</Link>
        </div>
      </div>

      <p className="muted">
        <strong>{cs.client ?? "—"}</strong> • {cs.sector} • {cs.status} • {cs.visibility} •{" "}
        <code>/{cs.slug}</code>
      </p>

      <div className="card" style={{ marginTop: "1rem" }}>
        <div className="muted" style={{ marginBottom: ".5rem" }}>
          Hero image
        </div>
        <img
          src={cs.heroImageUrl}
          alt=""
          style={{
            width: "100%",
            height: "auto",
            aspectRatio: "16 / 9",
            objectFit: "cover",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,.12)",
          }}
        />
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Summary</h3>
        <p className="muted">{cs.summaryShort}</p>

        {cs.tags?.length ? (
          <p className="muted">
            <strong>Tags:</strong> {cs.tags.join(", ")}
          </p>
        ) : null}
      </div>

      {cs.bodyMDX ? (
        <div className="card" style={{ marginTop: "1rem" }}>
          <h3>Body (MDX raw)</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>{cs.bodyMDX}</pre>
        </div>
      ) : null}

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Raw object (debug)</h3>
        <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(cs, null, 2)}</pre>
      </div>
    </main>
  );
}
