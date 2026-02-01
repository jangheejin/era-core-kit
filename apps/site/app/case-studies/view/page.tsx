//apps/site/app/case-studies/view/page.tsx

//testing out an alternate single-view page for case studies

"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAdminCaseStudies } from "@admin/AdminCaseStudyStore";
import {
  sectorLabel,
  type Outcome,
  type SectorValue,
  type CaseStudySection,
} from "@kit/schema";

import { Markdown } from "@components/Markdown";

function readParams(): { slug: string | null; preview: boolean } {
  if (typeof window === "undefined") return { slug: null, preview: false };
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug")?.trim() || null;
  const preview = params.get("preview") === "1";
  return { slug, preview };
}

export default function CaseStudyViewPage() {
  const { items, getBySlug } = useAdminCaseStudies();
  const [{ slug, preview }, setLocal] = useState(() => ({
    slug: null as string | null,
    preview: false,
  }));

  useEffect(() => {
    setLocal(readParams());
  }, []);

  const cs = useMemo(() => {
    if (!slug) return undefined;
    return getBySlug(slug) ?? items.find((x) => x.slug === slug);
  }, [slug, getBySlug, items]);

  if (!slug) {
    return (
      <main className="csViewPage">
        <div className="csViewBanner">
          <div>
            <div className="csViewBannerTitle">Missing slug</div>
            <div className="csViewBannerMeta">
              Use <code>?slug=...</code>
            </div>
          </div>
          <div className="csViewTopActions">
            <Link className="csViewAction" href="/admin/case-studies/list">
              Back to database
            </Link>
            {/* Replace this once there is a full edit page route */}
            <Link className="csViewAction" href="/admin/case-studies/list">
              Edit
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!cs) {
    return (
      <main className="csViewPage">
        <div className="csViewBanner">
          <div>
            <div className="csViewBannerTitle">Not found</div>
            <div className="csViewBannerMeta">
              No case study for <code>{slug}</code> in this browser’s draft
              store.
            </div>
          </div>
          <div className="csViewTopActions">
            <Link className="csViewAction" href="/admin/case-studies/list">
              Back to database
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const clientLabel =
    (cs.client ?? cs.title ?? "Untitled").trim() || "Untitled";
  const hasSeparateTitle =
    (cs.client ?? "").trim().length > 0 &&
    (cs.title ?? "").trim().length > 0 &&
    (cs.client ?? "").trim() !== (cs.title ?? "").trim();

  const secondaryTitle = hasSeparateTitle ? cs.title : null;

  const sectors: SectorValue[] = Array.isArray(cs.sectors) ? cs.sectors : [];
  const tags: string[] = Array.isArray(cs.tags) ? cs.tags : [];
  const outcomes: Outcome[] = Array.isArray(cs.outcomes) ? cs.outcomes : [];
  const sections: CaseStudySection[] = Array.isArray(cs.sections)
    ? cs.sections
    : [];

  const status = cs.status ?? "Draft";
  const visibility = cs.visibility ?? "Internal";
  const year = cs.year;

  return (
    <main className="csViewPage">
      <div className="csViewBanner">
        <div>
          <div className="csViewBannerTitle">
            {preview ? "Preview mode" : "Viewing draft"}
          </div>
          <div className="csViewBannerMeta">
            This is rendered from this browser’s local draft store.
          </div>
        </div>

        <div className="csViewTopActions">
          <Link className="csViewAction" href="/admin/case-studies/list">
            Database
          </Link>
          <Link className="csViewAction" href="/admin/case-studies/list">
            Quick Edit
          </Link>
        </div>
      </div>

      {cs.heroImageUrl ? (
        <div className="csViewHero">
          <img className="csViewHeroImg" src={cs.heroImageUrl} alt="" />
        </div>
      ) : null}

      <header>
        <h1 className="csViewH1">{clientLabel}</h1>
        {secondaryTitle ? (
          <div className="csViewSubTitle">{secondaryTitle}</div>
        ) : null}

        <div className="csViewMetaRow">
          <span className="csViewPill">{status}</span>
          <span className="csViewPill">
            {visibility === "ClientSafe" ? "Client-safe" : visibility}
          </span>

          {typeof year === "number" ? (
            <span className="csViewPill csViewPillMuted">{year}</span>
          ) : null}

          {sectors.map((s) => (
            <span key={s} className="csViewPill csViewPillMuted">
              {sectorLabel(s)}
            </span>
          ))}
        </div>

        {cs.summaryShort ? (
          <div className="csViewSummary">{cs.summaryShort}</div>
        ) : null}

        <div className="csViewKV">
          <div>Slug</div>
          <div>
            <code>{cs.slug}</code>
          </div>

          <div>ID</div>
          <div>
            <code>{cs.id}</code>
          </div>

          {tags.length ? (
            <>
              <div>Tags</div>
              <div>{tags.join(", ")}</div>
            </>
          ) : null}
        </div>
      </header>

      {outcomes.length > 0 ? (
        <section className="csViewSection">
          <h2 className="csViewH2">Outcomes</h2>
          <ul className="csViewList">
            {outcomes.map((o, i) => (
              <li key={o.label ?? i}>
                <strong>{o.label ?? "Outcome"}</strong>
                {o.description ? ` — ${o.description}` : ""}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {sections.length > 0 ? (
        <section className="csViewSection">
          <h2 className="csViewH2">Details</h2>

          {sections.map((s) => (
            <div key={s.id ?? s.title} className="csViewSection">
              <h2 className="csViewH2">{s.title ?? "Section"}</h2>
              <div className="csViewMDX">{s.bodyMDX ?? ""}</div>
            </div>
          ))}
        </section>
      ) : null}

      {cs.bodyMDX ? (
        <section className="csViewSection">
          <h2 className="csViewH2">Body</h2>
          {/* <div className="csViewMDX">{cs.bodyMDX}</div> */}
          <Markdown>{cs.bodyMDX}</Markdown>
        </section>
      ) : null}
    </main>
  );
}

//THE MODULE VERSION
/* function readParams(): { slug: string | null; preview: boolean } {
  if (typeof window === "undefined") return { slug: null, preview: false };
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug")?.trim() || null;
  const preview = params.get("preview") === "1";
  return { slug, preview };
}

export default function CaseStudyViewPage() {
  const { items, getBySlug } = useAdminCaseStudies();
  const [{ slug, preview }, setLocal] = useState(() => ({ slug: null as string | null, preview: false }));

  useEffect(() => {
    setLocal(readParams());
  }, []);

  const cs = useMemo(() => {
    if (!slug) return undefined;
    return getBySlug(slug) ?? items.find((x) => x.slug === slug);
  }, [slug, getBySlug, items]);

  if (!slug) {
    return (
      <main className={styles.page}>
        <div className={styles.banner}>
          <div>
            <div className={styles.bannerTitle}>Missing slug</div>
            <div className={styles.bannerMeta}>Use <code>?slug=...</code></div>
          </div>
          <div className={styles.topActions}>
            <Link className={styles.action} href="/admin/case-studies/list">Back to database</Link>
          </div>
        </div>
      </main>
    );
  }

  if (!cs) {
    return (
      <main className={styles.page}>
        <div className={styles.banner}>
          <div>
            <div className={styles.bannerTitle}>Not found</div>
            <div className={styles.bannerMeta}>
              No case study for <code>{slug}</code> in this browser’s draft store.
            </div>
          </div>
          <div className={styles.topActions}>
            <Link className={styles.action} href="/admin/case-studies/list">Back to database</Link>
          </div>
        </div>
      </main>
    );
  }

  const clientLabel = (cs.client ?? cs.title ?? "Untitled").trim() || "Untitled";
  const hasSeparateTitle =
    (cs.client ?? "").trim().length > 0 &&
    (cs.title ?? "").trim().length > 0 &&
    (cs.client ?? "").trim() !== (cs.title ?? "").trim();

  const secondaryTitle = hasSeparateTitle ? cs.title : null;

  const sectors: SectorValue[] = Array.isArray((cs as any).sectors) ? ((cs as any).sectors as SectorValue[]) : [];
  const tags: string[] = Array.isArray((cs as any).tags) ? ((cs as any).tags as string[]) : [];

  const status = cs.status ?? "Draft";
  const visibility = cs.visibility ?? "Internal";
  const year = cs.year;

  return (
    <main className={styles.page}>
      <div className={styles.banner}>
        <div>
          <div className={styles.bannerTitle}>{preview ? "Preview mode" : "Viewing draft"}</div>
          <div className={styles.bannerMeta}>
            This is rendered from this browser’s local draft store.
          </div>
        </div>

        <div className={styles.topActions}>
          <Link className={styles.action} href="/admin/case-studies/list">Database</Link>
          <Link className={styles.action} href="/admin/case-studies/list">Quick Edit</Link>
        </div>
      </div>

      {cs.heroImageUrl ? (
        <div className={styles.hero}>
          <img className={styles.heroImg} src={cs.heroImageUrl} alt="" />
        </div>
      ) : null}

      <header>
        <h1 className={styles.h1}>{clientLabel}</h1>
        {secondaryTitle ? <div className={styles.subTitle}>{secondaryTitle}</div> : null}

        <div className={styles.metaRow}>
          <span className={styles.pill}>{status}</span>
          <span className={styles.pill}>{visibility === "ClientSafe" ? "Client-safe" : visibility}</span>

          {typeof year === "number" ? <span className={`${styles.pill} ${styles.pillMuted}`}>{year}</span> : null}

          {sectors.map((s) => (
            <span key={s} className={`${styles.pill} ${styles.pillMuted}`}>
              {sectorLabel(s)}
            </span>
          ))}
        </div>

        {cs.summaryShort ? <div className={styles.summary}>{cs.summaryShort}</div> : null}

        <div className={styles.kv}>
          <div>Slug</div><div><code>{cs.slug}</code></div>
          <div>ID</div><div><code>{cs.id}</code></div>
          {tags.length ? (
            <>
              <div>Tags</div>
              <div>{tags.join(", ")}</div>
            </>
          ) : null}
        </div>
      </header>

      {Array.isArray(cs.outcomes) && cs.outcomes.length > 0 ? (
        <section className={styles.section}>
          <h2 className={styles.h2}>Outcomes</h2>
          <ul className={styles.list}>
            {cs.outcomes.map((o: any, i: number) => (
              <li key={o?.label ?? i}>
                <strong>{o?.label ?? "Outcome"}</strong>
                {o?.description ? ` — ${o.description}` : ""}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {Array.isArray(cs.sections) && cs.sections.length > 0 ? (
        <section className={styles.section}>
          <h2 className={styles.h2}>Details</h2>
          {cs.sections.map((s: any) => (
            <div key={s?.id ?? s?.title} className={styles.section}>
              <h2 className={styles.h2}>{s?.title ?? "Section"}</h2>
              <div className={styles.mdx}>{s?.bodyMDX ?? ""}</div>
            </div>
          ))}
        </section>
      ) : null}

      {cs.bodyMDX ? (
        <section className={styles.section}>
          <h2 className={styles.h2}>Body</h2>
          <div className={styles.mdx}>{cs.bodyMDX}</div>
        </section>
      ) : null}
    </main>
  );
}
 */
