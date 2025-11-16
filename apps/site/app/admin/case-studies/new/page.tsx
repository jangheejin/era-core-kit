//apps/site/app/admin/case-studies/new/page.tsx
"use client";

import { useState } from "react";
import {
  CaseStudy as CaseStudySchema,
  Sector,
  Mechanism,
  Jurisdiction,
} from "@kit/schema";
import type { CaseStudy } from "@kit/schema";

async function logout() {
  await fetch("/api/admin/logout", { method: "POST" });
  window.location.href = "/admin/login";
}

type DraftCaseStudy = Omit<
  CaseStudy,
  "id" | "slug" | "isPublic" | "isFeaturedHome" | "outcomes" | "evidence"
> & {
  outcomes: { label: string; description?: string; evidenceUrl?: string }[];
  evidence: { label: string; url: string }[];
};

const emptyDraft: DraftCaseStudy = {
  title: "",
  client: "",
  sector: Sector.options[0]!,
  tags: [],
  summaryShort: "",
  heroImageUrl: "",
  year: new Date().getFullYear(),
  mechanisms: [],
  jurisdictions: [],
  outcomes: [],
  evidence: [],
  bodyMDX: "",
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewCaseStudyPage() {
  const [draft, setDraft] = useState<DraftCaseStudy>(emptyDraft);
  const [rawTags, setRawTags] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<CaseStudy | null>(null);

  function update<K extends keyof DraftCaseStudy>(
    key: K,
    value: DraftCaseStudy[K],
  ) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const caseStudyCandidate: CaseStudy = {
      id: "temp-id", // backend would assign this
      slug: slugify(draft.title || ""),
      isPublic: true,
      isFeaturedHome: false,
      ...draft,
      tags: rawTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    const result = CaseStudySchema.safeParse(caseStudyCandidate);

    if (!result.success) {
      const [issue] = result.error.issues;

      if (!issue) {
        // Fallback if Zod somehow gave you an empty issues array
        setError(
          "Validation failed for this case study. Check required fields.",
        );
      } else {
        const path =
          issue.path && issue.path.length > 0 ? issue.path.join(".") : "(root)";
        setError(`${path}: ${issue.message}`);
      }

      setPreview(null);
      return;
    }

    setPreview(result.data);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>
        New Case Study (Prototype CMS)
      </h1>

      <button
        type="button"
        onClick={logout}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          fontSize: "0.8rem",
          padding: "0.3rem 0.6rem",
          borderRadius: 4,
          border: "1px solid #ddd",
          background: "#f9fafb",
          cursor: "pointer",
        }}
      >
        Log out
      </button>

      <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1.5rem" }}>
        This is a rough admin UI demo. In the real system this would save to a
        CMS / database, but for now it just validates and shows a preview of
        what would be created.
      </p>

      <div
        style={{
          display: "grid",
          gap: "1.5rem",
          gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1.4fr)",
        }}
      >
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          <label>
            <div>Title</div>
            <input
              value={draft.title}
              onChange={(e) => update("title", e.target.value)}
              required
              style={{ width: "100%", padding: "0.4rem" }}
            />
          </label>

          <label>
            <div>Client (optional)</div>
            <input
              value={draft.client ?? ""}
              onChange={(e) => update("client", e.target.value)}
              style={{ width: "100%", padding: "0.4rem" }}
            />
          </label>

          <label>
            <div>Sector</div>
            <select
              value={draft.sector}
              onChange={(e) =>
                update("sector", e.target.value as DraftCaseStudy["sector"])
              }
              style={{ width: "100%", padding: "0.4rem" }}
            >
              {Sector.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>

          <label>
            <div>Year</div>
            <input
              type="number"
              value={draft.year ?? ""}
              onChange={(e) =>
                update(
                  "year",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              style={{ width: "100%", padding: "0.4rem" }}
            />
          </label>

          <label>
            <div>Tags (comma separated)</div>
            <input
              value={rawTags}
              onChange={(e) => setRawTags(e.target.value)}
              style={{ width: "100%", padding: "0.4rem" }}
            />
          </label>

          <label>
            <div>Summary (short)</div>
            <textarea
              value={draft.summaryShort}
              onChange={(e) => update("summaryShort", e.target.value)}
              rows={3}
              style={{ width: "100%", padding: "0.4rem" }}
            />
          </label>

          <label>
            <div>Hero Image URL</div>
            <input
              value={draft.heroImageUrl}
              onChange={(e) => update("heroImageUrl", e.target.value)}
              style={{ width: "100%", padding: "0.4rem" }}
            />
          </label>

          <label>
            <div>Mechanisms</div>
            <select
              multiple
              value={draft.mechanisms as string[]}
              onChange={(e) =>
                update(
                  "mechanisms",
                  Array.from(e.target.selectedOptions).map(
                    (o) => o.value as DraftCaseStudy["mechanisms"][number],
                  ),
                )
              }
              style={{ width: "100%", padding: "0.4rem", minHeight: "4rem" }}
            >
              {Mechanism.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>

          <label>
            <div>Jurisdictions</div>
            <select
              multiple
              value={draft.jurisdictions as string[]}
              onChange={(e) =>
                update(
                  "jurisdictions",
                  Array.from(e.target.selectedOptions).map(
                    (o) => o.value as DraftCaseStudy["jurisdictions"][number],
                  ),
                )
              }
              style={{ width: "100%", padding: "0.4rem", minHeight: "4rem" }}
            >
              {Jurisdiction.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>

          <label>
            <div>Body (rough notes / MDX)</div>
            <textarea
              value={draft.bodyMDX ?? ""}
              onChange={(e) => update("bodyMDX", e.target.value)}
              rows={6}
              style={{ width: "100%", padding: "0.4rem" }}
            />
          </label>

          {error && (
            <div style={{ color: "#b91c1c", fontSize: "0.9rem" }}>
              Validation error: {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              marginTop: "0.75rem",
              padding: "0.6rem 1rem",
              borderRadius: 4,
              border: "1px solid #111",
              background: "#111",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Validate & Preview
          </button>
        </form>

        {/* Preview */}
        <div
          style={{ border: "1px solid #ddd", borderRadius: 6, padding: "1rem" }}
        >
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
            }}
          >
            Preview
          </h2>

          {!preview ? (
            <p style={{ fontSize: "0.9rem", color: "#666" }}>
              Fill in the form and click <strong>Validate &amp; Preview</strong>{" "}
              to see how this case study would be stored.
            </p>
          ) : (
            <>
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontWeight: 600 }}>{preview.title}</div>
                <div style={{ fontSize: "0.85rem", color: "#555" }}>
                  {preview.client ? `${preview.client} • ` : ""}
                  {preview.year ?? "Year N/A"} • {preview.sector}
                </div>
                <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                  {preview.summaryShort}
                </p>
              </div>

              <details>
                <summary style={{ cursor: "pointer", fontSize: "0.9rem" }}>
                  View raw JSON payload
                </summary>
                <pre
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.75rem",
                    background: "#f9fafb",
                    padding: "0.5rem",
                    borderRadius: 4,
                    overflowX: "auto",
                  }}
                >
                  {JSON.stringify(preview, null, 2)}
                </pre>
              </details>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
