// apps/site/app/admin/case-studies/new/page.tsx
'use client';

import { useState } from 'react';
import { CaseStudy as CaseStudySchema, type CaseStudy as CaseStudyType } from '@kit/schema';

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

  // Simple helper for scalar fields on the CaseStudy
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
    // Parse tags from comma-separated string
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    // Build sections from the 3 textareas
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

    // Normalize into a complete object for Zod
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

    // optional for debugging: see what would be "saved"
    console.log('Validated case study payload:', result.data);
  }

  return (
    <main className="max-w-3xl mx-auto py-10 space-y-8">
      <h1 className="text-2xl font-semibold">New Case Study (Mock)</h1>

      {/* BASIC META */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Basics</h2>

        <input
          placeholder="Title"
          value={draft.title || ''}
          onChange={(e) => update('title', e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          placeholder="Slug (e.g., sanborn-appgeo)"
          value={draft.slug || ''}
          onChange={(e) => update('slug', e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          placeholder="Client name"
          value={draft.client || ''}
          onChange={(e) => update('client', e.target.value)}
          className="w-full p-2 border rounded"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Sector</label>
            <select
              value={draft.sector || 'GovContracting'}
              onChange={(e) =>
                update('sector', e.target.value as CaseStudyType['sector'])
              }
              className="w-full p-2 border rounded"
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

          <div>
            <label className="block text-sm mb-1">Year (optional)</label>
            <input
              type="number"
              min={1990}
              max={2100}
              value={draft.year ?? ''}
              onChange={(e) =>
                update('year', e.target.value ? Number(e.target.value) : undefined)
              }
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </section>

      {/* IMAGE + TAGS */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Display</h2>
        <input
          placeholder="Hero image URL"
          value={draft.heroImageUrl || ''}
          onChange={(e) => update('heroImageUrl', e.target.value)}
          className="w-full p-2 border rounded"
        />
        {draft.heroImageUrl && (
          <div className="mt-2 border p-2 rounded">
            <p className="text-xs text-neutral-600 mb-1">Hero image preview</p>
            <img
              src={draft.heroImageUrl}
              alt="Hero preview"
              className="w-full max-h-64 object-cover border rounded"
            />
          </div>
        )}

        <input
          placeholder="Tags (comma-separated)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </section>

      {/* SUMMARY / BRIEF */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Summary</h2>
        <textarea
          placeholder="Summary (short, ~1–2 sentences)"
          value={draft.summaryShort || ''}
          onChange={(e) => update('summaryShort', e.target.value)}
          className="w-full p-2 border rounded min-h-[80px]"
        />
        <textarea
          placeholder="Brief (optional, up to ~280 chars)"
          value={draft.brief || ''}
          onChange={(e) => update('brief', e.target.value)}
          className="w-full p-2 border rounded min-h-[80px]"
        />
      </section>

      {/* MECHANISMS / JURISDICTIONS */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Mechanics</h2>
        <div>
          <p className="text-sm font-medium mb-1">Mechanisms</p>
          <div className="flex flex-wrap gap-3 text-sm">
            {mechanismOptions.map((m) => (
              <label key={m} className="inline-flex items-center gap-1">
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

        <div>
          <p className="text-sm font-medium mb-1">Jurisdictions</p>
          <div className="flex flex-wrap gap-3 text-sm">
            {jurisdictionOptions.map((j) => (
              <label key={j} className="inline-flex items-center gap-1">
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

        <div className="flex gap-4 text-sm">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={draft.isFeaturedHome ?? false}
              onChange={(e) => update('isFeaturedHome', e.target.checked)}
            />
            <span>Feature on home?</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={draft.isPublic ?? true}
              onChange={(e) => update('isPublic', e.target.checked)}
            />
            <span>Public</span>
          </label>
        </div>
      </section>

      {/* STRUCTURED SECTIONS */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Structured Sections (MDX)</h2>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Context
            <textarea
              value={contextBody}
              onChange={(e) => setContextBody(e.target.value)}
              className="w-full p-2 border rounded min-h-[80px]"
              placeholder="Context / problem framing..."
            />
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Approach
            <textarea
              value={approachBody}
              onChange={(e) => setApproachBody(e.target.value)}
              className="w-full p-2 border rounded min-h-[80px]"
              placeholder="What ERA did / strategy..."
            />
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Impact
            <textarea
              value={impactBody}
              onChange={(e) => setImpactBody(e.target.value)}
              className="w-full p-2 border rounded min-h-[80px]"
              placeholder="Outcomes, impact, results..."
            />
          </label>
        </div>
      </section>

      {/* VALIDATE + PREVIEW */}
      <section className="space-y-3">
        <button
          onClick={validate}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Validate + Preview
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {preview && (
          <div className="mt-4 border rounded p-4 bg-neutral-50">
            <h2 className="text-sm font-semibold mb-2">Validated payload</h2>
            <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{JSON.stringify(preview, null, 2)}
            </pre>
          </div>
        )}
      </section>
    </main>
  );
}
