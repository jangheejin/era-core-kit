//apps/site/app/sectors/SectorPageView.tsx

// extract the actual page UI into one shared component

"use client";

import "@styles/admin-cms.css"; // remove if you don't want admin styles here

import Link from "next/link";
import { notFound } from "next/navigation";
import { useMemo } from "react";
import { getCaseStudies } from "@/lib/caseStudies"; // TO DO: UPDATE LATER (kept because you had it)
import { getCaseStudiesBySectorRouteSlug } from "@/lib/caseStudies";
import { ContextBanner } from "@/admin/components/ContextBanner";
import { CaseStudyCollapsibleCard } from "@/components/CaseStudyCollapsibleCard";

import {
  sectorFromRouteSlug,
  sectorLabel,
  type SectorValue,
  type CaseStudyType,
} from "@kit/schema";

import { useAdminCaseStudies } from "../admin/AdminCaseStudyStore"; // adjust if your relative path differs


export default async function SectorPageView({ sectorSlug }: { sectorSlug: string }) {
  const { sector, items } = await getCaseStudiesBySectorRouteSlug(sectorSlug);
  if (!sector) return notFound();

  // kept because your existing page calls it (even if unused right now)
  await getCaseStudies(); // TO DO: UPDATE later

  return (
    <main className="c-admin">
      <ContextBanner view="preview">
        You are now viewing all of the case studies in the <strong>{sector}</strong> category
      </ContextBanner>

      <div className="card card-new mt1">
        <div className="mb">
          <h1 className="type-h1-over type-gray">Sector: {sector}</h1>
        </div>

        <div className="mb">
          <p className="muted" style={{ marginTop: ".25rem" }}>
            Click a case study preview card to expand the full write-up.
          </p>
        </div>

        {items.length === 0 ? (
          <p className="muted">No public case studies in this sector yet.</p>
        ) : (
          <div className="case-grid">
            {items.map((cs) => (
              <CaseStudyCollapsibleCard key={cs.id} cs={cs} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

/* type Props = {
  sectorSlug: string; // e.g. "environment"
};

export default function SectorPageView({ sectorSlug }: Props) {
  const sector = sectorFromRouteSlug(sectorSlug);
  if (!sector) notFound();

  const { items } = useAdminCaseStudies();

  const filtered = useMemo(() => {
    return items.filter((cs: CaseStudyType) => (cs.sectors ?? []).includes(sector));
  }, [items, sector]);

  return (
    <main className="c-admin">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <h1 className="type-h2">{sectorLabel(sector)}</h1>
          <p className="muted" style={{ marginTop: ".25rem" }}>
            Showing {filtered.length} case stud{filtered.length === 1 ? "y" : "ies"}
          </p>
        </div>

        <div className="row" style={{ gap: ".75rem" }}>
          <Link href="/admin/case-studies/list">Database</Link>
          <Link href="/admin/case-studies/new">New</Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        {filtered.length === 0 ? (
          <p className="muted">
            No case studies tagged with <strong>{sectorLabel(sector)}</strong> yet.
          </p>
        ) : (
          <div style={{ display: "grid", gap: ".75rem" }}>
            {filtered.map((cs) => {
              const clientLabel = cs.client ?? cs.title;

              return (
                <div key={cs.id} className="card">
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <div style={{ flex: 1, minWidth: 240 }}>
                      <div style={{ fontWeight: 700 }}>{clientLabel}</div>
                      <div className="muted" style={{ marginTop: ".35rem" }}>
                        {cs.summaryShort}
                      </div>
                    </div>

                    <div className="row" style={{ gap: ".75rem" }}>
                      <Link href={`/admin/case-studies/mock/${cs.slug}`}>Preview</Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
 */