// apps/site/app/admin/case-studies/mock/[slug]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useAdminCaseStudies } from "../../../AdminCaseStudyStore";
import { ContextBanner } from "../../../components/ContextBanner";
import CaseStudyPublicClient from "@/case-studies/[slug]/CaseStudyPublicClient";

export default function MockCaseStudyPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const { getBySlug } = useAdminCaseStudies();
  const cs = getBySlug(slug);

  if (!cs) {
    return (
      <main className="c-admin">
        <h1>Not found</h1>
        <p className="muted">
          No case study in the demo store matches: <code>{slug}</code>
        </p>
        <div className="row" style={{ marginTop: "1rem" }}>
          <Link href="/admin/case-studies/list">Back to list</Link>
          <Link href="/admin/case-studies/new">Create new</Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <ContextBanner view="preview">
        This preview matches the public case study view.
      </ContextBanner>
      <div className="c-admin" style={{ paddingInline: "1rem" }}>
        <div
          className="row"
          style={{ justifyContent: "space-between", marginTop: "1rem" }}
        >
          <h1 className="type-h3">Case study preview</h1>
          <div className="row">
            <Link href="/admin/case-studies/list">List</Link>
            <Link href="/admin/case-studies/new">New</Link>
          </div>
        </div>
      </div>
      <CaseStudyPublicClient slug={slug} />
    </>
  );
}
