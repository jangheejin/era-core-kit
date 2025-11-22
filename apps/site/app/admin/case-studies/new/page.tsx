// apps/site/app/admin/case-studies/new/page.tsx
'use client';

import '@styles/admin-cms-buttons.css';
import '@styles/admin-cms.css'

import { useState } from 'react';
import Link from 'next/link';
import {
  CaseStudy as CaseStudySchema,
  type CaseStudy as CaseStudyType,
} from '@kit/schema';

type Draft = Partial<CaseStudyType>;

const mechanismOptions: CaseStudyType['mechanisms'][number][] = [
  'Appropriation',
  'Earmark',
  'Grant',
  'TaxCredit',
];

const jurisdictionOptions: CaseStudyType['jurisdictions'][number][] = [
  'Federal',
  'State',
  'Local',
];

export default function NewCaseStudyForm() {
  const [draft, setDraft] = useState<Draft>({
    title: '',
    slug: '',
    client: '',
    sector: 'GovContracting',
    summaryShort: '',
    brief: '',
    heroImageUrl: '',
    isFeaturedHome: false,
    isPublic: true,
  });

  const [tagsInput, setTagsInput] = useState('');
  const [contextBody, setContextBody] = useState('');
  const [approachBody, setApproachBody] = useState('');
  const [impactBody, setImpactBody] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<CaseStudyType | null>(null);

  function update<K extends keyof Draft>(field: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [field]: value }));
    setError(null);
    setPreview(null);
  }

  function toggleMechanism(mech: CaseStudyType['mechanisms'][number]) {
    setDraft((d) => {
      const current = d.mechanisms ?? [];
      const exists = current.includes(mech);
      const next = exists ? current.filter((m) => m !== mech) : [...current, mech];
      return { ...d, mechanisms: next };
    });
    setError(null);
    setPreview(null);
  }

  function toggleJurisdiction(j: CaseStudyType['jurisdictions'][number]) {
    setDraft((d) => {
      const current = d.jurisdictions ?? [];
      const exists = current.includes(j);
      const next = exists ? current.filter((v) => v !== j) : [...current, j];
      return { ...d, jurisdictions: next };
    });
    setError(null);
    setPreview(null);
  }

  function validate() {
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const sections: CaseStudyType['sections'] = [
      contextBody.trim()
        ? { id: 'context', title: 'Context', bodyMDX: contextBody }
        : null,
      approachBody.trim()
        ? { id: 'approach', title: 'Approach', bodyMDX: approachBody }
        : null,
      impactBody.trim()
        ? { id: 'impact', title: 'Impact', bodyMDX: impactBody }
        : null,
    ].filter(Boolean) as CaseStudyType['sections'];

    const candidate: CaseStudyType = {
      id: draft.id ?? `draft-${Date.now()}`,
      title: draft.title ?? '',
      slug: draft.slug ?? '',
      client: draft.client ?? '',
      sector: draft.sector ?? 'GovContracting',
      year: draft.year ?? undefined,

      tags,
      summaryShort: draft.summaryShort ?? '',
      brief: draft.brief ?? undefined,
      heroImageUrl: draft.heroImageUrl ?? '',

      mechanisms: draft.mechanisms ?? [],
      jurisdictions: draft.jurisdictions ?? [],
      outcomes: draft.outcomes ?? [],
      evidence: draft.evidence ?? [],

      bodyMDX: draft.bodyMDX ?? '',
      sections,

      attachments: draft.attachments ?? [],
      links: draft.links ?? [],

      isFeaturedHome: draft.isFeaturedHome ?? false,
      isPublic: draft.isPublic ?? true,
    };

    const result = CaseStudySchema.safeParse(candidate);

    if (!result.success) {
      const issue = result.error.issues[0];
      const path = issue?.path?.length ? issue.path.join('.') : '(root)';
      setError(`${path}: ${issue?.message ?? 'Validation failed.'}`);
      setPreview(null);
      return;
    }

    setError(null);
    setPreview(result.data);
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
              This mirrors the real data model: sectors, tags, mechanisms, summary,
              and structured MDX sections. Nothing is saved to a backend&mdash;it&apos;s
              just for clicking through how the CMS could feel.
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
              <span className="admin-hint">Public-facing case study title.</span>
            </div>
            <input
              className="admin-input"
              placeholder="Ex: Sanborn + AppGeo statewide mapping modernization"
              value={draft.title || ''}
              onChange={(e) => update('title', e.target.value)}
            />
          </div>

          {/* Slug */}
          <div className="admin-field">
            <div className="admin-label-row">
              <span className="admin-label">
                Slug <span className="admin-label-required">*</span>
              </span>
              <span className="admin-hint">Used in URLs (lowercase, dashes).</span>
            </div>
            <input
              className="admin-input"
              placeholder="ex: sanborn-appgeo"
              value={draft.slug || ''}
              onChange={(e) => update('slug', e.target.value)}
            />
          </div>

          {/* Client */}
          <div className="admin-field">
            <div className="admin-label-row">
              <span className="admin-label">Client</span>
              <span className="admin-hint">Who you did the work for (optional).</span>
            </div>
            <input
              className="admin-input"
              placeholder="Ex: Sanborn"
              value={draft.client || ''}
              onChange={(e) => update('client', e.target.value)}
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
                value={draft.sector || 'GovContracting'}
                onChange={(e) =>
                  update('sector', e.target.value as CaseStudyType['sector'])
                }
              >
                <option value="Defense">Defense</option>
                <option value="Health">Health</option>
                <option value="FinTech">FinTech</option>
                <option value="Education">Education</option>
                <option value="Nonprofit">Nonprofit</option>
                <option value="GovContracting">GovContracting</option>
                <option value="EmergencyMgmt">EmergencyMgmt</option>
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
                value={draft.year ?? ''}
                onChange={(e) =>
                  update(
                    'year',
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
            </div>
          </div>
        </section>

        {/* DISPLAY */}
        <section className="admin-form-section">
          <h2 className="admin-section-title">Display</h2>

          {/* Hero image */}
          <div className="admin-field">
            <div className="admin-label-row">
              <span className="admin-label">Hero image URL</span>
              <span className="admin-hint">Full-width banner image.</span>
            </div>
            <input
              className="admin-input"
              placeholder="https://example.com/hero.jpg"
              value={draft.heroImageUrl || ''}
              onChange={(e) => update('heroImageUrl', e.target.value)}
            />
            {draft.heroImageUrl && (
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
              <span className="admin-hint">1–2 sentences for listing cards.</span>
            </div>
            <textarea
              className="admin-textarea"
              placeholder="Short summary used on listing cards."
              value={draft.summaryShort || ''}
              onChange={(e) => update('summaryShort', e.target.value)}
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
              value={draft.brief || ''}
              onChange={(e) => update('brief', e.target.value)}
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
                  onChange={(e) => update('isFeaturedHome', e.target.checked)}
                />
                <span>Feature on home</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={draft.isPublic ?? true}
                  onChange={(e) => update('isPublic', e.target.checked)}
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
              <span className="admin-hint">Problem framing / starting point.</span>
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
              <span className="admin-hint">What ERA actually did.</span>
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
              <span className="admin-hint">Outcomes, numbers, changes.</span>
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

          <div className="admin-field">
            <button
              type="button"
              onClick={validate}
              className="cms-button"
            >
              Validate + preview payload
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
