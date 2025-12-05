// apps/site/app/admin/page.tsx
"use client";

import "@styles/admin-cms-buttons.css";
import "@styles/admin-cms.css";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CMSLogin, CMSDashboard } from "@kit/blocks";
//import { useMockCMS } from "./mockCMS";
import { useAdminCaseStudies } from "./AdminCaseStudyStore";

//import { CASE_STUDIES_FIXTURE } from '@kit/schema';

const LOGIN_KEY = "era_admin_logged_in_v1";

export default function AdminPage() {
  console.log("AdminPage mounted");
//  const { items, addCaseStudy } = useAdminCaseStudies();
  const { items } = useAdminCaseStudies();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      setIsLoggedIn(window.localStorage.getItem(LOGIN_KEY) === "1");
    } catch {}
  }, []);

  function login() {
    setIsLoggedIn(true);
    try {
      window.localStorage.setItem(LOGIN_KEY, "1");
    } catch {}
  }

  function logout() {
    setIsLoggedIn(false);
    try {
      window.localStorage.setItem(LOGIN_KEY, "0");
    } catch {}
  }

  return (
    <main className="c-admin">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h1>Admin (Demo CMS)</h1>
        <div className="row">
          <span className="btnPrimary"> 
            <Link href="/">Public site</Link>
          </span>
          {isLoggedIn ? (
            <button className="btn" type="button" onClick={logout}>
              Log out
            </button>
          ) : (
            <button className="btnPrimary" type="button" onClick={login}>
              Demo login
            </button>
          )}
        </div>
      </div>

      <p className="muted">
        Store contains <strong>{items.length}</strong> case studies (fixtures + any local edits).
      </p>

      {isLoggedIn ? (
        <div className="card" style={{ marginTop: "1rem" }}>
          <h2>Actions</h2>
          <div className="row" style={{ marginTop: ".75rem" }}>
            <Link href="/admin/case-studies/new">Create new case study</Link>
            <Link href="/admin/case-studies/list">Browse case studies</Link>
          </div>
        </div>
      ) : (
        <div className="card" style={{ marginTop: "1rem" }}>
          <h2>Locked</h2>
          <p className="muted">Click “Demo login” to access editor routes.</p>
        </div>
      )}
    </main>
  );
}

/* 
  return (
    <main className="c-page c-page-admin">
      <div className="c-container c-section c-stack">

        <header className="c-stack">
          <div className="c-stack c-stack--row c-stack--between c-stack--center">
            <h1 className="type-h1">ERA CMS admin demo</h1>

          </div>
          <div className="richtext">
            <p className="type-body type-muted">
              Temporary demo CMS so you can click around and see how content
              editing might feel. This is for preview purposes only — nothing is
              persisted or connected to a real backend.
            </p>

            <p className="type-body type-muted">In this preview you can:</p>
            <ul className="type-muted">
              <li>
                Open a case study builder, the template used to create mock case
                studies.
              </li>
              <li>Browse a mock “case study database” view.</li>
            </ul>
            <p className="type-body type-muted">
              The case study builder is database-ready, with schema that will
              allow for future filtering and searching by tags and other
              properties.
            </p>
          </div>
          <hr />
        </header>

        {!isLoggedIn && (
          <section className="c-stack">
            <p className="type-body-semibold">Step 1 — Enter the CMS demo</p>
            
            <p className="type-body type-muted">
              This is a fake login. Clicking the button below just switches the
              view into the admin demo — it doesn&apos;t touch any real data or
              accounts.
            </p>

            <CMSLogin onLogin={() => setIsLoggedIn(true)} />

            <p className="type-body">
              <hr />
              <br />
              Or jump straight to the detailed case study editor: 
              <br />
              <br />
              <Link href="/admin/case-studies/new" className="c-button">
                Open detailed case study builder
              </Link>
            </p>

            <Link href="/" className="c-button c-button--secondary">
              ← Back to public site
            </Link>
          </section>
        )}

        {isLoggedIn && (
          <section className="c-stack">
            <div className="c-stack c-stack--row c-stack--between c-stack--center">
            </div>

            <section className="c-stack">

              <CMSDashboard items={items} onCreate={addCaseStudy} />
            </section>
          </section>
        )}
      </div>
    </main>
  );
}
 */