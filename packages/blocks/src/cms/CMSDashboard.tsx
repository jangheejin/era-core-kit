// packages/blocks/src/cms/CMSDashboard.tsx
// WAS: apps/site/app/admin/CMSDashboard.tsx
'use client';

import { useState } from 'react';
import type { CaseStudy } from '@kit/schema';
//import type { CaseStudy } from '../../../schema/src/index';

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
    //still using the strcutural wrappers defined in primitives.css
    <div className="c-container c-section c-stack">
      <h2 className="type-h2">CMS Content Editor (Mock) </h2>

      <div className="c-stack">
        <h3 className="type-h2">Add New Case Study</h3>

        <input
          className="input"
          placeholder="Case Study Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          className="input"
          placeholder="Slug (e.g., my-case-study)"
          value={slug}
          onChange={e => setSlug(e.target.value)}
        />
        <textarea
          className="input"
          placeholder="Body Content (MDX)"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <button onClick={addCaseStudy} className="button" >
          Save Case Study (mock)
        </button>
      </div>

      <hr />

      <h3 className="type-h3">Content Preview ({caseStudies.length} items)</h3>
      <div className="c-stack">
        {caseStudies.map((cs, idx) => (
          <div key={idx} className="card">
            <div className="card-body c-stack">
              <div className="flex justify-between items-center">
                <strong className="type-small type-muted">{cs.title}</strong> — 
                <code className="type-small type-muted">/{cs.slug}</code>
              </div>

              <p className="type-body type-muted">
                **Summary:** {cs.summaryShort}
              </p>
              {/* This inner div needs *some* boundary until Tailwind */}
              <div className="pad-2" style={{border: '1px solid var(--gray-300)', borderRadius: '4px'}}>
                <span className="type-small type-muted">bodyMDX:</span>
                <pre className="whitespace-pre-wrap">{cs.bodyMDX || '(No MDX Content)'}</pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
