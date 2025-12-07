// app/admin/components/CaseStudyMetadata.tsx

import { CaseStudyType } from "@kit/schema";

type Props = {
  caseStudy: CaseStudyType;
};

export function CaseStudyMetadata({ caseStudy }: Props) {
  const { sectors, tags, status, visibility, slug } = caseStudy;

  return (
    <div className="metadata-card">
      <h2 className="metadata-heading">Metadata</h2>
      <dl className="metadata-grid">
        <div className="metadata-item">
          <dt>Sectors:</dt>
          <dd>{sectors?.join(", ") || "—"}</dd>
        </div>
        <div className="metadata-item">
          <dt>Tags:</dt>
          <dd className="metadata-tags">
            {tags?.length ? (
              tags.map((tag) => (
                <span className="tag-pill" key={tag}>
                  {tag}
                </span>
              ))
            ) : (
              "—"
            )}
          </dd>
        </div>
        <div className="metadata-item">
          <dt>Status:</dt>
          <dd>{status || "—"}</dd>
        </div>
        <div className="metadata-item">
          <dt>Visibility:</dt>
          <dd>{visibility || "—"}</dd>
        </div>
        <div className="metadata-item metadata-slug">
          <dt>Slug:</dt>
          <dd>
            <code>/{slug}</code>
          </dd>
        </div>
      </dl>
    </div>
  );
}
/**TAILWIND VERSION */
/* type Props = {
  caseStudy: CaseStudyType;
};

export function CaseStudyMetadata({ caseStudy }: Props) {
  const { sectors, tags, status, visibility, slug } = caseStudy;

  return (
    <div className="rounded-md border border-neutral-700 bg-neutral-900 p-4 space-y-4">
      <h2 className="text-lg font-semibold tracking-wide text-white">Metadata</h2>
      
      <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm text-neutral-300">
        <div>
          <dt className="font-medium text-white">Sectors</dt>
          <dd>{sectors?.join(", ") || "—"}</dd>
        </div>
        <div>
          <dt className="font-medium text-white">Tags</dt>
          <dd className="flex flex-wrap gap-1 mt-1">
            {tags?.length > 0
              ? tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block rounded-full bg-neutral-800 px-2 py-0.5 text-xs font-medium text-neutral-100"
                  >
                    {tag}
                  </span>
                ))
              : "—"}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-white">Status</dt>
          <dd>{status || "—"}</dd>
        </div>
        <div>
          <dt className="font-medium text-white">Visibility</dt>
          <dd>{visibility || "—"}</dd>
        </div>
        <div className="col-span-full md:col-span-2">
          <dt className="font-medium text-white">Slug</dt>
          <dd className="text-blue-300">/{slug}</dd>
        </div>
      </dl>
    </div>
  );
}
 */