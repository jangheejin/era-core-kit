// apps/site/app/admin/home/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useAdminHomeContent } from "../AdminHomeStore";
import { useAdminCaseStudies } from "../AdminCaseStudyStore";
import Link from "next/link";

const LAYOUT_OPTIONS = [
  { value: "2col", label: "2 columns" },
  { value: "3col", label: "3 columns" },
  { value: "4col", label: "4 columns" },
  { value: "2x2", label: "2 x 2" },
];

const FEATURED_COUNT_OPTIONS = [
  {
    value: 3,
    label: "3",
    description: "Compact 3-column desktop layout",
  },
  {
    value: 4,
    label: "4",
    description: "Even 2-column mid-size layout",
  },
  {
    value: 6,
    label: "6",
    description: "Full featured grid",
  },
];

export default function HomePageEditor() {
  const {
    content,
    updateSection,
    updateExtraSection,
    addExtraSection,
    removeExtraSection,
    updateSectionOrder,
    resetToBaseline,
  } = useAdminHomeContent();
  const { items: caseStudies } = useAdminCaseStudies();
  const [addSlug, setAddSlug] = useState("");
  const [addFeaturedSlug, setAddFeaturedSlug] = useState("");

  const caseStudyMap = useMemo(
    () => new Map(caseStudies.map((cs) => [cs.slug, cs])),
    [caseStudies]
  );

  const availableCaseStudies = useMemo(() => {
    const selected = new Set(content.work.caseStudySlugs);
    return caseStudies.filter((cs) => !selected.has(cs.slug));
  }, [caseStudies, content.work.caseStudySlugs]);

  const featuredCandidates = useMemo(
    () => caseStudies.filter((cs) => Boolean(cs.isFeaturedHome)),
    [caseStudies]
  );

  const availableFeaturedCaseStudies = useMemo(() => {
    const selected = new Set(content.work.featuredCaseStudySlugs);
    return featuredCandidates.filter((cs) => !selected.has(cs.slug));
  }, [featuredCandidates, content.work.featuredCaseStudySlugs]);

  const selectedItems = useMemo(
    () =>
      content.work.caseStudySlugs.map((slug) => ({
        slug,
        item: caseStudyMap.get(slug),
      })),
    [content.work.caseStudySlugs, caseStudyMap]
  );

  const selectedFeaturedItems = useMemo(
    () =>
      content.work.featuredCaseStudySlugs.map((slug) => ({
        slug,
        item: caseStudyMap.get(slug),
      })),
    [content.work.featuredCaseStudySlugs, caseStudyMap]
  );

  const featuredCount = useMemo(() => {
    const allowed = new Set(FEATURED_COUNT_OPTIONS.map((opt) => opt.value));
    const candidate = content.work.maxItems;
    if (typeof candidate === "number" && allowed.has(candidate)) return candidate;
    return 3;
  }, [content.work.maxItems]);

  const featuredLimitReached =
    content.work.featuredCaseStudySlugs.length >= featuredCount;

  const sectionLabels = useMemo(() => {
    const base = new Map<string, string>([
      ["hero", "Hero"],
      ["mission", "Mission"],
      ["intro", "Intro With Image"],
      ["work", "Case Study Grid"],
    ]);
    const extras = content.extraSections.map((block) => {
      const title =
        (block.props as { heading?: string }).heading ||
        (block.type as string);
      return [String(block._key), `${block.type}: ${title}`] as const;
    });
    return new Map<string, string>([...base, ...extras]);
  }, [content.extraSections]);

  function updateHero<K extends keyof typeof content.hero>(
    key: K,
    value: (typeof content.hero)[K]
  ) {
    updateSection("hero", { [key]: value } as Partial<typeof content.hero>);
  }

  function updateMission<K extends keyof typeof content.mission>(
    key: K,
    value: (typeof content.mission)[K]
  ) {
    updateSection("mission", { [key]: value } as Partial<typeof content.mission>);
  }

  function updateIntro<K extends keyof typeof content.intro>(
    key: K,
    value: (typeof content.intro)[K]
  ) {
    updateSection("intro", { [key]: value } as Partial<typeof content.intro>);
  }

  function updateWork<K extends keyof typeof content.work>(
    key: K,
    value: (typeof content.work)[K]
  ) {
    updateSection("work", { [key]: value } as Partial<typeof content.work>);
  }

  function moveSection(index: number, direction: number) {
    const next = [...content.sectionOrder];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const [removed] = next.splice(index, 1);
    if (!removed) return;
    next.splice(target, 0, removed);
    updateSectionOrder(next);
  }

  function moveCaseStudy(index: number, direction: number) {
    const next = [...content.work.caseStudySlugs];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const [removed] = next.splice(index, 1);
    if (!removed) return;
    next.splice(target, 0, removed);
    updateWork("caseStudySlugs", next);
    updateWork("itemsSource", "manual");
  }

  function moveFeaturedCaseStudy(index: number, direction: number) {
    const next = [...content.work.featuredCaseStudySlugs];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const [removed] = next.splice(index, 1);
    if (!removed) return;
    next.splice(target, 0, removed);
    updateWork("featuredCaseStudySlugs", next);
    updateWork("itemsSource", "featured");
  }

  function removeCaseStudy(slug: string) {
    const next = content.work.caseStudySlugs.filter((s) => s !== slug);
    updateWork("caseStudySlugs", next);
  }

  function removeFeaturedCaseStudy(slug: string) {
    const next = content.work.featuredCaseStudySlugs.filter((s) => s !== slug);
    updateWork("featuredCaseStudySlugs", next);
  }

  function addCaseStudy() {
    const trimmed = addSlug.trim();
    if (!trimmed) return;
    if (content.work.caseStudySlugs.includes(trimmed)) return;
    updateWork("caseStudySlugs", [...content.work.caseStudySlugs, trimmed]);
    updateWork("itemsSource", "manual");
    setAddSlug("");
  }

  function addFeaturedCaseStudy() {
    const trimmed = addFeaturedSlug.trim();
    if (!trimmed) return;
    if (content.work.featuredCaseStudySlugs.includes(trimmed)) return;
    if (content.work.featuredCaseStudySlugs.length >= featuredCount) return;
    updateWork("featuredCaseStudySlugs", [
      ...content.work.featuredCaseStudySlugs,
      trimmed,
    ]);
    updateWork("itemsSource", "featured");
    setAddFeaturedSlug("");
  }

  function setFeaturedCount(value: number) {
    updateWork("maxItems", value);
    if (content.work.featuredCaseStudySlugs.length > value) {
      updateWork(
        "featuredCaseStudySlugs",
        content.work.featuredCaseStudySlugs.slice(0, value)
      );
    }
  }

  return (
    <main className="c-admin admin-dashboard">
      <div className="admin-page-header">
        <h1 className="type-h2 admin-page-title">Home Page CMS</h1>
        <div className="admin-page-actions">
          <Link className="btnPrimary" href="/" target="_blank" rel="noreferrer">
            Preview Home Page
          </Link>
          <button className="btn" type="button" onClick={resetToBaseline}>
            Reset to default
          </button>
        </div>
      </div>

      <div className="admin-home-split">
        <form className="admin-form admin-home-form">
        <section className="admin-form-section">
          <div className="admin-section-title">Home Sections</div>
          <div className="admin-field">
            <div className="admin-label-row">
              <span className="admin-label">Section order</span>
              <span className="admin-label-optional">
                {content.sectionOrder.length} total
              </span>
            </div>
            <div className="dbListGrid">
              {content.sectionOrder.map((id, index) => (
                <div key={id} className="card dbItem">
                  <div className="dbItemHeader">
                    <div className="dbItemMain">
                      <div className="dbItemClient">
                        {sectionLabels.get(id) ?? id}
                      </div>
                    </div>
                    <div className="dbActions">
                      <button
                        className="btnSmall"
                        type="button"
                        onClick={() => moveSection(index, -1)}
                      >
                        Move up
                      </button>
                      <button
                        className="btnSmall"
                        type="button"
                        onClick={() => moveSection(index, 1)}
                      >
                        Move down
                      </button>
                      {id.startsWith("extra-") ? (
                        <button
                          className="btnSmall"
                          type="button"
                          onClick={() => removeExtraSection(id)}
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="admin-field" id="add-section">
            <label className="admin-label">Add a new section</label>
            <button className="btnPrimary" type="button" onClick={addExtraSection}>
              Add section
            </button>
          </div>
        </section>

        <section className="admin-form-section">
          <div className="admin-section-title">Hero</div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="heroHeading">
              Heading
            </label>
            <input
              id="heroHeading"
              className="admin-input"
              value={content.hero.heading}
              onChange={(e) => updateHero("heading", e.target.value)}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="heroText1">
              Body text 1
            </label>
            <textarea
              id="heroText1"
              className="admin-textarea"
              value={content.hero.text ?? ""}
              onChange={(e) => updateHero("text", e.target.value)}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="heroText2">
              Body text 2
            </label>
            <textarea
              id="heroText2"
              className="admin-textarea"
              value={content.hero.text2 ?? ""}
              onChange={(e) => updateHero("text2", e.target.value)}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="heroText3">
              Body text 3
            </label>
            <textarea
              id="heroText3"
              className="admin-textarea"
              value={content.hero.text3 ?? ""}
              onChange={(e) => updateHero("text3", e.target.value)}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="heroLogo">
              Logo image URL
            </label>
            <input
              id="heroLogo"
              className="admin-input"
              value={content.hero.imageUrl}
              onChange={(e) => updateHero("imageUrl", e.target.value)}
            />
          </div>
        </section>

        <section className="admin-form-section">
          <div className="admin-section-title">Mission</div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="missionHeading">
              Heading
            </label>
            <input
              id="missionHeading"
              className="admin-input"
              value={content.mission.heading}
              onChange={(e) => updateMission("heading", e.target.value)}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="missionText1">
              Body text 1
            </label>
            <textarea
              id="missionText1"
              className="admin-textarea"
              value={content.mission.text}
              onChange={(e) => updateMission("text", e.target.value)}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="missionText2">
              Body text 2
            </label>
            <textarea
              id="missionText2"
              className="admin-textarea"
              value={content.mission.text2 ?? ""}
              onChange={(e) => updateMission("text2", e.target.value)}
            />
          </div>
        </section>

        <section className="admin-form-section">
          <div className="admin-section-title">Intro With Image</div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="introHeading">
              Heading
            </label>
            <input
              id="introHeading"
              className="admin-input"
              value={content.intro.heading}
              onChange={(e) => updateIntro("heading", e.target.value)}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="introText1">
              Body text 1
            </label>
            <textarea
              id="introText1"
              className="admin-textarea"
              value={content.intro.text ?? ""}
              onChange={(e) => updateIntro("text", e.target.value)}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="introText2">
              Body text 2
            </label>
            <textarea
              id="introText2"
              className="admin-textarea"
              value={content.intro.text2 ?? ""}
              onChange={(e) => updateIntro("text2", e.target.value)}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="introImage">
              Image URL
            </label>
            <input
              id="introImage"
              className="admin-input"
              value={content.intro.imageUrl}
              onChange={(e) => updateIntro("imageUrl", e.target.value)}
            />
          </div>
        </section>

        <section className="admin-form-section">
          <div className="admin-section-title">Case Study Grid</div>
          <div className="admin-grid-2">
            <div className="admin-field">
              <label className="admin-label" htmlFor="workHeading">
                Section heading
              </label>
              <input
                id="workHeading"
                className="admin-input"
                value={content.work.heading}
                onChange={(e) => updateWork("heading", e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="workLayout">
                Grid layout
              </label>
              <select
                id="workLayout"
                className="admin-select"
                value={content.work.layout ?? "3col"}
                onChange={(e) => updateWork("layout", e.target.value)}
              >
                {LAYOUT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="workItemsSource">
                Items source
              </label>
              <select
                id="workItemsSource"
                className="admin-select"
                value={content.work.itemsSource ?? "featured"}
                onChange={(e) =>
                  updateWork(
                    "itemsSource",
                    e.target.value === "manual" ? "manual" : "featured"
                  )
                }
              >
                <option value="featured">Featured + published</option>
                <option value="manual">Manual selection</option>
              </select>
            </div>
            <div className="admin-field">
              <div className="admin-label-row">
                <span
                  className="admin-label"
                  title="Sets the number of featured case studies shown on the homepage."
                >
                  Homepage featured count
                </span>
                <span
                  className="admin-label-optional"
                  title="Used to size the homepage case study grid."
                >
                  Controls grid sizing
                </span>
              </div>
              <div
                className="admin-pill-toggle-group"
                role="group"
                aria-label="Homepage featured count"
              >
                {FEATURED_COUNT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`admin-pill-toggle ${
                      featuredCount === opt.value ? "is-active" : ""
                    }`}
                    aria-pressed={featuredCount === opt.value}
                    title={opt.description}
                    onClick={() => setFeaturedCount(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="admin-hint">
                Choose how many featured case studies appear on the homepage. Even
                counts (4 or 6) use a 2-column layout on mid-size screens.
              </p>
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-label" htmlFor="workText1">
              Intro text 1
            </label>
            <textarea
              id="workText1"
              className="admin-textarea"
              value={content.work.text ?? ""}
              onChange={(e) => updateWork("text", e.target.value)}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="workText2">
              Intro text 2
            </label>
            <textarea
              id="workText2"
              className="admin-textarea"
              value={content.work.text2 ?? ""}
              onChange={(e) => updateWork("text2", e.target.value)}
            />
          </div>

          <div className="admin-field">
            <label className="admin-label" htmlFor="workAddCaseStudy">
              Add case study to Featured 6 list
            </label>
            <div className="row">
              <select
                id="workAddCaseStudy"
                className="admin-select"
                value={addSlug}
                onChange={(e) => setAddSlug(e.target.value)}
              >
                <option value="">Select a case study</option>
                {availableCaseStudies.map((cs) => (
                  <option key={cs.slug} value={cs.slug}>
                    {cs.client || cs.title || cs.slug}
                  </option>
                ))}
              </select>
              <button className="btnPrimary" type="button" onClick={addCaseStudy}>
                Add to grid
              </button>
            </div>
          </div>

          <div className="admin-field">
            <div className="admin-label-row">
              <span className="admin-label">
                Featured case studies (order, up to 6)
              </span>
              <span className="admin-label-optional">
                {selectedItems.length} selected
              </span>
            </div>
            <div className="dbListGrid">
              {selectedItems.length === 0 ? (
                <p className="muted">
                  No case studies selected yet. Choose items to feature in the
                  Featured 6 list.
                </p>
              ) : (
                selectedItems.map(({ slug, item }, index) => (
                  <div key={slug} className="card dbItem">
                    <div className="dbItemHeader">
                      <div className="dbItemMain">
                        <div className="dbItemClient">
                          {item?.client || item?.title || slug}
                        </div>
                        <div className="dbItemTitle">{slug}</div>
                      </div>
                      <div className="dbActions">
                        <button
                          className="btnSmall"
                          type="button"
                          onClick={() => moveCaseStudy(index, -1)}
                        >
                          Move up
                        </button>
                        <button
                          className="btnSmall"
                          type="button"
                          onClick={() => moveCaseStudy(index, 1)}
                        >
                          Move down
                        </button>
                        <button
                          className="btnSmall"
                          type="button"
                          onClick={() => removeCaseStudy(slug)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-label" htmlFor="workAddFeaturedCaseStudy">
              Homepage featured case studies (pick {featuredCount})
            </label>
            <div className="row">
              <select
                id="workAddFeaturedCaseStudy"
                className="admin-select"
                value={addFeaturedSlug}
                onChange={(e) => setAddFeaturedSlug(e.target.value)}
              >
                <option value="">Select a featured case study</option>
                {availableFeaturedCaseStudies.map((cs) => (
                  <option key={cs.slug} value={cs.slug}>
                    {cs.client || cs.title || cs.slug}
                  </option>
                ))}
              </select>
              <button
                className="btnPrimary"
                type="button"
                onClick={addFeaturedCaseStudy}
                disabled={featuredLimitReached}
                title={
                  featuredLimitReached
                    ? "Remove a featured case study to add another."
                    : "Add to homepage"
                }
              >
                Add to homepage
              </button>
            </div>
            <p className="admin-hint">
              These are the specific featured case studies shown on the
              homepage. Pick up to {featuredCount} from the Featured list above.
            </p>
          </div>

          <div className="admin-field">
            <div className="admin-label-row">
              <span className="admin-label">Homepage featured (order)</span>
              <span className="admin-label-optional">
                {selectedFeaturedItems.length} selected
              </span>
            </div>
            <div className="dbListGrid">
              {selectedFeaturedItems.length === 0 ? (
                <p className="muted">
                  No homepage featured items yet. Add up to {featuredCount} from
                  the Featured list above.
                </p>
              ) : (
                selectedFeaturedItems.map(({ slug, item }, index) => (
                  <div key={slug} className="card dbItem">
                    <div className="dbItemHeader">
                      <div className="dbItemMain">
                        <div className="dbItemClient">
                          {item?.client || item?.title || slug}
                        </div>
                        <div className="dbItemTitle">{slug}</div>
                      </div>
                      <div className="dbActions">
                        <button
                          className="btnSmall"
                          type="button"
                          onClick={() => moveFeaturedCaseStudy(index, -1)}
                        >
                          Move up
                        </button>
                        <button
                          className="btnSmall"
                          type="button"
                          onClick={() => moveFeaturedCaseStudy(index, 1)}
                        >
                          Move down
                        </button>
                        <button
                          className="btnSmall"
                          type="button"
                          onClick={() => removeFeaturedCaseStudy(slug)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {content.extraSections.length ? (
          <section className="admin-form-section">
            <div className="admin-section-title">Extra Sections</div>
            {content.extraSections.map((block) => {
              if (block.type !== "RichTextSection") return null;
              const key = String(block._key);
              const props = block.props as {
                heading: string;
                body: string;
                subheads?: string[];
                imageUrl?: string;
              };
              const subheads = (props.subheads ?? []).join("\n");
              return (
                <div key={key} className="admin-field">
                  <div className="admin-label-row">
                    <span className="admin-label">Custom Section</span>
                    <span className="admin-label-optional">{key}</span>
                  </div>
                  <input
                    className="admin-input"
                    value={props.heading}
                    onChange={(e) =>
                      updateExtraSection(key, { heading: e.target.value })
                    }
                  />
                  <label className="admin-label" htmlFor={`${key}-body`}>
                    Body text
                  </label>
                  <textarea
                    id={`${key}-body`}
                    className="admin-textarea"
                    value={props.body}
                    onChange={(e) => updateExtraSection(key, { body: e.target.value })}
                  />
                  <label className="admin-label" htmlFor={`${key}-subheads`}>
                    Subheaders (one per line)
                  </label>
                  <textarea
                    id={`${key}-subheads`}
                    className="admin-textarea"
                    value={subheads}
                    onChange={(e) =>
                      updateExtraSection(key, {
                        subheads: e.target.value
                          .split(/\r?\n/)
                          .map((line) => line.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                  <label className="admin-label" htmlFor={`${key}-image`}>
                    Image URL (optional)
                  </label>
                  <input
                    id={`${key}-image`}
                    className="admin-input"
                    value={props.imageUrl ?? ""}
                    onChange={(e) =>
                      updateExtraSection(key, { imageUrl: e.target.value })
                    }
                  />
                </div>
              );
            })}
          </section>
        ) : null}
        </form>
        <aside className="admin-home-preview" aria-label="Home page preview">
          <div className="admin-home-preview__header">
            <h2 className="type-h3">Live Preview</h2>
            <p className="muted">Updates as you edit.</p>
          </div>
          <div className="admin-home-preview__frame">
            <iframe title="Home page preview" src="/" />
          </div>
        </aside>
      </div>
    </main>
  );
}
