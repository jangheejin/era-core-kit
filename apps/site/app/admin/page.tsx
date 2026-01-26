// apps/site/app/admin/page.tsx
"use client";

import "@styles/admin-cms-buttons.css";
import "@styles/admin-cms.css";

import { useEffect, useState } from "react";
import Link from "next/link";
//import { useMockCMS } from "./mockCMS";
import { useAdminCaseStudies } from "./AdminCaseStudyStore";
import { useAdminClientPages } from "./AdminClientPageStore";

//import { CASE_STUDIES_FIXTURE } from '@kit/schema';

const LOGIN_KEY = "era_admin_logged_in_v1";

export default function AdminPage() {
  console.log("AdminPage mounted");
  //  const { items, addCaseStudy } = useAdminCaseStudies();
  const { items } = useAdminCaseStudies();
  const { pages } = useAdminClientPages();
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
    <main className="c-admin admin-dashboard">
      <div className="admin-page-header">
        <h1 className="type-h2 admin-page-title">Demo CMS Dashboard</h1>
        <div className="admin-page-actions">
          <Link className="btnPrimary" href="/">
            Public site
          </Link>
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

      {/*<section className="card mt admin-dashboard__hero">
                 <div className="admin-dashboard__hero-body">
          <p className="muted">
            This is a temporary demo CMS so you can click around and see how
            content editing might feel.{" "}
          </p>
        </div> */}

      {/* <div className="admin-dashboard__stats">
          <div className="admin-stat">
            <div className="admin-stat__label">Case studies</div>
            <div className="admin-stat__value">{items.length}</div>
            <div className="admin-stat__meta"> */}
      {/* (6/8 featured on homepage) */}
      {/* </div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat__label">Case Study Collections</div>
            <div className="admin-stat__value">{pages.length}</div>
          </div>
        </div> */}
      {/* </section> */}

      {isLoggedIn ? (
        <section className="admin-dashboard__grid mt">
          <article className="card admin-dashboard__card">
            <div className="admin-dashboard__card-header">
              <h2 className="type-h3">Case studies</h2>
              {/* <span className="pill pill--muted">Library</span> */}
            </div>
            <p className="muted">
              Review, filter, and edit every case study in the shared library.
            </p>
            <div className="admin-dashboard__card-actions">
              <Link className="btnPrimary" href="/admin/case-studies/list">
                Open library
              </Link>
              <Link className="btn" href="/admin/case-studies/new">
                New case study
              </Link>
            </div>
          </article>
          <article className="card admin-dashboard__card">
            <div className="admin-dashboard__card-header">
              <h2 className="type-h3">Case Study Collections</h2>
              {/* <span className="pill pill--muted">Curated</span> */}
            </div>
            <p className="muted">
              Build client-specific pages from saved filters and a short intro.
            </p>
            <div className="admin-dashboard__card-actions">
              <Link className="btnPrimary" href="/admin/client-pages">
                {/* Manage Case Study Collections */}
                Manage Collections
              </Link>
              <Link className="btn" href="/admin/client-pages/new">
                New collection
              </Link>
            </div>
          </article>
          <article className="card admin-dashboard__card">
            <div className="admin-dashboard__card-header">
              <h2 className="type-h3">Team bios</h2>
              {/* <span className="pill pill--muted">Public page</span> */}
            </div>
            <p className="muted">
              Update team member bios and photos that feed the public “Our Team”
              page.
            </p>
            <div className="admin-dashboard__card-actions">
              <Link className="btnPrimary" href="/admin/team">
                Manage team
              </Link>
              <Link className="btn" href="/admin/team?new=1">
                New team member
              </Link>
            </div>
          </article>
        </section>
      ) : (
        <div className="card mt">
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
