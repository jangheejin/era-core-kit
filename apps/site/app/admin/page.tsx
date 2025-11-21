// apps/site/app/admin/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CMSLogin, CMSDashboard } from '@kit/blocks';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <main className="c-page c-page-admin">
      <div className="c-container c-section c-stack">
        {/* Top bar / heading */}
        <header className="c-stack c-stack--row c-stack--between">
          <div className="c-stack">
            <Link href="/" className="c-button c-button--secondary">
              ← Back to public site
            </Link>
            <h1 className="type-h1">ERA CMS Admin (Mockup)</h1>
            <p className="type-body type-muted">
              Temporary demo CMS so you can click around and see how content editing might feel. 
              This is for preview purposes only: nothing is persistently saved
            </p>
          </div>

        </header>

        {/* Before "login" */}
        {!isLoggedIn && (
          <section className="c-stack">
            <h2 className="type-h3">"Log in" to view the CMS demo</h2>
            <p className="type-body type-muted">
              This is a fake login — no real accounts or data. It just flips you into the demo view.
            </p>

            <CMSLogin onLogin={() => setIsLoggedIn(true)} />
          </section>
        )}

        {/* After "login" */}
        {isLoggedIn && (
          <section className="c-stack">
            <div className="c-stack c-stack--row c-stack--between c-stack--center">
              <h2 className="type-h3">Content dashboard (mock)</h2>

              {/* This "back" button un-toggles the dashboard */}
              <button
                type="button"
                className="c-button c-button--ghost"
                onClick={() => setIsLoggedIn(false)}
              >
                ← "Log out" / back to login
              </button>
            </div>

            {/* Simple inline editor mock */}
            <section className="c-stack">
              <h3 className="type-h4">Quick add (inline)</h3>
              <p className="type-body type-muted">
                Super simple inline editor, just to prove “enter → save → preview” feels real.
              </p>
              <CMSDashboard />
            </section>

            <hr />

            

            <section className="c-stack">
              <h3 className="type-h3">Explore the mock CMS flows</h3>

              <div className="c-stack c-stack--row c-stack--wrap c-stack--gap">
                <Link href="/admin/case-studies/list" className="c-button">
                  View mock case study database
                </Link>

                <Link href="/admin/case-studies/new" className="c-button">
                  Open detailed case study builder
                </Link>
              </div>
            </section>
          </section>
        )}
      </div>
    </main>
  );
}
