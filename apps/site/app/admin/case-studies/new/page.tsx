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
  type SectorValue,
  SECTOR_VALUES,
  CASE_STUDY_STATUS_VALUES,
  CASE_STUDY_VISIBILITY_VALUES,
} from "@kit/schema";

//import hook & router for advanced builder (where we can save a new case study and see it go into the memory store)
import { useRouter } from "next/navigation";
import { useAdminCaseStudies } from "../../AdminCaseStudyStore";

import { DEFAULT_HERO_IMAGE_URL } from "@kit/schema";

import { ContextBanner } from "@/admin/components/ContextBanner";

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
  const [sectors, setSectors] = useState<SectorValue[]>(["GovContracting"]);

  function toggleSector(v: SectorValue) {
    setSectors((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
    );
  }
  const [year, setYear] = useState<string>("2025");
  const [tags, setTags] = useState("");
  const [summaryShort, setSummaryShort] = useState("");
//  const [heroImageUrl, setHeroImageUrl] = useState("/img/case1.webp");
  const [heroImageUrl, setHeroImageUrl] = useState<string>("");
  const [bodyMDX, setBodyMDX] = useState("## Summary\n\n");
  const [status, setStatus] = useState<(typeof CASE_STUDY_STATUS_VALUES)[number]>("Draft");
  const [visibility, setVisibility] =
    useState<(typeof CASE_STUDY_VISIBILITY_VALUES)[number]>("Internal");
  const [isFeaturedHome, setIsFeaturedHome] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  const candidateInput: CaseStudyInput = useMemo(
    () => ({
      id,
//      id: typeof crypto !== "undefined" ? crypto.randomUUID() : String(Date.now()),
      title: title.trim(),
      slug: slugify(slug || title),
      client: client.trim() || undefined,
      sectors,
      year: year ? Number(year) : undefined,

      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
        //.slice(0, 10),//limits the number of tags

      summaryShort: summaryShort.trim(),
      brief: undefined,

      //heroImageUrl: heroImageUrl.trim(),
      heroImageUrl: heroImageUrl.trim() || undefined,

      mechanisms: [],
      jurisdictions: [],
      outcomes: [],
      evidence: [],
      bodyMDX: bodyMDX || "",
      sections: [],
      attachments: [],
      links: [],

      status,
      visibility,
      isFeaturedHome,
      isPublic,
    }),
    [
      title,
      slug,
      client,
      sectors,
      year,
      tags,
      summaryShort,
      heroImageUrl,
      bodyMDX,
      status,
      visibility,
      isFeaturedHome,
      isPublic,
    ],
  );

  const validation = useMemo(() => CaseStudySchema.safeParse(candidateInput), [candidateInput]);

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
        <h1 className="form-title">New Case Study</h1>
        <div className="form-nav">
          <a href="/admin">Admin</a>
          <a href="/admin/case-studies/list">All case studies</a>
        </div>
      </div>

{/*       <p className="muted">
        This is the demo builder: input → Zod validation → stored as parsed output → preview page.
      </p> */}

      <div className="card card-new mt1">
        <div className="form-actions">
          <button
            className="btn"
            type="button"
            onClick={() => setSlug(slugify(slug || title))}
            title="Generate slug from title"
          >
            Slugify
          </button>

          <button
            className="btnPrimary"
            type="button"
            onClick={save}
            disabled={!validation.success}
            title={!validation.success ? "Fix validation errors first" : "Save"}
          >
            Save + Preview
          </button>
        </div>
        <div className="card card-new">
          <div className = "form-group">
            <label className="form-label">Title</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Slug</label>
            <input className="input" value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>

          <div className="form-row form-group">
            <div className="form-field">
              <label className="form-label">Client</label>
              <input className="input" value={client} onChange={(e) => setClient(e.target.value)} />
            </div>

            {/* <div style={{ flex: 1, minWidth: 220 }}> */}
            <div className="form-field">
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
            </div>

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
          <div className="form-group">
            <label className="form-label">Summary short (required)</label>
            <input
              className="input"
              value={summaryShort}
              onChange={(e) => setSummaryShort(e.target.value)}
            />
          </div>

          {/* <div style={{ marginTop: "1rem" }}> */}
          <div className="form-group">
            <label className="form-label">Hero image URL (required; default used if blank) (/img/... or https://...)</label>
            <input
              className="input"
              placeholder={DEFAULT_HERO_IMAGE_URL}
              value={heroImageUrl}
              onChange={(e) => setHeroImageUrl(e.target.value)}
            />
          </div>

          {/* <div className="row" style={{ marginTop: "1rem" }}> */}
          <div className="form-row form-group">
            <label className="row" style={{ gap: ".5rem" }}>
              <input
                type="checkbox"
                checked={isFeaturedHome}
                onChange={(e) => setIsFeaturedHome(e.target.checked)}
              />
              Featured on homepage
            </label>

            <label className="row" style={{ gap: ".5rem" }}>
              <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
              isPublic
            </label>
          </div>

          {/* <div style={{ marginTop: "1rem" }}> */}
          <div className="form-group">
            <label className="form-label">Body (MDX) — optional</label>
            <textarea
              className="input"
              style={{ minHeight: 160 }}
              value={bodyMDX}
              onChange={(e) => setBodyMDX(e.target.value)}
            />
          </div>
        </div>
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

