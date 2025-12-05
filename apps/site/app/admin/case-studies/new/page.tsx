// apps/site/app/admin/case-studies/new/page.tsx
"use client";

import "@styles/admin-cms-buttons.css";
import "@styles/admin-cms.css";

import { 
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import Link from "next/link";
import {
  CaseStudy as CaseStudySchema,
//  type CaseStudy as CaseStudyType,
  type CaseStudyInput,
  type CaseStudyType,
} from "@kit/schema";

//import hook & router for advanced builder (where we can save a new case study and see it go into the memory store)
import { useRouter } from "next/navigation";
import { useAdminCaseStudies } from "../../AdminCaseStudyStore";

type Draft = Partial<CaseStudyInput>;

const [preview, setPreview] = useState<CaseStudyType | null>(null);
//const [validated, setValidated] = useState<CaseStudyType | null>(null);
const [validated, setValidated] = useState(false);
const [validatedCaseStudy, setValidatedCaseStudy] = useState<CaseStudyType | null>(null);

const sectorOptions: CaseStudyType["sector"][] = [
  "Defense",
  "Health",
  "FinTech",
  "Education",
  "Nonprofit",
  "GovContracting",
  "EmergencyMgmt",
];

const mechanismOptions: CaseStudyType["mechanisms"][number][] = [
  "Appropriation",
  "Earmark",
  "Grant",
  "TaxCredit",
];

const jurisdictionOptions: CaseStudyType["jurisdictions"][number][] = [
  "Federal",
  "State",
  "Local",
];

// keep in sync with schema enums here for now
// (if later we export CASE_STUDY_STATUS_VALUES etc, we can import them instead.)
const statusOptions: CaseStudyType["status"][] = [
  "Draft",
  "InProgress",
  "NeedsReview",
  "Approved",
  "Published",
  "Archived",
];

const visibilityOptions: CaseStudyType["visibility"][] = [
  "Public",
  "Internal",
  "ClientSafe",
];

function slugify(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function emptyToUndefined(s: unknown): string | undefined {
  if (typeof s !== "string") return undefined;
  const t = s.trim();
  return t ? t : undefined;
}

export default function NewCaseStudyForm() {
  /*implementing the hook & router for the advanced builder*/
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
    /*setError(null);
    setPreview(null);*/
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
    /*setError(null);
    setPreview(null);*/
    resetValidation();
  }

  function toggleJurisdiction(j: CaseStudyType["jurisdictions"][number]) {
    setDraft((d) => {
      const current = d.jurisdictions ?? [];
/*       const exists = current.includes(j);
      const next = exists ? current.filter((v) => v !== j) : [...current, j]; */
      const next = current.includes(j)
        ? current.filter((v) => v !== j)
        : [...current, j];
      return { ...d, jurisdictions: next };
    });
/*     setError(null);
    setPreview(null); */
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
  }

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

  function save() {
    if (!validatedCaseStudy) {
      setError("Please validate the case study before saving.");
      return;
    }

    addCaseStudy(validatedCaseStudy);
    router.push(`/admin/case-studies/mock/${validatedCaseStudy.slug}`);
  }

  return (
    <main className="c-page c-page-admin">
      <div className="c-container c-section admin-form">
        {/* Header row */}
        <header className="admin-form-header">
          <div className="admin-form-header-main">
            <p className="admin-kicker">CMS demo</p>
            <h1 className="type-h1">Create a mock case study</h1>
            <p className="type-body type-muted">
              This mirrors the real data model: sectors, tags, mechanisms,
              summary, and structured MDX sections. Saving writes to a local mock
              database in this browser via localStorage.
            </p>
          </div>
          <Link href="/admin" className="cms-button cms-button--secondary">
            ← Back to admin dashboard
          </Link>
        </header>

        {/* BASICS */}
        <section className="admin-form-section">
          <h2 className="admin-section-title">Basics</h2>

          {/* Title */}
          <div className="admin-field">
            <div className="admin-label-row">
              <span className="admin-label">
                Title <span className="admin-label-required">*</span>
              </span>
              <span className="admin-hint">
                Public-facing case study title.
              </span>
            </div>
            <input
              className="admin-input"
              placeholder="Ex: Sanborn + AppGeo statewide mapping modernization"
              value={draft.title || ""}
              onChange={(e) => update("title", e.target.value)}
            />
          </div>

          {/* Slug */}
          <div className="admin-field">
            <div className="admin-label-row">
              <span className="admin-label">
                Slug <span className="admin-label-required">*</span>
              </span>
              <span className="admin-hint">
                Used in URLs (lowercase, dashes). If left blank, it will be derived from the title.
              </span>
            </div>
            <input
              className="admin-input"
              placeholder="ex: sanborn-appgeo"
              value={draft.slug || ""}
              onChange={(e) => update("slug", e.target.value)}
            />
          </div>

          {/* Client */}
          <div className="admin-field">
            <div className="admin-label-row">
              <span className="admin-label">Client</span>
              <span className="admin-hint">
                Who you did the work for (optional).
              </span>
            </div>
            <input
              className="admin-input"
              placeholder="Ex: Sanborn"
              value={draft.client || ""}
              onChange={(e) => update("client", e.target.value)}
            />
          </div>

          {/* Sector + year */}
          <div className="admin-grid-2">
            <div className="admin-field">
              <div className="admin-label-row">
                <span className="admin-label">Sector</span>
              </div>
              <select
                className="admin-select"
                value={draft.sector || "GovContracting"}
                onChange={(e) =>
                  update("sector", e.target.value as CaseStudyType["sector"])
                }
              >
                {sectorOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
{/*                 <option value="Defense">Defense</option>
                <option value="Health">Health</option>
                <option value="FinTech">FinTech</option>
                <option value="Education">Education</option>
                <option value="Nonprofit">Nonprofit</option>
                <option value="GovContracting">GovContracting</option>
                <option value="EmergencyMgmt">EmergencyMgmt</option> */}
              </select>
            </div>

            <div className="admin-field">
              <div className="admin-label-row">
                <span className="admin-label">Year</span>
                <span className="admin-hint">Optional</span>
              </div>
              <input
                className="admin-input"
                type="number"
                min={1990}
                max={2100}
                value={draft.year ?? ""}
                onChange={(e) =>
                  update(
                    "year",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
            </div>
          </div>

          <div className="admin-grid-2">
            <div className="admin-field">
              <div className="admin-label-row">
                <span className="admin-label">Status</span>
              </div>
              <select
                className="admin-select"
                value={(draft.status as string) || "Draft"}
                onChange={(e) =>
                  update("status", e.target.value as CaseStudyType["status"])
                }
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
              </select>
            </div>

            <div className="admin-field">
              <div className="admin-label-row">
                <span className="admin-label">Visibility</span>
              </div>
              <select
                className="admin-select"
                value={(draft.visibility as string) || "Internal"}
                onChange={(e) =>
                  update(
                    "visibility",
                    e.target.value as CaseStudyType["visibility"],
                  )
                }
              >
                {visibilityOptions.map((v) => ( 
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* ----DISPLAY----- */}
        <section className="admin-form-section">
          <h2 className="admin-section-title">Display</h2>

          {/* Hero image */}
          <div className="admin-field">
            <div className="admin-label-row">
              <span className="admin-label">Hero image URL</span>
              <span className="admin-hint">Full-width banner image. Use root-relative path (/img/...) or absolute URL.</span>
            </div>
            <input
              className="admin-input"
              placeholder="/img/case1.webp"
              value={draft.heroImageUrl || ""}
              onChange={(e) => update("heroImageUrl", e.target.value)}
            />
            {/* {draft.heroImageUrl && ( */}
            {emptyToUndefined(draft.heroImageUrl) && (
              <div className="admin-image-preview">
                <p className="admin-hint">Hero image preview</p>
                <img src={draft.heroImageUrl} alt="Hero preview" />
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="admin-field">
            <div className="admin-label-row">
              <span className="admin-label">Tags</span>
              <span className="admin-hint">
                Comma-separated; used for search and filters.
              </span>
            </div>
            <input
              className="admin-input"
              placeholder="GIS, Modernization, Data integration"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
            <p className="admin-chip-hint">
              Example: <code>GIS, Modernization, Data integration</code>
            </p>
          </div>
        </section>

        {/* SUMMARY */}
        <section className="admin-form-section">
          <h2 className="admin-section-title">Summary</h2>

          <div className="admin-field">
            <div className="admin-label-row">
              <span className="admin-label">Summary (short)</span>
              <span className="admin-hint">
                1–2 sentences for listing cards.
              </span>
            </div>
            <textarea
              className="admin-textarea"
              placeholder="Short summary used on listing cards."
              value={draft.summaryShort || ""}
              onChange={(e) => update("summaryShort", e.target.value)}
            />
          </div>

          <div className="admin-field">
            <div className="admin-label-row">
              <span className="admin-label">Brief (optional)</span>
              <span className="admin-hint">Up to ~280 characters.</span>
            </div>
            <textarea
              className="admin-textarea"
              placeholder="Optional slightly longer teaser for briefs or social."
              value={draft.brief || ""}
              onChange={(e) => update("brief", e.target.value)}
            />
          </div>
        </section>

        {/* MECHANICS */}
        <section className="admin-form-section">
          <h2 className="admin-section-title">Mechanics</h2>

          {/* Mechanisms */}
          <div className="admin-field">
            <div className="admin-label-row">
              <span className="admin-label">Mechanisms</span>
            </div>
            <div className="admin-checkbox-row">
              {mechanismOptions.map((m) => (
                <label key={m}>
                  <input
                    type="checkbox"
                    checked={(draft.mechanisms ?? []).includes(m)}
                    onChange={() => toggleMechanism(m)}
                  />
                  <span>{m}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Jurisdictions */}
          <div className="admin-field">
            <div className="admin-label-row">
              <span className="admin-label">Jurisdictions</span>
            </div>
            <div className="admin-checkbox-row">
              {jurisdictionOptions.map((j) => (
                <label key={j}>
                  <input
                    type="checkbox"
                    checked={(draft.jurisdictions ?? []).includes(j)}
                    onChange={() => toggleJurisdiction(j)}
                  />
                  <span>{j}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Flags */}
          <div className="admin-field">
            <div className="admin-label-row">
              <span className="admin-label">Flags</span>
            </div>
            <div className="admin-checkbox-row">
              <label>
                <input
                  type="checkbox"
                  checked={draft.isFeaturedHome ?? false}
                  onChange={(e) => update("isFeaturedHome", e.target.checked)}
                />
                <span>Feature on home</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={draft.isPublic ?? true}
                  onChange={(e) => update("isPublic", e.target.checked)}
                />
                <span>Public</span>
              </label>
            </div>
          </div>
        </section>

        {/* STRUCTURED SECTIONS */}
        <section className="admin-form-section">
          <h2 className="admin-section-title">Structured sections (MDX)</h2>

          <div className="admin-field">
            <div className="admin-label-row">
              <span className="admin-label">Context</span>
              <span className="admin-hint">
                Problem framing / starting point.
              </span>
            </div>
            <textarea
              className="admin-textarea"
              value={contextBody}
              onChange={(e) => setContextBody(e.target.value)}
              placeholder="Context / problem framing..."
            />
          </div>

          <div className="admin-field">
            <div className="admin-label-row">
              <span className="admin-label">Approach</span>
              <span className="admin-hint">What ERA actually did</span>
            </div>
            <textarea
              className="admin-textarea"
              value={approachBody}
              onChange={(e) => setApproachBody(e.target.value)}
              placeholder="What ERA did / strategy..."
            />
          </div>

          <div className="admin-field">
            <div className="admin-label-row">
              <span className="admin-label">Impact</span>
              <span className="admin-hint">Outcomes, numbers, changes</span>
            </div>
            <textarea
              className="admin-textarea"
              value={impactBody}
              onChange={(e) => setImpactBody(e.target.value)}
              placeholder="Outcomes, impact, results..."
            />
          </div>
        </section>

        {/* VALIDATE + PREVIEW */}
        <section className="admin-form-section">
          <h2 className="admin-section-title">Validate &amp; preview</h2>

          <div className="admin-field admin-button-row">
            <button type="button" onClick={validate} className="cms-button">
              Validate + preview payload
            </button>

            <button type="button" onClick={save} className="cms-button cms-button--secondary"
              disabled={!validated} aria-disabled={!validated} 
              title={!validated ? "Please validate before saving." : "Save into mock case study database"}
            >
              Save to mock database
            </button>
          </div>

          {error && <p className="admin-error">{error}</p>}

          {preview && (
            <div className="admin-json-preview">
              <div className="admin-json-preview-header">Validated payload</div>
              <pre>{JSON.stringify(preview, null, 2)}</pre>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
