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
  useRef,
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
  SECTOR_LABELS,
  sectorLabel,
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


//export const showAdvanced = parsed.value;

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
  const DEFAULT_SECTOR = SECTOR_VALUES[0] as SectorValue;
  const [sector, setSector] = useState<SectorValue>(DEFAULT_SECTOR);
//  const [sector, setSector] = useState<(typeof SECTOR_VALUES)[number]>(SECTOR_VALUES[0]);
//  const [sectors, setSectors] = useState<SectorValue[]>(["GovContracting"]);
  /* const [sectors, setSectors] = useState<SectorValue[]>(["PublicSector"]); */
  /* const [sector, setSector] = useState<string>(""); */ // empty = none selected


/*   function toggleSector(v: SectorValue) {
    setSectors((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
    );
  } */

  const [year, setYear] = useState<string>("2025");
  const [tags, setTags] = useState("");
//  const [summaryShort, setSummaryShort] = useState("");//no longer let users see this 
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

  // summaryShort is required by schema -> always compute it
  const summaryShortAuto = useMemo(() => {
    // prefer author-written brief (aka social blurb); otherwise derive from the write-up
    return preview ?? deriveSummaryFromWriteUp(bodyMDX, 180);
  }, [preview, bodyMDX]);

  const effectiveTitle = title.trim() || client.trim();
  const slugBase = effectiveTitle;
  /* const slugBase = (client || title).trim(); */ // or just title if you're unifying them
  const autoSlug = useMemo(() => slugify(slugBase), [slugBase]);
  const effectiveSlug = useMemo(() => slugify(slug.trim() || autoSlug), [slug, autoSlug]);

  const candidateInput: CaseStudyInput = useMemo(() => {//NO HOOKS CAN GO HERE
    const displayName = client.trim(); // client name (required field)
    const effectiveTitle = title.trim() || displayName; // title falls back to client name if not set
    
    return {
      id,
      /* title: displayName, */
      title: effectiveTitle,
      client: emptyToUndefined(displayName),
      slug: slugify(slug || displayName),
      sectors: sector ? [sector as SectorValue] : [],
//      sectors,
      year: year ? Number(year) : undefined,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
  
      brief: preview,//optional blurb
      summaryShort: summaryShortAuto, // required, auto-filled, ALWAYS a string (may be "" if nothing typed)
      bodyMDX,
  
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
      title,
      //sectors, year, tags, 
      sector, year, tags,
      //brief, writeUp, 
      preview, summaryShortAuto, bodyMDX,
      heroImageUrl, 
      status, visibility, isFeaturedHome, isPublic
    ]);

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

  const canSave = validation.success; //reusable save button state
  const SaveButton = (
    <button
      /* className="btnPrimary" */
      className={`btnSave ${validation.success ? "btnSave--ready" : "btnSave--notReady"}`}
      type="button"
      onClick={save}
      disabled={!canSave}
      title={!canSave ? "Fix validation errors first" : "Save"}
    >
      Save + Preview
    </button>
  );

  function SaveBar({ className }: { className: string }) {
    return (
      <div className={className}>
        <div className="form-actions__left">
          <button
            /* className="btnPrimary" */
            className={`btnSave ${validation.success ? "btnSave--ready" : "btnSave--notReady"}`}
            type="button"
            onClick={save}
            disabled={!canSave}
            title={!canSave ? "Fix validation errors first" : "Save"}
          >
            Save + Preview
          </button>

          <div className="save-status">
            {canSave
              ? "Ready to save."
              : "Can't save yet: Missing required fields (Client Name + Description)"}
          </div>


        </div>
      </div>
    );
  }

  //helpers for formatting toolbar
  function applyWrap(left: string, right: string) {
    const el = writeUpRef.current;
    if (!el) return;
  
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
  
    const before = writeUp.slice(0, start);
    const selected = writeUp.slice(start, end);
    const after = writeUp.slice(end);
  
    const next = `${before}${left}${selected || "text"}${right}${after}`;
    setWriteUp(next);
  
    // restore selection around original selection
    requestAnimationFrame(() => {
      el.focus();
      const cursorStart = start + left.length;
      const cursorEnd = cursorStart + (selected || "text").length;
      el.setSelectionRange(cursorStart, cursorEnd);
    });
  }
  
  function applyPrefix(prefix: string) {
    const el = writeUpRef.current;
    if (!el) return;
  
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
  
    const before = writeUp.slice(0, start);
    const selected = writeUp.slice(start, end) || "item";
    const after = writeUp.slice(end);
  
    const lines = selected.split("\n").map((l) => (l.trim() ? prefix + l : l));
    const next = `${before}${lines.join("\n")}${after}`;
    setWriteUp(next);
  }
  
  function applyLink() {
    const url = prompt("Paste the URL:");
    if (!url) return;
    applyWrap("[", `](${url})`);
  }

  const writeUpRef = useRef<HTMLTextAreaElement | null>(null); //for the formatting toolbar (no markdown required)


    // INPUT -> ZOD VALIDATION -> STORED AS PARSED OUTPUT -> PREVIEW PAGE
   return (
    <main className="c-admin">
      <ContextBanner view="preview">
        This is a demo template for creating/editing case studies. After creating a new case study,
        you can preview them individually or as part of a mock database of case studies, where you can 
        filter by client type, tags, etc. <br/><br/>
        You can also see them on the public website if you set the status to "Published" and visibility to "Public"
      </ContextBanner>

      {/* <div className="row mt1"> */}
      <div className="form-header">
        <h1 className="form-title">CREATE A NEW CASE STUDY</h1>
        <div className="form-nav">
          <a href="/admin">Admin</a> |{" "}
          {/* <a href="/admin/case-studies/list">All case studies</a> |{" "} */}
          <a href="/admin/case-studies/list">Database View (All Case Studies)</a> |{" "}
          <a href="#client-views">Client Views</a>
        </div>
      </div>
      
{/* --------------------------------------------------------------------------------- */}
{/* CORE (REQUIRED) CONTENT */}
{/* --------------------------------------------------------------------------------- */}
      <div className="card card-new mt1 card--core"> 
        {/* BASIC DETAILS (always visible, minimum path; only required steps) */}
        <section aria-labelledby="write-title">
{/*           <h2 className="section-title-step" id="write-title">1) Write (required)</h2> */}
{/*           <p className="section-kicker">
            Minimum to create a case study: <strong>Client Name</strong> + <strong>Full write-up</strong>.
            Everything else is optional.
          </p> */}

          <div className="form-group">
            <label className="form-label" id="client-name-section">
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
              Case Study Content{" "}
              <span className="admin-label-required">(required)</span>
            </label>
            <p className="admin-hint">
              Write something about the case study here. Any format is OK (it can be notes or a full write-up)
            </p>

            {/* Small formatting toolbar. TODO: make it better */}
            <div className="editor">
              <div className="editor__toolbar" role="toolbar" aria-label="Formatting">
                <button className="editor__btn" type="button" onClick={() => applyWrap("**", "**")}>
                  Bold
                </button>
                <button className="editor__btn" type="button" onClick={() => applyWrap("*", "*")}>
                  Italic
                </button>
                <button className="editor__btn" type="button" onClick={() => applyPrefix("- ")}>
                  Bullets
                </button>
                <button className="editor__btn" type="button" onClick={() => applyLink()}>
                  <span className="text-ul">🔗 Link</span>
                </button>
              </div>

              <textarea
                ref={writeUpRef}
                className="editor__textarea"
                value={writeUp}
                onChange={(e) => setWriteUp(e.target.value)}
                placeholder="Write the case study description…"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="heroImage">
              Upload an image{" "}
              <span className="admin-label-optional">(optional)</span>
            </label>
            <p className="admin-hint">
              Provide an image for this case study. If you don’t add one, a default image will be used.
            </p>
            <div className="image-upload">
              <input
                id="heroImage"
                type="file"
                accept="image/*"
                onChange={handleHeroImageFileChange}
              />
            </div>
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

            {/* Always show a preview (fallback to default) */}
{/*             <div style={{ marginTop: "0.75rem" }}>
              <p className="muted type-small">Preview</p>
              <img
                src={heroImageUrl || DEFAULT_HERO_IMAGE_URL}
                alt="Hero preview"
                style={{ maxWidth: "100%", height: "auto", borderRadius: 8 }}
              />
            </div> */}
          </div>

          {/* STICKY SAVE BAR */}
          <SaveBar className="form-actions" />

          {/* debugging */}
{/*           <div className="muted type-small" style={{ marginTop: 6 }}>
            hasCore={String(hasCore)} | titleLen={title.trim().length} | clientLen={client.trim().length} | writeUpLen={writeUp.trim().length} | canSave={String(validation.success)}
          </div>

          {!validation.success && (
            <pre className="error" style={{ marginTop: 8 }}>
              {JSON.stringify(validation.error.format(), null, 2)}
            </pre>
          )} */}
{/*           <div className="form-actions form-actions--underEditor">
              <div className="form-actions__left">
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
          </div> */}
          {/* END OF STICKY SAVE BAR */}
        </section>
        </div>
{/* --------------------------------------------------------------------------------- */}
{/* END OF CORE (REQUIRED) CONTENT */}
{/* --------------------------------------------------------------------------------- */}
          
        {/* ORGANIZE, TAG, CATEGORIZE (optional, collapsible) */}
        <details className="admin-disclosure" id="organize">
        {/* <SaveBar className="form-actions--top" /> */}
          <summary className="admin-disclosure__summary">
            <div>
{/*               <h2 className="section-title" style={{ margin:0 }}>
                2) Organize, tag, categorize (optional)
              </h2> */}


              <label className="form-label-larger" htmlFor="heroImage">
                OPTIONAL FEATURES
              </label>
            </div>
            <span className="muted">Expand</span>
          </summary>
          
          <div className="form-row form-group" id="sector">
              <div className="admin-disclosure__hint">
                  {/* You can choose to add categories and tags to this case study so it can be used in custom websites created exclusively for specific clients. 
                  Tags and categories act like filters. */}
                  You can choose to add categories to this case study. <br /><br />

                  Categories are used to filter the case study database and create custom websites for specific clients.{" "}
                  For example, you can view all case studies categorized as <code>Local Government</code>{" "}
                  <a href="https://era-core-kit-site.vercel.app/local-government">here</a>

{/*                   Adding a tag to a case study is what will enable it to be used in the custom websites created exclusively for specific clients. 
                  <br /><br />                  
                  For example, if you tag a case study with <code>Local Government</code>, 
                  it will appear in  of all the public-sector–related case studies for potential new clients in that sector.
 */}
                  {/* These will act like filters for the Case Studies Database */}

                  {/* <p className="section-kicker" style={{ marginTop: "0.75rem" }}> */}
{/*                   <strong>Tags</strong> and <strong>Sectors</strong> create browse pages like
                  <code> /tag/legislation </code>and<code>{" "} /sector/nonprofit</code>.<br /><br /> */}
                {/* </p> */}
                  {/* Maybe say something about ability to search? */}
              </div>
              <div className="form-field">          
                {/* <h2 className="cms-h3">Client type</h2> */}
                <label className="form-label" htmlFor="sector">
                  Category
                  {/* Client Type / Sector */}
                  {/* Sectors */}
                </label>
                <p className="admin-hint">
                  Choose a category that best describes the client in this case study. 
                  {/* Select the primary client type (a.k.a. sector) for this case study. */}
                </p>                
                <select
                  id="sector"
                  className="input"
                  value={sector}
                  /* onChange={(e) => setSector(e.target.value)} */
                  onChange={(e) => setSector(e.target.value as SectorValue)}
                >
{/*                   <option value="">Select a client type (sector)</option>
                    {SECTOR_VALUES.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))} */}

                <option value="">Select a category</option>
                {SECTOR_VALUES.map((v) => (
                  <option key={v} value={v}>
                    {sectorLabel(v)}
                  </option>
                ))}

                </select>
{/*                 <p className="muted type-small">
                  For now, pick one sector; in the final version, you'll be able to pick multiple.
                </p> */}
              </div>
          </div>

{/*           <div className="form-row form-group" id="tags">
              <div className="form-field">
                <label className="form-label" htmlFor="tags">
                  Tags
                </label>
                <p className="admin-hint">
                  You can also add short keywords that describe the case study, e.g.{" "}
                  <code>environment</code>, <code>appropriations</code>).<br /><br />
                  Tags are another way to create filter pages and “collections” for specific clients.{" "}
                  Separate tags with commas. */}
                  {/* Short keywords that describe the work (e.g. <code>environment</code>,{" "}
                  <code>local government</code>, <code>appropriations</code>). 
                  Tags are another way to create filter pages and “collections” for specific clients.
                  Separate tags with commas.*/}
{/*                 </p>
                <input
                  className="input"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                /> */}

                {/* Tag preview chips (tactile, even before list-page improvements) */}
{/*                 <div className="client-links">
                  {tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((t) => (
                      <span key={t} className="chip chip--soft">{t}</span>
                    ))}
                </div>
              </div>
          </div> */}

          <div className="form-row form-group">
            <div className="form-field">
              <label className="form-label">Status</label>
              <select className="input" value={status} onChange={(e) => setStatus(e.target.value as any)}>
                {CASE_STUDY_STATUS_VALUES.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Visibility</label>
              <select className="input" value={visibility} onChange={(e) => setVisibility(e.target.value as any)}>
                {CASE_STUDY_VISIBILITY_VALUES.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>


          {/* <SaveBar className="form-actions--bottom" /> */}
          <SaveBar className="form-actions" />

          
{/* --------------------------------------------------------------------------------- */}

{/* ADVANCED UI. Keep truly advanced stuff behind showAdvanced for now. set showAdvanced to 1 to make all this visible */}
      {showAdvanced && (
        <>
        <fieldset className="form-group">
          <legend className="form-label">Outcomes (advanced)</legend>
          {/* outcomes editing UI here */}
        </fieldset>

        <div className="form-row form-group">
            <label className="form-label">Unique identifier for URL path <em>(defaults to client name if not set by user)</em></label>
            <input
              className="input"
              value={slug}
              placeholder={autoSlug}
              onChange={(e) => setSlug(e.target.value)}
              onBlur={() => {
                if (!slug.trim() && autoSlug) setSlug(autoSlug);
              }}
            />
        </div>

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
{/*             <div className="form-field">
              <label className="form-label">Sectors</label>
              <div className="admin-checkbox-row" style={{ marginTop: ".5rem" }}></div>
                {SECTOR_VALUES.map((v) => (
                  <label key={v}>
                    <input
                      type="checkbox"
                      checked={sectors.includes(v)}
                      onChange={() => toggleSector(v)}
                    />
                    {sectorLabel(v)}
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

          <div className="muted type-small" style={{ marginTop: 6 }}>
            hasCore={String(hasCore)} | titleLen={title.trim().length} | clientLen={client.trim().length} | writeUpLen={writeUp.trim().length} | canSave={String(validation.success)}
          </div>

          {!validation.success && (
            <pre className="error" style={{ marginTop: 8 }}>
              {JSON.stringify(validation.error.format(), null, 2)}
            </pre>
          )}



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
        </details>
      
      
    </main>
  );
}
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
          {/* </div> */} {/* end of form-actions div */}

{/* end of card card-new div */}
{/*         </div>
      </section>  */}
{/*       </div> */}
{/* END OF CORE (REQUIRED) CONTENT */}

