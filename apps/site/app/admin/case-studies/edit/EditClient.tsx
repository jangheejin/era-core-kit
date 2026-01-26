"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { CaseStudy as CaseStudySchema, type CaseStudyInput, type CaseStudyType } from "@kit/schema";
import { useAdminCaseStudies } from "../../AdminCaseStudyStore";

export default function EditClient({ slug }: { slug: string }) {
  const router = useRouter();
  const { getBySlug, upsertCaseStudy, ensureUniqueSlug } = useAdminCaseStudies();

  const existing = useMemo(() => getBySlug(slug), [getBySlug, slug]);

  const [client, setClient] = useState(existing?.client ?? "");
  const [title, setTitle] = useState(existing?.title ?? "");
  const [bodyMDX, setBodyMDX] = useState(existing?.bodyMDX ?? "");
  const [summaryShort, setSummaryShort] = useState(existing?.summaryShort ?? "");

  const candidate: CaseStudyInput | null = useMemo(() => {
    if (!existing) return null;

    return {
      ...existing,
      client: client.trim() || undefined,
      title: title.trim() || client.trim() || existing.title,
      bodyMDX,
      summaryShort: summaryShort ?? existing.summaryShort,
    };
  }, [existing, client, title, bodyMDX, summaryShort]);

  const validation = useMemo(() => {
    if (!candidate) return null;
    return CaseStudySchema.safeParse(candidate);
  }, [candidate]);

  function save() {
    if (!validation?.success) return;

    const desired = validation.data.slug;
    const unique = ensureUniqueSlug(desired, validation.data.id);
    const next: CaseStudyType = { ...validation.data, slug: unique };

    upsertCaseStudy(next);
    router.push("/admin/case-studies/list"); // save returns to database
  }

  if (!existing) {
    return (
      <main className="c-admin">
        <p className="muted">Not found.</p>
        <Link className="btnSmall" href="/admin/case-studies/list">Back to database</Link>
      </main>
    );
  }

  return (
    <main className="c-admin">
      <div className="form-header">
        <h1 className="form-title">Edit case study</h1>
        <div className="form-nav">
          <Link href="/admin/case-studies/list">Database</Link>{" "}
          |{" "}
          <Link href={`/admin/case-studies/mock/${existing.slug}`} target="_blank" rel="noopener noreferrer">
            Preview
          </Link>
        </div>
      </div>

      <div className="card card-new mt1">
        <div className="form-group">
          <label className="form-label">Client</label>
          <input className="input" value={client} onChange={(e) => setClient(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Title</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Summary</label>
          <input className="input" value={summaryShort} onChange={(e) => setSummaryShort(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Content</label>
          <textarea className="input" value={bodyMDX} onChange={(e) => setBodyMDX(e.target.value)} rows={14} />
        </div>

        <button className="btnSave" type="button" onClick={save} disabled={!validation?.success}>
          Save
        </button>

        {!validation?.success && validation && (
          <pre className="error" style={{ marginTop: 12 }}>
            {JSON.stringify(validation.error.format(), null, 2)}
          </pre>
        )}
      </div>
    </main>
  );
}
