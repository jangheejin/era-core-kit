//apps/site/app/admin/case-studies/edit/[slug]/EditCaseStudyClient.tsx
"use client";

import "@styles/admin-cms.css";
import "@styles/admin-cms-buttons.css";

import Link from "next/link";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";

import {
  CaseStudy as CaseStudySchema,
  DEFAULT_HERO_IMAGE_URL,
  SECTOR_VALUES,
  type SectorValue,
  deriveSummaryFromWriteUp,
  normalizeTagList,
  type CaseStudyInput,
  type CaseStudyType,
} from "@kit/schema";

import { useAdminCaseStudies } from "../../../AdminCaseStudyStore";
import { ContextBanner } from "@/admin/components/ContextBanner";

function emptyToUndefined(s: unknown): string | undefined {
  if (typeof s !== "string") return undefined;
  const t = s.trim();
  return t ? t : undefined;
}

export default function EditCaseStudyClient({ slug }: { slug: string }) {
  const router = useRouter();
  const { getBySlug, upsertCaseStudy } = useAdminCaseStudies();

  const cs = useMemo(() => getBySlug(slug), [getBySlug, slug]);

  const DEFAULT_SECTOR = SECTOR_VALUES[0] as SectorValue;

  const [ready, setReady] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  // core fields
  const [client, setClient] = useState("");
  const [writeUp, setWriteUp] = useState("");
  const [brief, setBrief] = useState("");

  //optional fields
  const [sector, setSector] = useState<string>(""); // allow empty like create
//  const [sector, setSector] = useState<SectorValue>(DEFAULT_SECTOR);
  //const [heroImageUrl, setHeroImageUrl] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState<string>("");
  const [tags, setTags] = useState<string>("");

  const [isPublic, setIsPublic] = useState(false);
  const [isFeaturedHome, setIsFeaturedHome] = useState(false);

  // load initial from store record
  useEffect(() => {
    if (!cs || ready) return;

    setClient(cs.client ?? cs.title ?? "");
    setWriteUp(cs.bodyMDX ?? "");
    setBrief(cs.brief ?? "");

    // keep behavior consistent with create: allow empty, but seed from existing
    const initialSector = (cs.sectors?.[0] as SectorValue | undefined) ?? DEFAULT_SECTOR;
    setSector(initialSector);

    //setSector((cs.sectors?.[0] as SectorValue) ?? DEFAULT_SECTOR);

    setTags(Array.isArray(cs.tags) ? cs.tags.join(", ") : "");
    setHeroImageUrl(cs.heroImageUrl ?? "");

    setIsPublic(Boolean(cs.isPublic));
    setIsFeaturedHome(Boolean(cs.isFeaturedHome));

    setReady(true);
  }, [cs, ready, DEFAULT_SECTOR]);

  // hero image upload (same as create)
  function handleHeroImageFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") setHeroImageUrl(result);
    };
    reader.readAsDataURL(file);
  }


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

  const bodyMDX = useMemo(() => writeUp, [writeUp]);
  const previewBlurb = useMemo(() => emptyToUndefined(brief), [brief]);

  //const summaryShort = deriveSummaryFromWriteUp(brief?.trim() || writeUp, 180);
  const summaryShortAuto = useMemo(() => {
    return previewBlurb ?? deriveSummaryFromWriteUp(bodyMDX, 180);
  }, [previewBlurb, bodyMDX]);

  // candidate object for validation + save
  const candidateInput: CaseStudyInput = useMemo(() => {
    const displayName = client.trim();
    const nextTags = normalizeTagList(
      tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    );

    // IMPORTANT: preserve everything you’re not editing
    const base = cs as CaseStudyType;

    return {
      ...base,

      // keep slug stable on edit (don’t silently change route)
      slug: base.slug,

      // align with create: title = displayName; client optional
      title: displayName || base.title || base.slug,
      client: emptyToUndefined(displayName),

      bodyMDX,
      brief: previewBlurb,
      summaryShort: summaryShortAuto,

      sectors: sector ? [sector as SectorValue] : [],

      tags: nextTags,

      heroImageUrl: emptyToUndefined(heroImageUrl) ?? DEFAULT_HERO_IMAGE_URL,

      isPublic,
      isFeaturedHome: isPublic ? isFeaturedHome : false,
    };
  }, [
    cs,
    client,
    bodyMDX,
    previewBlurb,
    summaryShortAuto,
    sector,
    tags,
    heroImageUrl,
    isPublic,
    isFeaturedHome,
  ]);

  const validation = useMemo(() => CaseStudySchema.safeParse(candidateInput), [candidateInput]);

  // “dirty” indicator: compare against store object (clears after successful upsert)
  const dirty = useMemo(() => {
    const base = cs;
    if (!base) return false;

    const baseClient = (base.client ?? base.title ?? "").trim();
    const baseWriteUp = base.bodyMDX ?? "";
    const baseBrief = base.brief ?? "";
    const baseSector = (base.sectors?.[0] as string | undefined) ?? String(DEFAULT_SECTOR);
    const baseTags = Array.isArray(base.tags) ? base.tags.join(", ") : "";
    const baseHero = base.heroImageUrl ?? "";
    const basePublic = Boolean(base.isPublic);
    const baseFeatured = Boolean(base.isFeaturedHome);

    return (
      client.trim() !== baseClient ||
      writeUp !== baseWriteUp ||
      brief !== baseBrief ||
      (sector || "") !== (baseSector || "") ||
      tags.trim() !== baseTags.trim() ||
      (heroImageUrl || "") !== (baseHero || "") ||
      isPublic !== basePublic ||
      isFeaturedHome !== baseFeatured
    );
  }, [cs, client, writeUp, brief, sector, tags, heroImageUrl, isPublic, isFeaturedHome, DEFAULT_SECTOR]);

  function saveOnly() {
    const parsed = CaseStudySchema.safeParse(candidateInput);
    if (!parsed.success) return;

    upsertCaseStudy(parsed.data);
    setLastSavedAt(new Date().toLocaleTimeString());
  }

/*   function previewOnly() {
    // preview shows last-saved version. that’s the whole point of separating buttons.
    router.push(`/admin/case-studies/mock/${cs.slug}`);
  } */

    // preview shows last-saved version. that’s the whole point of separating buttons.
    function previewOnly() {
      router.push(`/admin/case-studies/mock/${slug}`);
    }
  /* function save() {
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
  } */


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
      <ContextBanner view="preview">
        You’re editing a demo case study stored in your browser. Save commits changes to the local demo store.
        Preview shows what the public-facing template looks like.
      </ContextBanner>

      <div className="form-header">
        <h1 className="form-title">EDIT CASE STUDY</h1>
        <div className="form-nav">
          <Link href="/admin">Admin</Link> |{" "}
          <Link href="/admin/case-studies/list">Case Study Library</Link> |{" "}
          <Link href={`/admin/case-studies/mock/${cs.slug}`}>Preview</Link>
        </div>
      </div>

      {/* CORE */}
      {/* <div className="card mt1 card--core"> */}
      <section className="card card-new mt1">
        <div className="card card-new">
        <div className="form-group">
          <label className="form-label">
            Client Name <span className="admin-label-required">(required)</span>
          </label>
          <input className="input" 
            value={client} 
            //onChange={(e) => setClient(e.target.value)} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setClient(e.currentTarget.value)
            }
          />
          {/* In React, prefer e.currentTarget.value because it’s correctly typed to the element you attached the handler to */}
        </div>

        <div className="form-group" id="write-up-section">
          <label className="form-label">
            Description <span className="admin-label-required">(required)</span>
          </label>

          <p className="admin-hint">
            Write something about the case study here. Any format is OK (notes or a full write-up).
          </p>
          <textarea
            className="input"
            style={{ minHeight: 220 }}
            value={writeUp}
            //onChange={(e) => setWriteUp(e.target.value)}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setWriteUp(e.currentTarget.value)
            }
          />
        </div>

{/*         <div className="form-group">
          <label className="form-label">
            Preview blurb <span className="admin-label-optional">(optional)</span>
          </label>
          <p className="admin-hint">
            If provided, this is used as the short “summary” shown in list cards.
          </p>
          <textarea
            className="input"
            style={{ minHeight: 90 }}
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
          />
        </div> */}

        <div className="form-group">
          <label className="form-label" htmlFor="heroImage">
            Upload an image <span className="admin-label-optional">(optional)</span>
          </label>
          <p className="admin-hint">
            If you don’t add one, a default image will be used.
          </p>
          <input id="heroImage" type="file" accept="image/*" onChange={handleHeroImageFileChange} />

          {heroImageUrl ? (
            <div style={{ marginTop: "0.75rem" }}>
              <p className="muted type-small">Preview</p>
              <img
                src={heroImageUrl}
                alt="Hero preview"
                style={{ maxWidth: "100%", height: "auto", borderRadius: 8 }}
              />
            </div>
          ) : null}
        </div>

        {/* ACTION BAR (separate Save vs Preview) */}
        <div className="form-actions form-actions--top">
          <div className="form-actions__left">
            <button
              className="btnPrimary"
              type="button"
              onClick={saveOnly}
              disabled={!validation.success}
              title={!validation.success ? "Fix validation errors first" : "Save changes"}
            >
              Save
            </button>

            <button className="btn" type="button" onClick={previewOnly}>
              Preview
            </button>

            <div className="save-status">
              {!validation.success
                ? "Can't save yet: Missing required fields (Client Name + Description)"
                : dirty
                  ? "Unsaved changes."
                  : lastSavedAt
                    ? `Saved at ${lastSavedAt}.`
                    : "No changes"
              }
            </div>
          </div>

          <div style={{ flex: 1 }} />

          {/* Publishing toggles (keep the pill UI) */}
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
            Featured on Homepage
          </button>
        </div>



{/*        <div className="form-row form-group">
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
        </div>*/}

{/*         <div className="row" style={{ gap: 10, alignItems: "center" }}>
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

        </div> 
        

          <button className="btnSave btnSave--ready" type="button" onClick={saveOnly}>
            Save + Preview
          </button>*/}

        </div>
        {/* end of 2nd largest outer card wrapper (CORE) */}
      {/* </div> */}
      {/* end of core */}
      </section>

      {/* OPTIONAL (match create’s “advanced” block shape) */}
      <div className="card card-new mt1">
        <details className="admin-collapse" open>
          <summary className="admin-collapse__summary">
            <div>
              <p className="admin-hint">
                OPTIONAL: Assign categories and tags so this case study can be used in custom client pages.
              </p>
            </div>
            <span className="admin-collapse__chevron" aria-hidden="true">
              ▶
            </span>
          </summary>

          <div className="form-row form-group" id="sector">
            <div className="form-field">
              <label className="form-label" htmlFor="sectorSelect">
                Client Type
              </label>
              <p className="admin-hint">Select the primary sector (client type) for this case study.</p>

              <select
                id="sectorSelect"
                className="input"
                value={sector}
                //onChange={(e) => setSector(e.target.value)}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSector(e.currentTarget.value)
                }
              >
                <option value="">Select a sector (client type)</option>
                {SECTOR_VALUES.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row form-group" id="tags">
            <div className="form-field">
              <label className="form-label" htmlFor="tagsInput">
                Tags
              </label>
              <p className="admin-hint">
                Separate tags with commas (e.g. <code>environment</code>, <code>appropriations</code>).
              </p>
              <input
                id="tagsInput"
                className="input"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>
        </details>
      </div>

      {/* Validation block (optional but useful in demo) */}
      <div className="card card-new mt1">
        <h3>Validation</h3>
        {validation.success ? (
          <p className="muted">✅ Valid (ready to save)</p>
        ) : (
          <pre className="error">
            ❌ Invalid{"\n\n"}
            {JSON.stringify(validation.error.format(), null, 2)}
          </pre>
        )}
      </div>

    </main>
  );
}
