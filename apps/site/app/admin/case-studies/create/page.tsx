// apps/site/app/admin/case-studies/create/page.tsx

//alternate create page

// apps/site/app/admin/case-studies/new/page.tsx
"use client";

import "@styles/admin-cms-buttons.css";
import "@styles/admin-cms.css";

import { showAdvanced } from "@/lib/featureFlags";

import { 
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
  type ChangeEvent,
} from "react";

import Link from "next/link";

import {
  CaseStudy as CaseStudySchema,
  type CaseStudyInput,
  type CaseStudyType,
  type SectorValue,
  SECTOR_VALUES,
  CASE_STUDY_STATUS_VALUES,
  CASE_STUDY_VISIBILITY_VALUES,
  DEFAULT_HERO_IMAGE_URL,
  deriveSummaryFromWriteUp,
  plainTextToMdxPreservingLineBreaks,
} from "@kit/schema";

//import hook & router for advanced builder (where we can save a new case study and see it go into the memory store)
import { useRouter } from "next/navigation";
import { useAdminCaseStudies } from "../../AdminCaseStudyStore";

import { ContextBanner } from "@/admin/components/ContextBanner";

import { normalizeTagList } from "@kit/schema";

// env: "1", "true", "yes", "on" => true
// env: "0", "false", "no", "off", undefined => false
function parseEnvFlag(raw: string | undefined, defaultValue: boolean) {
  const v = raw?.trim().toLowerCase();
  if (!v) return { ok: true as const, value: defaultValue };

  if (["1", "true", "yes", "y", "on"].includes(v)) return { ok: true as const, value: true };
  if (["0", "false", "no", "n", "off"].includes(v)) return { ok: true as const, value: false };

  return { ok: false as const, value: defaultValue, raw };
}

const defaultValue = false;
const raw = process.env.NEXT_PUBLIC_SHOW_OUTCOMES;

const parsed = parseEnvFlag(raw, defaultValue);

if (!parsed.ok) {
  const msg =
    `[env] NEXT_PUBLIC_SHOW_OUTCOMES="${raw}" is invalid. ` +
    `Use 1/0 or true/false (or omit it).`;

  if (process.env.NODE_ENV !== "production") {
    throw new Error(msg);
  } else {
    console.warn(msg);
  }
}

/* export const showAdvanced = parsed.value; */
//const showAdvanced = parsed.value;

/* export function envFlag(name: string, defaultValue = false) {
  const raw = process.env[name];
  const v = raw?.trim().toLowerCase();

  if (v == null || v === "") return defaultValue;

  if (["1", "true", "yes", "y", "on"].includes(v)) return true;
  if (["0", "false", "no", "n", "off"].includes(v)) return false;

  // Unknown value -> default
  console.warn(
    `[envFlag] ${name} has invalid value "${raw}". Using default=${defaultValue}. ` +
    `Use 1/0 or true/false.`
  );
  return defaultValue;
} */


/* function envFlag(name: string, defaultValue = false) {
  const v = process.env[name]?.trim().toLowerCase();
  if (v == null || v === "") return defaultValue;
  if (["1", "true", "yes", "y", "on"].includes(v)) return true;
  if (["0", "false", "no", "n", "off"].includes(v)) return false;
  return defaultValue; 
} */

/* export const showAdvanced = envFlag("NEXT_PUBLIC_SHOW_OUTCOMES", false);//change to true to show advanced controls
 */
/* function slugify(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
} */

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type Draft = Partial<CaseStudyInput>;

function emptyToUndefined(s: unknown): string | undefined {
  if (typeof s !== "string") return undefined;
  const t = s.trim();
  return t ? t : undefined;
}

function autoSummaryFromText(text: string, max = 180) {
  const t = text.trim().replace(/\s+/g, " ");
  if (!t) return "";
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 60 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

export default function NewCaseStudyPage() {
  const router = useRouter();
  const { upsertCaseStudy, ensureUniqueSlug } = useAdminCaseStudies();

  const [id] = useState(() =>
    typeof crypto !== "undefined" ? crypto.randomUUID() : String(Date.now())
  );

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [client, setClient] = useState("");
//  const [sector, setSector] = useState<(typeof SECTOR_VALUES)[number]>(SECTOR_VALUES[0]);
//  const [sectors, setSectors] = useState<SectorValue[]>(["GovContracting"]);
  /* const [sectors, setSectors] = useState<SectorValue[]>(["PublicSector"]); */
  const [sector, setSector] = useState<string>(""); // empty = none selected


/*   function toggleSector(v: SectorValue) {
    setSectors((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
    );
  } */

  const [year, setYear] = useState<string>("2025");
  const [tags, setTags] = useState("");
//  const [summaryShort, setSummaryShort] = useState("");//no longer let users see this 
//  const [heroImageUrl, setHeroImageUrl] = useState("/img/case1.webp");
  const [heroImageUrl, setHeroImageUrl] = useState<string>("");

  //adding a change handler so users can upload an image
  function handleHeroImageFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setHeroImageUrl("");
      return;
    }
  
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        // result is a data: URL like "data:image/png;base64,...."
        setHeroImageUrl(result);
      }
    };
    reader.readAsDataURL(file);
  }
  
//  const [bodyMDX, setBodyMDX] = useState("## Summary\n\n");//no longer let users see this
  const [status, setStatus] = useState<(typeof CASE_STUDY_STATUS_VALUES)[number]>("Draft");
  const [visibility, setVisibility] =
    useState<(typeof CASE_STUDY_VISIBILITY_VALUES)[number]>("Internal");
  const [isFeaturedHome, setIsFeaturedHome] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  
  // form state
  const [writeUp, setWriteUp] = useState("");      // this replaces editing bodyMDX directly
  const [brief, setBrief] = useState("");          // “Preview blurb” (optional)

  // Flag to signal that core required fields have been completed (unlocks enhancements once the basics are there)
  const hasCore = client.trim().length > 0 && writeUp.trim().length > 0;

  // Derived fields (DO NOT put hooks inside other hooks)
  const bodyMDX = useMemo(() => writeUp, [writeUp]); // writeUp already contains markdown from your toolbar
  const preview = useMemo(() => emptyToUndefined(brief), [brief]);
  //    const preview = useMemo(() => brief.trim() || undefined, [brief]);

  // summaryShort is required by schema -> always compute it
  const summaryShortAuto = useMemo(() => {
    // prefer author-written brief (aka social blurb); otherwise derive from the write-up
    return preview ?? deriveSummaryFromWriteUp(bodyMDX, 180);
  }, [preview, bodyMDX]);

  const slugBase = (client || title).trim(); // or just title if you're unifying them
  const autoSlug = useMemo(() => slugify(slugBase), [slugBase]);
  const effectiveSlug = useMemo(() => slugify(slug.trim() || autoSlug), [slug, autoSlug]);

  const candidateInput: CaseStudyInput = useMemo(() => {//NO HOOKS CAN GO HERE
    //const bodyMDX = plainTextToMdxPreservingLineBreaks(writeUp);
    //const bodyMDX = writeUp; // writeUp is now “markdown with a toolbar”
  
    //const preview = brief.trim() || undefined;

    //const summaryShort = preview ?? deriveSummaryFromWriteUp(bodyMDX, 180);
//    const computedSummaryShort = useMemo(() => {
//      return preview ?? deriveSummaryFromWriteUp(bodyMDX, 180);
//    }, [preview, bodyMDX]);
    const displayName = client.trim(); // the one true field
    return {
      id,
      //title: title.trim(),
      //slug: slugify(slug || client || title),
      //client: client.trim() || undefined,
      title: displayName,
      client: emptyToUndefined(displayName),
      slug: slugify(slug || displayName),
      sectors: sector ? [sector as SectorValue] : [],
//      sectors,
//      sector,
      year: year ? Number(year) : undefined,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
  
      brief: preview,//optional blurb
      summaryShort: summaryShortAuto, // required, auto-filled, ALWAYS a string (may be "" if nothing typed)
      //summaryShort: summaryShort.trim() || undefined,
      bodyMDX,
  
      //heroImageUrl: heroImageUrl.trim() || undefined,
      heroImageUrl: emptyToUndefined(heroImageUrl) ?? DEFAULT_HERO_IMAGE_URL,
  
      mechanisms: [],
      jurisdictions: [],
      outcomes: [],
      evidence: [],
      sections: [],
      attachments: [],
      links: [],
  
      status,
      visibility,
      isFeaturedHome,
      isPublic,
    };
  }, [
      //id, title, slug, client, 
      id, client, slug,
      //sectors, year, tags, 
      sector, year, tags,
      //brief, writeUp, 
      preview, summaryShortAuto, bodyMDX,
      heroImageUrl, 
      status, visibility, isFeaturedHome, isPublic
    ]);

//  const candidateInput: CaseStudyInput = useMemo(
//    () => ({
//      id,
////      id: typeof crypto !== "undefined" ? crypto.randomUUID() : String(Date.now()),
//      title: title.trim(),
//      slug: slugify(slug || title),
//      client: client.trim() || undefined,
//      sectors,
//      year: year ? Number(year) : undefined,
//
//      tags: tags
//        .split(",")
//        .map((t) => t.trim())
//        .filter(Boolean),
//        //.slice(0, 10),//limits the number of tags
//
//      summaryShort: summaryShort.trim(),
//      brief: undefined,
//
//      //heroImageUrl: heroImageUrl.trim(),
//      heroImageUrl: heroImageUrl.trim() || undefined,
//
//      mechanisms: [],
//      jurisdictions: [],
//      outcomes: [],
//      evidence: [],
//      bodyMDX: bodyMDX || "",
//      sections: [],
//      attachments: [],
//      links: [],
//
//      status,
//      visibility,
//      isFeaturedHome,
//      isPublic,
//    }),
//    [
//      title,
//      slug,
//      client,
//      sectors,
//      year,
//      tags,
//      summaryShort,
//      heroImageUrl,
//      bodyMDX,
//      status,
//      visibility,
//      isFeaturedHome,
//      isPublic,
//    ],
//  );

  const validation = useMemo(
    () => CaseStudySchema.safeParse(candidateInput), 
    [candidateInput]
  );

  function save() {
    // Make slug collision-safe right at the save boundary
    const desired = candidateInput.slug;
    const unique = ensureUniqueSlug(desired, candidateInput.id);

    const next: CaseStudyInput = { ...candidateInput, slug: unique };
    const res = CaseStudySchema.safeParse(next);
    if (!res.success) return;

    const out: CaseStudyType = res.data;
    upsertCaseStudy(out);
    router.push(`/admin/case-studies/mock/${out.slug}`);
  }
/*     if (!validatedCaseStudy) {
      setError("Please validate the case study before saving.");
      return;
    }

    addCaseStudy(validatedCaseStudy);
    router.push(`/admin/case-studies/mock/${validatedCaseStudy.slug}`);
  } */

    // INPUT -> ZOD VALIDATION -> STORED AS PARSED OUTPUT -> PREVIEW PAGE
   return (
    <main className="c-admin">
      <ContextBanner view="preview">
        This is a demo template for creating/editing case studies. After creating a new case study,
        you can preview them individually or as part of a mock database of case studies, where you can 
        filter by client type, tags, etc. <br/><br/>
        The case study objects you create in this demo are stored only in your browser. 
        They will remain viewable by you as long as you don't clear 
        your cache/use incognito mode, but they are not connected to any persistent backend.
      </ContextBanner>

      {/* <div className="row mt1"> */}
      <div className="form-header">
        <h1 className="form-title">CREATE A NEW CASE STUDY</h1>
        <div className="form-nav">
          <a href="/admin">Admin</a> |{" "}
          <a href="/admin/case-studies/list">All case studies</a> |{" "}
          <a href="#client-views">Client Views</a>
        </div>
      </div>

{/* --------------------------------------------------------------------------------- */}
{/* CORE (REQUIRED) CONTENT */}
{/* --------------------------------------------------------------------------------- */}

{/*       <div className="card card-new mt1"> */}
      <section className="card card-new mt1"> 
        {/* STEP 1 – BASIC DETAILS (always visible, minimum path) */}
        <div className="card card-new">
{/*           <div className = "form-group">
            <label className="form-label">Title</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div> */}

          {/* <div className="form-field"> */}
          <div className="form-group">
            {/* Client name (used as title) */}
            <label className="form-label">
              Client Name{" "}
              <span className="admin-label-required">(required)</span>
            </label>
            <input className="input" 
              value={client} 
              onChange={(e) => setClient(e.target.value)} 
            />
          </div>

          {/* Case study write-up */}
          <div className="form-group" id="write-up-section">
            <label className="form-label">
              {/* Describe the case study */}
              Description{" "}
              <span className="admin-label-required">(required)</span>
            </label>
            <p className="admin-hint">
              Write something about the case study here. Any format is OK (it can be notes or a full write-up)
            </p>
            <textarea
              className="input"
              style={{ minHeight: 160 }}
              value={writeUp}
              onChange={(e) => setWriteUp(e.target.value)}
            />
          </div>

          <div className="form-group">
            {/* OLD form for hero image. allowed URL input only. */}
            {/* <label className="form-label">Hero image URL (required; default used if blank) (/img/... or https://...)</label>
            <input
              className="input"
              placeholder={DEFAULT_HERO_IMAGE_URL}
              value={heroImageUrl}
              onChange={(e) => setHeroImageUrl(e.target.value)}
            /> */}
            <label className="form-label" htmlFor="heroImage">
              Upload an image{" "}
              <span className="admin-label-optional">(optional)</span>
            </label>
            <p className="admin-hint">
              Provide an image for this case study. If you don’t add one, a default image default image will be used.
            </p>
            <input
              id="heroImage"
              type="file"
              accept="image/*"
              onChange={handleHeroImageFileChange}
            />

            {heroImageUrl && (
              <div style={{ marginTop: "0.75rem" }}>
                <p className="muted type-small">Preview</p>
                <img
                  src={heroImageUrl}
                  alt="Hero preview"
                  style={{ maxWidth: "100%", height: "auto", borderRadius: 8 }}
                />
              </div>
            )}
          </div>

          {/* STICKY SAVE BAR */}
          <div className="form-actions form-actions--top">
            <div className="form-actions__left">
            {/* <div className="form-actions__right"> */}

              {/* Primary action – Save + Preview */}
              <button
                className="btnPrimary"
                type="button"
                onClick={save}
                disabled={!validation.success}
                title={!validation.success ? "Fix validation errors first" : "Save"}
              >
                Save + Preview
              </button>

              <div className="save-status">
                {validation.success ? "Ready to save." : "Can't save yet: Missing required fields (Client Name + Description)"}
              </div>
            </div>

{/*         <div className="form-actions__cluster" aria-label="Publishing + save"> */}
{/*         <div className="form-actions__toggles" aria-label="Publishing settings"> */}
{/*           <button className="btn" type="button"
            onClick={() => setSlug(slugify(slug || title))}
            title="Turn title into URL path"
          >
          {/*           <button className="btn" type="button"
            onClick={() => setSlug(slugify(slug || client))}
            title="Turn title into URL path"
          >
            Turn title into URL path
          </button> */}

          {/* <div className="form-actions__left"> */}
            {/* optional: keep empty, or put other tools here */}
          {/* </div> */}

{/* ************************************************************************* */}
{/* TEMPORARILY HIDDEN FOR CLEANER DEMO UI: RE-ENABLE LATER, ESSENTIAL FEATURES */}
{/*           <div className="form-actions__toggles" aria-label="Publishing settings">
              <label className="toggle-pill">
                <input
                  type="checkbox"
                  checked={isFeaturedHome}
                  onChange={(e) => setIsFeaturedHome(e.target.checked)}
                />
                <span>Featured on Public Website</span>
              </label>

              <label className="toggle-pill">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
                <span>Client Viewable (not on homepage, but viewable by clients)</span>
              </label>
            </div> */}
{/* ************************************************************************* */}
        {/* </div> */}

          {/* </div> */}
          </div> {/* end of form-actions div */}

{/* end of card card-new div */}
{/*         </div>
      </section>  */}
{/*       </div> */}
{/* END OF CORE (REQUIRED) CONTENT */}


{/* --------------------------------------------------------------------------------- */}
{/* ADVANCED CONTENT */}
{/*       <section className="card card-new mt1">  */}
        {/* STEP 2 – CLIENT TYPE & TAGS (collapsible) */}
{/*         <div className="card card-new"> */}
</div>
<div className="card card-new mt1">
          <details className="admin-collapse" open>
            <summary className="admin-collapse__summary">
              <div>

                <p className="admin-hint">
                  OPTIONAL: Assign categories and tags so this case study can be used in custom websites for created exclusively for certain clients. Tags and categories are what allow filtering and searching.
                  For example, you might tag a case study with "Public Sector" so it can appear in a custom page of all the public-sector–related case studies for potential new clients in that sector.
                </p>
              </div>
              <span className="admin-collapse__chevron" aria-hidden="true">
                ▶
              </span>
            </summary>

            <div className="form-row form-group" id="sector">
              <div className="form-field">          
                {/* <h2 className="cms-h3">Client type</h2> */}
                <label className="form-label" htmlFor="sector">
                  Client Type
                  {/* Sectors */}
                </label>
                <p className="admin-hint">
                  Select the primary sector (a.k.a. client type) for this case study.
                </p>                
                <select
                  id="sector"
                  className="input"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                >
                  <option value="">Select a sector (client type)</option>
                    {SECTOR_VALUES.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  
                </select>
{/*                 <p className="muted type-small">
                  For now, pick one sector; in the final version, you'll be able to pick multiple.
                </p> */}
              </div>
            </div>

            <div className="form-row form-group" id="tags">
              <div className="form-field">
                {/* <h2 className="cms-h3">Tags</h2> */}
                <label className="form-label" htmlFor="tags">
                  Tags
                </label>
                <p className="admin-hint">
                  Short keywords that describe the work (e.g. <code>environment</code>,{" "}
                  <code>local government</code>, <code>appropriations</code>).
                  Tags combine with client type to create “collections” for specific clients.
                  Separate tags with commas.
                </p>
                <input
                  className="input"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </div>



          </details>


</div>
      </section>

{/* ADVANCED UI. set showAdvanced to 1 to make all this visible */}
      {showAdvanced && (
        <>
        <fieldset className="form-group">
          <legend className="form-label">Outcomes (advanced)</legend>
          {/* outcomes editing UI here */}
        </fieldset>

        <div className="form-row form-group" id="sectors-checkboxes">
{/*             <div className="form-field">
              <label className="form-label">Sectors</label>
              <div className="admin-checkbox-row" style={{ marginTop: ".5rem" }}>
                {SECTOR_VALUES.map((v) => (
                  <label key={v}>
                    <input
                      type="checkbox"
                      checked={sectors.includes(v)}
                      onChange={() => toggleSector(v)}
                    />
                    {v}
                  </label>
                ))}
              </div>
            </div> */}

            <div className="form-field form-field--small">
              <label className="form-label">Year</label>
              <input className="input" value={year} onChange={(e) => setYear(e.target.value)} />
            </div>
          </div>

          {/* <div className="row" style={{ marginTop: "1rem" }}> */}
          <div className="form-row form-group">
            {/* <div style={{ flex: 1, minWidth: 220 }}> */}
            <div className="form-field">
              <label className="form-label">Status</label>
              <select className="input" value={status} onChange={(e) => setStatus(e.target.value as any)}>
                {CASE_STUDY_STATUS_VALUES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            {/* <div style={{ flex: 1, minWidth: 220 }}> */}
            <div className="form-field">
              <label className="form-label">Visibility</label>
              <select
                className="input"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as any)}
              >
                {CASE_STUDY_VISIBILITY_VALUES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* <div style={{ marginTop: "1rem" }}> */}
          <div className="form-group">
            <label className="form-label">Tags (comma-separated)</label>
            <input className="input" value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>

          {/* <div style={{ marginTop: "1rem" }}> */}
{/*           <div className="form-group">
            <label className="form-label">Summary short (required)</label>
            <input
              className="input"
              value={summaryShort}
              onChange={(e) => setSummaryShort(e.target.value)}
            />
          </div> */}

{/*           OPTION: SHOW THE AUTO-GENERATED summaryShort
          for now I'm removing it to reduce confusion */}
{/*           <div className="form-group">
            <label className="form-label">Summary short (auto)</label>
            <input className="input" value={summaryShortAuto} readOnly />
          </div> */}



{/*           <div className="form-row">
            <label className="row" style={{ gap: ".5rem" }}>
              <input
                type="checkbox"
                checked={isFeaturedHome}
                onChange={(e) => setIsFeaturedHome(e.target.checked)}
              />
              Featured on homepage
            </label>
          </div>
          <div className="form-row">
            <label className="row" style={{ gap: ".5rem" }}>
              <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
              isPublic
            </label>
          </div>
 */}
          <div className="form-group">
            <label className="form-label">Unique identifier for URL path <em>(defaults to client name if not set by user)</em></label>
{/*             <input className="input" value={slug} onChange={(e) => setSlug(e.target.value)} />
 */}            <input
              className="input"
              value={slug}
              placeholder={autoSlug}
              onChange={(e) => setSlug(e.target.value)}
              onBlur={() => {
                if (!slug.trim() && autoSlug) setSlug(autoSlug);
              }}
            />
          </div>

        <div className="card card-new mt">
          <h3>Validation</h3>
          <p>Check what needs to be added to/changed in your draft so you can "publish" it.</p>
          {validation.success ? (
            <p className="muted">✅ Valid (ready to save)</p>
          ) : (
            <pre className="error">
              ❌ Invalid
              {"\n\n"}
              {JSON.stringify(validation.error.format(), null, 2)}
            </pre>
          )}
        </div>
        </>
      )}

{/* END OF ADVANCED UI. */}

    </main>
  );
}


/* export default function NewCaseStudyForm() {
  //implementing the hook & router for the advanced builder
  const router = useRouter();
  const { addCaseStudy } = useAdminCaseStudies();

  const [draft, setDraft] = useState<Draft>({
    title: "",
    slug: "",
    client: "",
    sector: "GovContracting",
    summaryShort: "",
    brief: "",
    heroImageUrl: "",

    status: "Draft",
    visibility: "Internal",
    isFeaturedHome: false,
    isPublic: true,
  });

  const [tagsInput, setTagsInput] = useState("");
  const [contextBody, setContextBody] = useState("");
  const [approachBody, setApproachBody] = useState("");
  const [impactBody, setImpactBody] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<CaseStudyType | null>(null);
  const [validatedCaseStudy, setValidatedCaseStudy] =
    useState<CaseStudyType | null>(null);
//  const [validatedCase, setValidatedCase] = useState<CaseStudyType | null>(null);
  const isValidated = !!validatedCaseStudy;
//  const [validated, setValidated] = useState<boolean>(false);
//  const [validated, setValidated] = useState<CaseStudyType | null>(null);

  function resetValidation() {
    setError(null);
    setPreview(null);
//    setValidatedCase(null);
//    setValidated(null);
//    setValidated(false);
    setValidatedCaseStudy(null);
  }

  function update<K extends keyof Draft>(field: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [field]: value }));
    //setError(null);
    //setPreview(null);
    resetValidation();
  }

  function toggleMechanism(mech: CaseStudyType["mechanisms"][number]) {
    setDraft((d) => {
      const current = d.mechanisms ?? [];
      const exists = current.includes(mech);
      const next = exists
        ? current.filter((m) => m !== mech)
        : [...current, mech];
      return { ...d, mechanisms: next };
    });
    //setError(null);
    //setPreview(null);
    resetValidation();
  }

  function toggleJurisdiction(j: CaseStudyType["jurisdictions"][number]) {
    setDraft((d) => {
      const current = d.jurisdictions ?? [];
//       const exists = current.includes(j);
//      const next = exists ? current.filter((v) => v !== j) : [...current, j]; 
      const next = current.includes(j)
        ? current.filter((v) => v !== j)
        : [...current, j];
      return { ...d, jurisdictions: next };
    });
//     setError(null);
//    setPreview(null); 
    resetValidation();
  }

  function validate() {
    // ... build candidate as CaseStudyInput, not CaseStudyType
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const sections: CaseStudyInput["sections"] = [
      contextBody.trim()
        ? { id: "context", title: "Context", bodyMDX: contextBody }
        : null,
      approachBody.trim()
        ? { id: "approach", title: "Approach", bodyMDX: approachBody }
        : null,
      impactBody.trim()
        ? { id: "impact", title: "Impact", bodyMDX: impactBody }
        : null,
    ].filter(Boolean) as CaseStudyInput["sections"];

    const finalTitle = (draft.title ?? "").trim();
    const finalSlug = emptyToUndefined(draft.slug) ?? slugify(finalTitle);

    const candidate: CaseStudyInput = {
      id: draft.id ?? `draft-${Date.now()}`,
      //title: draft.title ?? "",
      title: finalTitle,
      //slug: draft.slug ?? "",
      slug: finalSlug,

      //client: draft.client ?? undefined,
      client: emptyToUndefined(draft.client),
      //sector: draft.sector ?? "GovContracting",
      sector: (draft.sector ?? "GovContracting") as CaseStudyType["sector"],
      year: draft.year,
  
      tags,
      summaryShort: (draft.summaryShort ?? "").trim(),
      //brief: draft.brief ?? undefined,
      brief: emptyToUndefined(draft.brief),

      heroImageUrl: draft.heroImageUrl ?? "/img/temp.svg", // must be valid PathOrUrl
  
      mechanisms: draft.mechanisms ?? [],
      jurisdictions: draft.jurisdictions ?? [],
      outcomes: draft.outcomes ?? [],
      evidence: draft.evidence ?? [],
  
      bodyMDX: draft.bodyMDX ?? "",
      sections,
  
      attachments: draft.attachments ?? [],
      links: draft.links ?? [],

      status: (draft.status ?? "Draft") as CaseStudyType["status"],
      visibility: (draft.visibility ?? "Internal") as CaseStudyType["visibility"],
  
      isFeaturedHome: draft.isFeaturedHome ?? false,
      isPublic: draft.isPublic ?? true,
      // status/visibility will default
    };
  
    const result = CaseStudySchema.safeParse(candidate);

    if (!result.success) {
      const issue = result.error.issues[0];
      const path = issue?.path?.length ? issue.path.join(".") : "(root)";
      setError(
        `${path}: ${
          issue?.message ?? 
          "Validation failed. Please validate the case study before saving."
        }`
      );
      // ... setError
      setPreview(null);
      //setValidated(null);
      //setValidated(false);
      setValidatedCaseStudy(null);
      return;
    }

    const parsed: CaseStudyType = result.data;
  
    setError(null);
    //setPreview(result.data);
    setPreview(parsed);
    //setValidated(true);
    setValidatedCaseStudy(parsed);
    //setValidated(result.data);
  } */

/*   function validate() {
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const sections: CaseStudyType["sections"] = [
      contextBody.trim()
        ? { id: "context", title: "Context", bodyMDX: contextBody }
        : null,
      approachBody.trim()
        ? { id: "approach", title: "Approach", bodyMDX: approachBody }
        : null,
      impactBody.trim()
        ? { id: "impact", title: "Impact", bodyMDX: impactBody }
        : null,
    ].filter(Boolean) as CaseStudyType["sections"];

    const candidate: CaseStudyType = {
      id: draft.id ?? `draft-${Date.now()}`,
      title: draft.title ?? "",
      slug: draft.slug ?? "",
      client: draft.client ?? "",
      sector: draft.sector ?? "GovContracting",
      year: draft.year ?? undefined,

      tags,
      summaryShort: draft.summaryShort ?? "",
      brief: draft.brief ?? undefined,
      heroImageUrl: draft.heroImageUrl ?? "",

      mechanisms: draft.mechanisms ?? [],
      jurisdictions: draft.jurisdictions ?? [],
      outcomes: draft.outcomes ?? [],
      evidence: draft.evidence ?? [],

      bodyMDX: draft.bodyMDX ?? "",
      sections,

      attachments: draft.attachments ?? [],
      links: draft.links ?? [],

      isFeaturedHome: draft.isFeaturedHome ?? false,
      isPublic: draft.isPublic ?? true,
    };

    const result = CaseStudySchema.safeParse(candidate);

    if (!result.success) {
      const issue = result.error.issues[0];
      const path = issue?.path?.length ? issue.path.join(".") : "(root)";
      setError(`${path}: ${issue?.message ?? "Validation failed. Please validate the case study before saving."}`);
      setPreview(null);
      setValidated(null);
      return;
    }

    //now we have result.data (it's only real after the result.success check)    
    // however, some Zod typings make data possibly-undefined even on success:
    const parsed = result.data ?? candidate;

    setError(null);
    setPreview(parsed);
    setValidated(parsed);
    // DO NOT ADD OR PUSH YET!
  } */


