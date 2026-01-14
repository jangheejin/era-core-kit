//apps/site/app/admin/case-studies/edit/[slug]/EditCaseStudyClient.tsx
"use client";

import "@styles/admin-cms.css";
import "@styles/admin-cms-buttons.css";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  CaseStudy as CaseStudySchema,
  DEFAULT_HERO_IMAGE_URL,
  SECTOR_VALUES,
  type SectorValue,
  deriveSummaryFromWriteUp,
} from "@kit/schema";

import { useAdminCaseStudies } from "../../../AdminCaseStudyStore";

export default function EditCaseStudyClient({ slug }: { slug: string }) {
  const router = useRouter();
  const { getBySlug, upsertCaseStudy } = useAdminCaseStudies();

  const cs = useMemo(() => getBySlug(slug), [getBySlug, slug]);

  const DEFAULT_SECTOR = SECTOR_VALUES[0] as SectorValue;

  const [ready, setReady] = useState(false);

  const [client, setClient] = useState("");
  const [writeUp, setWriteUp] = useState("");
  const [brief, setBrief] = useState("");
  const [sector, setSector] = useState<SectorValue>(DEFAULT_SECTOR);
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isFeaturedHome, setIsFeaturedHome] = useState(false);

  useEffect(() => {
    if (!cs || ready) return;

    setClient(cs.client ?? cs.title ?? "");
    setWriteUp(cs.bodyMDX ?? "");
    setBrief(cs.brief ?? "");
    setSector((cs.sectors?.[0] as SectorValue) ?? DEFAULT_SECTOR);
    setHeroImageUrl(cs.heroImageUrl ?? "");
    setIsPublic(Boolean(cs.isPublic));
    setIsFeaturedHome(Boolean(cs.isFeaturedHome));

    setReady(true);
  }, [cs, ready, DEFAULT_SECTOR]);

  if (!cs) {
    return (
      <main className="c-admin">
        <div className="c-container c-stack">
          <h1 className="type-h2">Not found</h1>
          <Link href="/admin/case-studies/list">Back to database</Link>
        </div>
      </main>
    );
  }

  const summaryShort = deriveSummaryFromWriteUp(brief?.trim() || writeUp, 180);

  function save() {
    // keep tags + everything else intact; patch only what editor controls
    const current = cs;
    if (!current) return;

    const trimmedClient = client.trim();
    const existingTitle = (current.title ?? "").trim();
    const nextTitle = existingTitle || trimmedClient || slug;

    const next = {
      ...current,
      client: trimmedClient || undefined,
      title: nextTitle,
      bodyMDX: writeUp,
      brief: brief.trim() || undefined,
      summaryShort,
      sectors: sector ? [sector]: [],
      heroImageUrl: heroImageUrl.trim() || DEFAULT_HERO_IMAGE_URL,
      isPublic,
      isFeaturedHome: isPublic ? isFeaturedHome : false,
    };

    const parsed = CaseStudySchema.safeParse(next);
    if (!parsed.success) {
      alert("Can't save yet. Required fields missing (Client + Content).");
      return;
    }

    upsertCaseStudy(parsed.data);
    router.push(`/admin/case-studies/mock/${parsed.data.slug}`);
  }


/*     const base = cs;
    if (!base) return; // TS safety; shouldn’t happen if your Not Found return is above */
    /* const trimmedClient = client.trim();
    const existingTitle = (cs.title ?? "").trim();
    const nextTitle = existingTitle || trimmedClient || slug; // slug prop is always defined
  
    const next = {
      ...cs,
      client: trimmedClient || undefined,
      title: nextTitle,
      bodyMDX: writeUp,
      brief: brief.trim() || undefined,
      summaryShort,
      sectors: sector ? [sector] : [],
      heroImageUrl: heroImageUrl.trim() || DEFAULT_HERO_IMAGE_URL,
      isPublic,
      isFeaturedHome: isPublic ? isFeaturedHome : false,
    };
  
    const parsed = CaseStudySchema.safeParse(next);
    if (!parsed.success) {
      alert("Can’t save yet — required fields missing (Client + Content).");
      return;
    }
  
    upsertCaseStudy(parsed.data);
    router.push(`/admin/case-studies/mock/${parsed.data.slug}`);
  } */
/*      const next = {
      ...cs,
      client: client.trim() || undefined,
      title: (cs.title ?? "").trim() || client.trim() || cs.slug,
      bodyMDX: writeUp,
      brief: brief.trim() || undefined,
      summaryShort,
      sectors: sector ? [sector] : [],
      heroImageUrl: heroImageUrl.trim() || DEFAULT_HERO_IMAGE_URL,
      isPublic,
      isFeaturedHome: isPublic ? isFeaturedHome : false,
    }; */

/*     const parsed = CaseStudySchema.safeParse(next);
    if (!parsed.success) {
      // keep it simple for demo: just block save
      alert("Can’t save yet — required fields missing (Client + Content).");
      return;
    } 

    upsertCaseStudy(parsed.data);
    router.push(`/admin/case-studies/mock/${parsed.data.slug}`);
  }*/

  return (
    <main className="c-admin">
      <div className="form-header">
        <h1 className="form-title">EDIT CASE STUDY</h1>
        <div className="form-nav">
          <Link href="/admin">Admin</Link> |{" "}
          <Link href="/admin/case-studies/list">Database</Link> |{" "}
          <Link href={`/admin/case-studies/mock/${cs.slug}`}>Preview</Link>
        </div>
      </div>

      <div className="card mt1 card--core">
        <div className="form-group">
          <label className="form-label">Client Name</label>
          <input className="input" value={client} onChange={(e) => setClient(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Case Study Content</label>
          <textarea
            className="input"
            style={{ minHeight: 220 }}
            value={writeUp}
            onChange={(e) => setWriteUp(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Preview blurb (optional)</label>
          <textarea
            className="input"
            style={{ minHeight: 90 }}
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
          />
        </div>

        <div className="form-row form-group">
          <div className="form-field">
            <label className="form-label">Category</label>
            <select
              className="input"
              value={sector}
              onChange={(e) => setSector(e.target.value as SectorValue)}
            >
              {SECTOR_VALUES.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">Hero image URL (optional)</label>
            <input
              className="input"
              value={heroImageUrl}
              onChange={(e) => setHeroImageUrl(e.target.value)}
              placeholder={DEFAULT_HERO_IMAGE_URL}
            />
          </div>
        </div>

        <div className="row" style={{ gap: 10, alignItems: "center" }}>
          <button
            type="button"
            className={`pillToggle ${isPublic ? "pillToggle--on" : ""}`}
            onClick={() => {
              const next = !isPublic;
              setIsPublic(next);
              if (!next) setIsFeaturedHome(false);
            }}
            aria-pressed={isPublic}
          >
            On site
          </button>

          <button
            type="button"
            className={`pillToggle ${isFeaturedHome ? "pillToggle--on" : ""}`}
            onClick={() => setIsFeaturedHome((v) => !v)}
            disabled={!isPublic}
            aria-pressed={isFeaturedHome}
            title={!isPublic ? "Turn on 'On site' first" : "Feature on Our Work"}
          >
            Featured
          </button>

          <div style={{ flex: 1 }} />

          <button className="btnSave btnSave--ready" type="button" onClick={save}>
            Save + Preview
          </button>
        </div>
      </div>
    </main>
  );
}
