//apps/site/app/admin/case-studies/new/page.tsx
'use client';

import { useState } from 'react';
import { z } from 'zod';
import { CaseStudy as CaseStudySchema, type CaseStudy as CaseStudyType } from '@kit/schema';
//import { CaseStudy, type CaseStudy as CaseStudyType } from '@kit/schema';

export default function NewCaseStudyForm() {
  const [draft, setDraft] = useState<Partial<CaseStudyType>>({
    title: '',
    slug: '',
    sector: 'GovContracting',
    summaryShort: '',
    heroImageUrl: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<CaseStudyType | null>(null);

  function update(field: keyof CaseStudyType, value: any) {
    setDraft((d) => ({ ...d, [field]: value }));
    setError(null);
    setPreview(null);
  }

  function validate() {
    const result = CaseStudySchema.safeParse(draft);

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
    <main className="max-w-2xl mx-auto py-10 space-y-8">
      <h1 className="text-2xl font-semibold">New Case Study</h1>

      <div className="space-y-4">
        <input
          placeholder="Title"
          value={draft.title || ''}
          onChange={(e) => update('title', e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          placeholder="Slug"
          value={draft.slug || ''}
          onChange={(e) => update('slug', e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          placeholder="Hero Image URL"
          value={draft.heroImageUrl || ''}
          onChange={(e) => update('heroImageUrl', e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          placeholder="Summary (short)"
          value={draft.summaryShort || ''}
          onChange={(e) => update('summaryShort', e.target.value)}
          className="w-full p-2 border rounded"
        />

        <select
          value={draft.sector || 'GovContracting'}
          onChange={(e) => update('sector', e.target.value)}
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

      <button
        onClick={validate}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Validate + Preview
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {preview && (
        <pre className="text-xs mt-4 p-4 border rounded bg-neutral-50 overflow-x-auto">
{JSON.stringify(preview, null, 2)}
        </pre>
      )}
    </main>
  );
}