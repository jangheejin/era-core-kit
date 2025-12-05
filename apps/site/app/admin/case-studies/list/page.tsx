// apps/site/app/admin/case-studies/list/page.tsx
// "database" view of case studies

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  CASE_STUDY_STATUS_VALUES,
  CASE_STUDY_VISIBILITY_VALUES,
  SECTOR_VALUES,
} from "@kit/schema";

import { useAdminCaseStudies } from "../../AdminCaseStudyStore";

export default function CaseStudyListPage() {
  //const { items } = useAdminCaseStudies();
  const { items, resetToBaseline } = useAdminCaseStudies();

  const [q, setQ] = useState("");
  const [sector, setSector] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [visibility, setVisibility] = useState<string>("")

  const filtered = useMemo(() => {
    const qq = q.toLowerCase().trim();
    return items.filter((cs) => {
      if (sector && cs.sector !== sector) return false;
      if (status && cs.status !== status) return false;
      if (visibility && cs.visibility !== visibility) return false;

      if (!qq) return true;
      const hay = [
        cs.title,
        cs.client ?? "",
        cs.slug,
        cs.summaryShort,
        ...(cs.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return hay.includes(qq);
    });
  }, [items, q, sector, status, visibility]);

  /*TO DO: MAYBE CHANGE CLASSNAME FROM  C-ADMIN BACK TO C-SECTION, ETC? and similarly throughout*/

  return (
    <main className="c-admin">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h1 className = "type-h2">Mock CMS Database</h1>
        <div className="row">
          <Link href="/admin">Admin</Link>
          <Link href="/admin/case-studies/new">New</Link>
          <button className="btn" type="button" onClick={resetToBaseline}>
            Reset demo data
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <div className="row">
          <input
            className="input"
            placeholder="Search title / client / slug / tags…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ flex: 1, minWidth: 240 }}
          />

          <select className="input" value={sector} onChange={(e) => setSector(e.target.value)}>
            <option value="">All sectors</option>
            {SECTOR_VALUES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>

          <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All status</option>
            {CASE_STUDY_STATUS_VALUES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>

          <select
            className="input"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="">All visibility</option>
            {CASE_STUDY_VISIBILITY_VALUES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <p className="muted">Showing {filtered.length} / {items.length}</p>

        <div style={{ display: "grid", gap: ".75rem" }}>
          {filtered.map((cs) => (
            <div key={cs.id} className="card">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div>
                  <div>
                    <strong>{cs.title}</strong>{" "}
                    <span className="muted">({cs.client ?? "—"})</span>
                  </div>
                  <div className="muted" style={{ fontSize: ".9rem" }}>
                    /{cs.slug} • {cs.sector} • {cs.status} • {cs.visibility}
                  </div>
                </div>

                <div className="row">
                  <Link href={`/admin/case-studies/mock/${cs.slug}`}>Preview</Link>
                </div>
              </div>

              <div className="muted" style={{ marginTop: ".5rem" }}>
                {cs.summaryShort}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}





/*       <div className="c-container c-stack">
        <h1 className="type-h2">Mock Case Study Database</h1>
        <p className="type-body type-muted">
          These entries are stored locally in this browser (localStorage). They
          are not synced to a backend.
        </p>

        {items.length === 0 ? (
          <p className="type-body type-muted">
            No mock case studies yet.{" "}
            <Link href="/admin/case-studies/new" className="c-link">
              Create one now
            </Link>
            .
          </p>
        ) : (
          <div className="c-stack">
            {items.map((cs) => (
              <div key={cs.slug} className="card">
                <div className="card-body c-stack">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="type-h3">{cs.title}</h2>
                      <p className="type-small type-muted">
                        /admin/case-studies/mock/{cs.slug}
                      </p>
                      <p className="type-small type-muted">
                        <strong>Status:</strong> {cs.status}{" "}
                        <strong style={{ marginLeft: 12 }}>Visibility:</strong>{" "}
                        {cs.visibility}
                      </p>
                    </div>

                    <Link
                      href={`/admin/case-studies/mock/${cs.slug}`}
                      className="c-button"
                    >
                      View page
                    </Link>
                  </div>

                  <p className="type-body type-muted">{cs.summaryShort}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} */