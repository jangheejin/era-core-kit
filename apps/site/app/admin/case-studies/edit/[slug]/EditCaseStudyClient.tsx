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

//helper to protect against slug collisions
function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function emptyToUndefined(s: unknown): string | undefined {
  if (typeof s !== "string") return undefined;
  const t = s.trim();
  return t ? t : undefined;
}

//helper for previewing and saving at same time
function buildPreviewUrl(slug: string) {
  return `/admin/case-studies/mock/${slug}`;
}

export default function EditCaseStudyClient({ slug }: { slug: string }) {
  const router = useRouter();
//  const { getBySlug, upsertCaseStudy } = useAdminCaseStudies();
//part one of protecting against slug collisions. update store destructure
  const { getBySlug, upsertCaseStudy, ensureUniqueSlug } = useAdminCaseStudies();

  // Always call hooks unconditionally
  const cs = useMemo(() => getBySlug(slug), [getBySlug, slug]);

  const DEFAULT_SECTOR = SECTOR_VALUES[0] as SectorValue;

  const [ready, setReady] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  // core fields
  const [client, setClient] = useState("");
  const [writeUp, setWriteUp] = useState("");
  const [brief, setBrief] = useState("");

  // optional fields
  const [sector, setSector] = useState<string>(""); // matches create page (allows empty)
  const [heroImageUrl, setHeroImageUrl] = useState<string>("");
  const [tags, setTags] = useState<string>("");

//  const [isPublic, setIsPublic] = useState(false);
//  const [isFeaturedHome, setIsFeaturedHome] = useState(false);

  //3 publishing states 
  type PublishState = "InternalDraft" | "ClientViewable" | "Homepage";
  const [publishState, setPublishState] = useState<PublishState>("InternalDraft");

  //part of protecting against slug collisions. slugDraft needs a state
  const [slugDraft, setSlugDraft] = useState("");

  const showHeroPreview = Boolean(heroImageUrl) && heroImageUrl !== DEFAULT_HERO_IMAGE_URL;

  // HYDRATION: hydrate local form state once we have cs
  useEffect(() => {
    if (!cs || ready) return;

    setClient(cs.client ?? cs.title ?? "");
    setWriteUp(cs.bodyMDX ?? "");
    setBrief(cs.brief ?? "");

    const initialSector = (cs.sectors?.[0] as SectorValue | undefined) ?? DEFAULT_SECTOR;
    setSector(initialSector);

    setTags(Array.isArray(cs.tags) ? cs.tags.join(", ") : "");
    setHeroImageUrl(cs.heroImageUrl ?? "");

    //hydrate slugDraft once (part of protecting against slug collisions)
    setSlugDraft(cs.slug);

//    setIsPublic(Boolean(cs.isPublic));
//    setIsFeaturedHome(Boolean(cs.isFeaturedHome));

    const nextState: PublishState =
      cs.visibility === "Public"
        ? "Homepage"
        : cs.visibility === "ClientSafe"
          ? "ClientViewable"
          : "InternalDraft";

    setPublishState(nextState);

    setReady(true);
  }, [cs, ready, DEFAULT_SECTOR]);

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

  const onSectorChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const v = e.currentTarget.value;
    setSector(v === "" ? "" : (v as SectorValue));
  };

  const bodyMDX = useMemo(() => writeUp, [writeUp]);
  const previewBlurb = useMemo(() => emptyToUndefined(brief), [brief]);

  const summaryShortAuto = useMemo(() => {
    return previewBlurb ?? deriveSummaryFromWriteUp(bodyMDX, 180);
  }, [previewBlurb, bodyMDX]);

  //compute an "effective slug" to protect against slug collisions
  const autoSlug = useMemo(
    () => slugify(client || cs?.title || cs?.slug || ""),
    [client, cs?.title, cs?.slug],
  );
  
  const effectiveSlug = useMemo(
    () => slugify(slugDraft.trim() || autoSlug),
    [slugDraft, autoSlug],
  );

  //SINGLE candidateInput builder (nullable)
  const candidateInput = useMemo<CaseStudyInput | null>(() => {
    if (!cs) return null;

    const base = cs as CaseStudyType;

    const displayName = client.trim();
    const nextTags = normalizeTagList(
      tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    );

    //sectors fallback
    const nextSectors: SectorValue[] =
    sector
      ? [sector as SectorValue]
      : Array.isArray(base.sectors) && base.sectors.length > 0
        ? base.sectors
        : [DEFAULT_SECTOR];

// one source of truth: publishState
    const publishing =
    publishState === "InternalDraft"
      ? {
          visibility: "Internal" as const,
          status: "Draft" as const,
          isPublic: false,
          isFeaturedHome: false,
        }
      : publishState === "ClientViewable"
        ? {
            visibility: "ClientSafe" as const,
            status: "Published" as const,
            isPublic: true,
            isFeaturedHome: false,
          }
        : {
            visibility: "Public" as const,
            status: "Published" as const,
            isPublic: true,
            isFeaturedHome: true,
          };

    return {
      ...base,

      // keep route stable during edit. new: protect against slug collisions
      slug: effectiveSlug || base.slug,
//      slug: base.slug,

      title: displayName || base.title || base.slug,
      client: emptyToUndefined(displayName),

      bodyMDX,
      brief: previewBlurb,
      summaryShort: summaryShortAuto,

//      sectors: sector ? [sector as SectorValue] : [],

      sectors: nextSectors,

      tags: nextTags,

      heroImageUrl: emptyToUndefined(heroImageUrl) ?? DEFAULT_HERO_IMAGE_URL,

/*       isPublic,
      isFeaturedHome: isPublic ? isFeaturedHome : false, */
      ...publishing,
    };
  }, [
    cs,
    client,
    tags,
    bodyMDX,
    previewBlurb,
    summaryShortAuto,
    sector,
    heroImageUrl,
    //isPublic,
    //isFeaturedHome,
    publishState,
    effectiveSlug,
    DEFAULT_SECTOR,
  ]);

  const validation = useMemo(() => {
    if (!candidateInput) return null;
    return CaseStudySchema.safeParse(candidateInput);
  }, [candidateInput]);

  const canSave = validation?.success ?? false;

  // dirty is ONLY boolean
  const dirty = useMemo(() => {
    if (!cs) return false;

    const baseClient = (cs.client ?? cs.title ?? "").trim();
    const baseWriteUp = cs.bodyMDX ?? "";
    const baseBrief = cs.brief ?? "";
    const baseSector = (cs.sectors?.[0] as string | undefined) ?? String(DEFAULT_SECTOR);
    const baseTags = Array.isArray(cs.tags) ? cs.tags.join(", ") : "";
    const baseHero = cs.heroImageUrl ?? "";
//    const basePublic = Boolean(cs.isPublic);
//    const baseFeatured = Boolean(cs.isFeaturedHome);

    const basePublishState: PublishState =
      cs.visibility === "Public"
        ? "Homepage"
        : cs.visibility === "ClientSafe"
          ? "ClientViewable"
          : "InternalDraft";

    const baseHeroNorm = emptyToUndefined(cs.heroImageUrl) ?? DEFAULT_HERO_IMAGE_URL;
    const heroNorm = emptyToUndefined(heroImageUrl) ?? DEFAULT_HERO_IMAGE_URL;

    return (
      client.trim() !== baseClient ||
      writeUp !== baseWriteUp ||
      brief !== baseBrief ||
      (sector || "") !== (baseSector || "") ||
      tags.trim() !== baseTags.trim() ||
      //(heroImageUrl || "") !== (baseHero || "") ||
      heroNorm !== baseHeroNorm ||
      
      publishState !== basePublishState
//      isPublic !== basePublic ||
//      isFeaturedHome !== baseFeatured
    );
  }, [
    cs, client, writeUp, brief, sector, tags, heroImageUrl, 
    //isPublic, isFeaturedHome, 
    publishState,
    DEFAULT_SECTOR
  ]);

  // to make preview always save as well, need to make saveOnly return the saved object or null
    //  function saveOnly() {
  function saveOnly(): CaseStudyType | null {
    if (!candidateInput) return null;

    //enforce unique slug at save boundary
    const desired = candidateInput.slug;
    const unique = ensureUniqueSlug(desired, candidateInput.id);

    const next: CaseStudyInput = { ...candidateInput, slug: unique };
    const parsed = CaseStudySchema.safeParse(next);
    if (!parsed.success) {
      alert("Can't save yet. Required fields missing (Client + Content).");
      return null;
    }

/*     const parsed = CaseStudySchema.safeParse(candidateInput);
    if (!parsed.success) {
      alert("Can't save yet. Required fields missing (Client + Content).");
      return null;
    } */

    upsertCaseStudy(parsed.data);
    setLastSavedAt(new Date().toLocaleTimeString());

    //keep UI and route consistent if the slug is changed
    if (unique !== slugDraft) setSlugDraft(unique);
    if (unique !== slug) router.replace(`/admin/case-studies/edit/${unique}`);

    return parsed.data;
  }

  function previewNow() {
    const out = saveOnly();
    if (!out) return;
    router.push(`/admin/case-studies/mock/${out.slug}`);
//    window.open(`/admin/case-studies/mock/${out.slug}`);
  }

/*   function previewOnly() {
    router.push(`/admin/case-studies/mock/${slug}`);
  } */

  // Not Found is rendered AFTER all hooks (inside JSX)
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

  return (
    <main className="c-admin">
      <ContextBanner view="preview">
        You’re editing a demo case study stored in your browser. Save commits changes to the local demo store.
        Preview shows what the public-facing template looks like.
      </ContextBanner>

      <div className="form-header">
        <h1 className="form-title">EDIT CASE STUDY</h1>
        {/* <div className="form-nav">
          <Link href="/admin">Admin</Link> |{" "}
          <Link href="/admin/case-studies/list">Case Study Library</Link> |{" "}
          <Link href={`/admin/case-studies/mock/${slug}`}>Preview</Link>
        </div> */}
      </div>

      <section className="card card-new mt1">
        <div className="card card-new">
          <div className="form-group">
            <label className="form-label">
              Client Name <span className="admin-label-required">(required)</span>
            </label>
            <input
              className="input"
              value={client}
              onChange={(e) => setClient(e.currentTarget.value)}
            />
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
              onChange={(e) => setWriteUp(e.currentTarget.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="heroImage">
              Upload an image <span className="admin-label-optional">(optional)</span>
            </label>
            <p className="admin-hint">
              If you don’t add one, a default image will be used.
            </p>
            <input id="heroImage" type="file" accept="image/*" onChange={handleHeroImageFileChange} />

            {/* {heroImageUrl ? ( */}
            {/* do not show preview of hero unless it's something other than default */}
            {showHeroPreview ? (
              <div className="mt heroPreview">
                <p className="muted type-small">Image Preview</p>
                <img
                  className="heroImagePreview"
                  src={heroImageUrl}
                  alt="Hero preview"
                />
              </div>
            ) : null}
          </div>

          {/* <div className="form-actions form-actions--top"> */}
          <div className="form-actions form-actions--top form-actions--editCaseStudy">
            <div className="form-actions__left">
              <button
                className="btnPrimary"
                type="button"
                onClick={saveOnly}
                disabled={!canSave}
                title={!canSave ? "Fix validation errors first" : "Save changes"}
              >
                Save
              </button>

              {/* <button className="btn" type="button" onClick={previewOnly}> */}
              <button className="btn" type="button" onClick={previewNow} disabled={!canSave}>
                Preview
              </button>

              <div className="save-status">
                {!canSave
                  ? "Can't save yet: Missing required fields (Client Name + Description)"
                  : dirty
                    ? "Unsaved changes."
                    : lastSavedAt
                      ? `Saved at ${lastSavedAt}.`
                      : "No changes"}
              </div>
            </div>

            <div className="form-group form-actions__publish">
              <label className="form-label">Publishing Status</label>
              <select
                className="input"
                value={publishState}
                onChange={(e) => setPublishState(e.currentTarget.value as PublishState)}
              >
                <option value="InternalDraft">Internal Draft</option>
                <option value="ClientViewable">Client-Viewable</option>
                <option value="Homepage">Published on Homepage</option>
              </select>
            </div>


            {/* <div style={{ flex: 1 }} />

            <div className="row" style={{ gap: 10, alignItems: "center" }}>
              <button
                type="button"
                className={`pillToggle ${publishState === "InternalDraft" ? "pillToggle--on" : ""}`}
                onClick={() => setPublishState("InternalDraft")}
                aria-pressed={publishState === "InternalDraft"}
              >
                Internal Draft
              </button>

              <button
                type="button"
                className={`pillToggle ${publishState === "ClientViewable" ? "pillToggle--on" : ""}`}
                onClick={() => setPublishState("ClientViewable")}
                aria-pressed={publishState === "ClientViewable"}
              >
                Client-Viewable
              </button>

              <button
                type="button"
                className={`pillToggle ${publishState === "Homepage" ? "pillToggle--on" : ""}`}
                onClick={() => setPublishState("Homepage")}
                aria-pressed={publishState === "Homepage"}
              >
                Published on Homepage
              </button>
            </div> */}

{/*             <button
              type="button"
              className={`pillToggle ${isPublic ? "pillToggle--on" : ""}`}
              onClick={() => {
                const next = !isPublic;
                setIsPublic(next);
                if (!next) setIsFeaturedHome(false);
              }}
              aria-pressed={isPublic}
            >
              Client-Viewable
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
            </button> */}
          </div>
        </div>
      </section>

      <div className="card card-new mt1">
        <details className="admin-collapse" open>
          <summary className="admin-collapse__summary">
            <div>
              <p className="admin-hint">
                {/* OPTIONAL: Assign categories and tags so this case study can be used in custom client pages. */}
                OPTIONAL: Assign categories so this case study can be used in custom client pages.
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

              <select
                id="sectorSelect"
                className="input"
                value={sector}
                onChange={onSectorChange}
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

{/*           <div className="form-row form-group" id="setSlug">
            <div className="form-field">
              <label className="form-label">URL slug</label>
              <p className="admin-hint">Leave blank to auto-generate from client name.</p>
              <input
                className="input"
                value={slugDraft}
                placeholder={autoSlug}
                onChange={(e) => setSlugDraft(e.currentTarget.value)}
                onBlur={() => {
                  if (!slugDraft.trim() && autoSlug) setSlugDraft(autoSlug);
                }}
              />
            </div>
          </div> */}

{/*           <div className="form-row form-group" id="tags">
            <div className="form-field">
              <label className="form-label" htmlFor="tagsInput">
                Tags
              </label>
              <input
                id="tagsInput"
                className="input"
                value={tags}
                onChange={(e) => setTags(e.currentTarget.value)}
              />
            </div>
          </div> */}

        </details>
      </div>
{/* 
      <div className="card card-new mt1">
        <h3>Validation</h3>
        {validation?.success ? (
          <p className="muted">✅ Valid (ready to save)</p>
        ) : (
          <pre className="error">
            ❌ Invalid{"\n\n"}
            {validation ? JSON.stringify(validation.error.format(), null, 2) : "Loading…"}
          </pre>
        )}
      </div> */}

    </main>
  );
}
