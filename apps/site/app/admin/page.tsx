// apps/site/app/admin/page.tsx
'use client';

import '@styles/admin-cms-buttons.css';
import '@styles/admin-cms.css'

import { useState } from 'react';
import Link from 'next/link';
import { CMSLogin, CMSDashboard } from '@kit/blocks';

//import { CASE_STUDIES_FIXTURE } from '@kit/schema';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <main className="c-page c-page-admin">
      <div className="c-container c-section c-stack">
        {/* HEADER */}
        <header className="c-stack">
          <div className="c-stack c-stack--row c-stack--between c-stack--center">

              <Link href="/" className="c-button c-button--secondary">
                ← Back to public site
              </Link>

            <h1 className="type-h1">ERA CMS admin demo</h1>
          </div>

          <p className="type-body type-muted">
            Temporary demo CMS so you can click around and see how content editing might feel.
            This is for preview purposes only — nothing is persisted or connected to a real backend.
          </p>

          <p className="type-body type-muted">
            In this preview you can:
          </p>
            <ul className="type-muted">
              <li>Open a case study builder, the template used to create mock case studies.</li>
              <li>Browse a mock “case study database” view.</li>
            </ul>
          <p className="type-body type-muted"> 
            The case study builder is database-ready, with schema that will allow for future filtering and searching by tags and other properties.
          </p>
          <hr />
        </header>

        {/* NOT LOGGED IN ---------------------------------------------------- */}
        {!isLoggedIn && (
          <section className="c-stack">
            <p className="type-body-semibold">Step 1 — Enter the CMS demo</p>
            <p className="type-body type-muted">
              This is a fake login. Clicking the button below just switches the view into the
              admin demo — it doesn&apos;t touch any real data or accounts.
            </p>

            {/* CMSLogin: Fake login button from the shared blocks package */}
            <CMSLogin onLogin={() => setIsLoggedIn(true)} />

            <p className="type-body type-muted">
              Or, if you only want to see the detailed case study editor, you can skip straight to it: 
              <Link href="/admin/case-studies/new" className="cs-link">
                Open detailed case study builder
              </Link>
            </p>



          </section>
        )}

        {/* LOGGED IN -------------------------------------------------------- */}
        {isLoggedIn && (
          <section className="c-stack">
            {/* Top row: title + “log out” */}
            <div className="c-stack c-stack--row c-stack--between c-stack--center">
              {/*<h2 className="type-h3">Content dashboard (mock)</h2>*/}

            </div>

            {/* QUICK INLINE EDITOR */}
            <section className="c-stack">
{/*              <h3 className="type-h4">Quick add (inline)</h3>
              <p className="type-body type-muted">
                Lightweight inline editor — type a title, slug, and body, then save to see how
                “create → preview” feels without touching the full CMS.
              </p>*/}

              <CMSDashboard />
            </section>



            {/* LINKS TO OTHER FLOWS */}
{/**             <section className="c-stack">
              <h3 className="type-h3">Explore the mock CMS flows</h3>
              <p className="type-body type-muted">
                Use these links to jump into the more structured views that mirror a real CMS.
              </p>

              <div className="c-stack c-stack--row c-stack--wrap c-stack--gap">
                <Link href="/admin/case-studies/list" className="c-button">
                  View mock case study database
                </Link>

                <Link href="/admin/case-studies/new" className="c-button">
                  Open detailed case study builder
                </Link>
              </div>
            </section>*/}
          </section>
        )}
      </div>
    </main>
  );
}
