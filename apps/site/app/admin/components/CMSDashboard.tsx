// apps/site/app/admin/CMSDashboard.tsx
'use client';

import { useState } from 'react';
import type { CaseStudy } from '@kit/schema';

/*
type CaseStudy = {
  title: string;
  slug: string;
  blocks: Array<{ type: string; content: string }>;
};*/

export function CMSDashboard() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');

  function addCaseStudy() {
    const newCaseStudy: CaseStudy = {
        //User-provided fields:
        title,
        slug,
        bodyMDX: content, // Map the textarea content to the primary body

        // REQUIRED fields from the schema, given placeholder data to pass type check
        id: String(Date.now()), // Unique ID
        sector: 'GovContracting', // Default to a valid enum value
        tags: ['mock', 'admin-entry'],
        summaryShort: `Mock summary for ${title}`,
        heroImageUrl: 'https://placehold.co/1200x600', // Must be a valid URL

        // REQUIRED Array fields (defaulted to empty arrays)
        mechanisms: [],
        jurisdictions: [],
        outcomes: [],
        evidence: [],
        sections: [], 
        attachments: [],
        links: [],

        // REQUIRED Boolean fields
        isFeaturedHome: false,
        isPublic: true,
    };

    setCaseStudies(cs => [...cs, newCaseStudy]);

    // Clear state

    setTitle('');
    setSlug('');
    setContent('');
  }

  return (
    <div className="p-4 space-y-6">
      <h2>Add Case Study</h2>
      <input
        className="border p-2 w-full"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <input
        className="border p-2 w-full"
        placeholder="Slug"
        value={slug}
        onChange={e => setSlug(e.target.value)}
      />
      <textarea
        className="border p-2 w-full"
        placeholder="Callout content"
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <button onClick={addCaseStudy} className="bg-green-600 text-white px-4 py-2">
        Save Case Study (mock)
      </button>

      <hr />

      <h3>Preview</h3>
      <ul>
        {caseStudies.map((cs, idx) => (
          <li key={idx}>
            <strong>{cs.title}</strong> — <code>{cs.slug}</code>
            <pre className="whitespace-pre-wrap">{cs.bodyMDX || '(No MDX Content)'}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
