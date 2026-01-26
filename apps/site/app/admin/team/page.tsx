"use client";

import "@styles/admin-cms.css";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MiniFormatBar } from "../components/MiniFormatBar";
import { useAdminTeamMembers, type TeamMember } from "../AdminTeamStore";
import { Markdown } from "@/components/Markdown";

type TeamImage = {
  url: string;
  label: string;
  previewUrl?: string;
};

const IMAGE_LIBRARY_KEY = "era_admin_team_image_library_v1";

const DEFAULT_TEAM_IMAGES: TeamImage[] = [
  { url: "/team/edwardcox.jpg", label: "edwardcox.jpg" },
  { url: "/team/romelnicholas.jpg", label: "romelnicholas.jpg" },
  { url: "/team/lonaldwishom.png", label: "lonaldwishom.png" },
];

function bioToText(bio: string[]) {
  return bio.join("\n\n");
}

function textToBio(value: string) {
  return value
    .split(/\n\s*\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function sanitizeFilename(name: string) {
  const cleaned = name
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w.-]/g, "");
  return cleaned || "team-photo";
}

function loadImageLibrary(): TeamImage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(IMAGE_LIBRARY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TeamImage[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((entry) => entry && typeof entry.url === "string")
      .map((entry) => ({
        url: entry.url,
        label:
          typeof entry.label === "string"
            ? entry.label
            : (entry.url.split("/").pop() ?? entry.url),
        previewUrl:
          typeof entry.previewUrl === "string" ? entry.previewUrl : undefined,
      }));
  } catch {
    return [];
  }
}

function normalizeStatus(
  status: TeamMember["status"] | undefined
): TeamMember["status"] {
  return status ?? "Draft";
}

function formatStatusLabel(status: TeamMember["status"] | undefined) {
  return normalizeStatus(status) === "Published" ? "Published" : "Hidden";
}

function serializeMember(member: TeamMember) {
  return JSON.stringify({
    id: member.id,
    name: member.name,
    title: member.title,
    location: member.location ?? "",
    bio: member.bio,
    imageUrl: member.imageUrl ?? "",
    isFounder: Boolean(member.isFounder),
    order: member.order,
    status: normalizeStatus(member.status),
  });
}

export default function AdminTeamPage() {
  const { items, upsertTeamMember } = useAdminTeamMembers();
  const searchParams = useSearchParams();
  const router = useRouter();
  const sorted = useMemo(() => items, [items]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<TeamMember | null>(null);
  const [bioDraft, setBioDraft] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");
  const [uploadedLibrary, setUploadedLibrary] = useState<TeamImage[]>(() =>
    loadImageLibrary()
  );
  const [showMarkdownEditor, setShowMarkdownEditor] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const initialBioRef = useRef("");
  const visualEditorRef = useRef<HTMLDivElement | null>(null);
  const didAutoStartRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      IMAGE_LIBRARY_KEY,
      JSON.stringify(uploadedLibrary)
    );
  }, [uploadedLibrary]);

  useEffect(() => {
    const wantsNew = searchParams?.get("new") === "1";
    if (!wantsNew || editingId || didAutoStartRef.current) return;
    didAutoStartRef.current = true;
    startNewMember();
    router.replace("/admin/team");
  }, [searchParams, editingId]);

  const imageLibrary = useMemo(() => {
    const map = new Map<string, TeamImage>();
    for (const entry of DEFAULT_TEAM_IMAGES) map.set(entry.url, entry);
    for (const entry of uploadedLibrary) map.set(entry.url, entry);
    for (const member of items) {
      if (member.imageUrl?.startsWith("/team/") && !map.has(member.imageUrl)) {
        map.set(member.imageUrl, {
          url: member.imageUrl,
          label: member.imageUrl.split("/").pop() ?? member.imageUrl,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }, [uploadedLibrary, items]);

  const previewMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const entry of imageLibrary) {
      if (entry.previewUrl) map.set(entry.url, entry.previewUrl);
    }
    return map;
  }, [imageLibrary]);

  function startEditing(member: TeamMember) {
    setEditingId(member.id);
    setDraft({ ...member });
    const nextBio = bioToText(member.bio);
    setBioDraft(nextBio);
    initialBioRef.current = nextBio;
    setSaveState("idle");
    setShowMarkdownEditor(false);
  }

  function startNewMember() {
    const id =
      typeof crypto !== "undefined" ? crypto.randomUUID() : String(Date.now());
    const newMember: TeamMember = {
      id,
      name: "New team member",
      title: "Title",
      location: "",
      bio: [],
      imageUrl: "",
      isFounder: false,
      order: items.length + 1,
      status: "Draft",
    };
    setEditingId(id);
    setDraft(newMember);
    setBioDraft("");
    initialBioRef.current = "";
    setSaveState("idle");
    setShowMarkdownEditor(false);
  }

  function updateDraft(patch: Partial<TeamMember>) {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
    setSaveState("idle");
  }

  function rememberImage(entry: TeamImage) {
    setUploadedLibrary((prev) => {
      if (prev.some((item) => item.url === entry.url)) return prev;
      return [...prev, entry];
    });
  }

  function setDraftImage(nextUrl: string) {
    if (!draft) return;
    const previousUrl = draft.imageUrl;
    if (previousUrl && previousUrl.startsWith("/team/")) {
      rememberImage({
        url: previousUrl,
        label: previousUrl.split("/").pop() ?? previousUrl,
      });
    }
    updateDraft({ imageUrl: nextUrl });
  }

  async function handlePhotoUpload(file: File | null) {
    if (!file || !draft) return;
    const safeName = sanitizeFilename(file.name);
    const nextUrl = `/team/${safeName}`;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result !== "string") return;
      rememberImage({ url: nextUrl, label: safeName, previewUrl: result });
      setDraftImage(nextUrl);
    };
    reader.readAsDataURL(file);
  }

  function cancelEditing() {
    if (isDirty && !window.confirm("Discard unsaved changes?")) return;
    setEditingId(null);
    setDraft(null);
    setBioDraft("");
    setSaveState("idle");
  }

  function saveDraft(nextStatus: TeamMember["status"]) {
    if (!draft) return;
    const nextMember: TeamMember = {
      ...draft,
      bio: textToBio(bioDraft),
      status: nextStatus,
    };
    upsertTeamMember(nextMember);
    setDraft(nextMember);
    initialBioRef.current = bioDraft;
    setSaveState("saved");
  }

  const isDirty = useMemo(() => {
    if (!draft) return false;
    const original = items.find((member) => member.id === draft.id);
    const normalizedDraft: TeamMember = {
      ...draft,
      bio: textToBio(bioDraft),
      status: normalizeStatus(draft.status),
    };
    if (!original) return true;
    return serializeMember(original) !== serializeMember(normalizedDraft);
  }, [draft, bioDraft, items]);

  const currentPreviewUrl = draft?.imageUrl
    ? (previewMap.get(draft.imageUrl) ?? draft.imageUrl)
    : null;

  const currentLibraryOption =
    draft?.imageUrl &&
    !imageLibrary.some((entry) => entry.url === draft.imageUrl)
      ? draft.imageUrl
      : null;

  return (
    <main className="c-admin">
      <div className="admin-page-header">
        <h1 className="type-h2 admin-page-title">
          {editingId ? "Edit Team Bio" : "Team Bio Library"}
        </h1>
        <div className="admin-page-actions">
          {!editingId && (
            <button
              className="btnPrimary"
              type="button"
              onClick={startNewMember}
            >
              Add team member
            </button>
          )}
        </div>
      </div>

      <p className="muted type-small" style={{ marginTop: ".5rem" }}>
        Use the list view to open a team member. Changes are only saved when you
        click Save Draft or Publish. Use “Hidden” to remove someone from the
        public site without deleting their bio.
      </p>

      {!editingId && (
        <div className="card mt">
          <div className="dbResultsHeader">
            <div className="dbResultsHeader__sort">
              <span className="muted type-small">Library view</span>
            </div>
            <p className="muted dbResultsHeader__count">
              Showing {sorted.length} / {sorted.length}
            </p>
          </div>
          <div className="dbListGrid">
            {sorted.map((member) => {
              const status = normalizeStatus(member.status);
              const isPublished = status === "Published";
              const displayStatus = formatStatusLabel(status);
              return (
                <section key={member.id} className="card dbItem">
                  <div className="dbItemHeader">
                    <div className="dbItemMain">
                      <div
                        className="row"
                        style={{ gap: "0.75rem", alignItems: "center" }}
                      >
                        {member.imageUrl && (
                          <img
                            className="team-photo-preview__img"
                            src={
                              previewMap.get(member.imageUrl) ?? member.imageUrl
                            }
                            alt={`${member.name} photo`}
                          />
                        )}
                        <div className="c-stack" style={{ gap: ".15rem" }}>
                          <div className="dbItemClient">{member.name}</div>
                          <div className="dbItemTitle">{member.title}</div>
                        </div>
                      </div>
                    </div>
                    <div className="dbActions">
                      <button
                        className="btnSmall"
                        type="button"
                        onClick={() => startEditing(member)}
                      >
                        Edit
                      </button>
                      <button
                        className="btnSmall"
                        type="button"
                        onClick={() =>
                          upsertTeamMember({
                            ...member,
                            status: "Draft",
                          })
                        }
                        title="Hide this team member from the public site without deleting their bio."
                      >
                        {isPublished ? "Hide" : "Hidden"}
                      </button>
                    </div>
                  </div>
                  <div className="dbSummary">
                    {member.bio?.[0]
                      ? member.bio[0]
                      : "No bio yet — add a short summary."}
                  </div>
                  <div className="dbProps">
                    <div className="dbProp">
                      <div className="dbPropLabel">Publishing Status</div>
                      <div className="dbPillRow">
                        <span
                          className={`pill pill--status ${
                            isPublished ? "pill--published" : "pill--draft"
                          }`}
                        >
                          {displayStatus}
                        </span>
                      </div>
                    </div>
                    <div className="dbProp">
                      {/*<div className="dbPropLabel">Location</div>
                       <div className="dbPropValue">{member.location || "Not set"}</div> */}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      )}
      {editingId && draft && (
        <>
          <button className="btnLink" type="button" onClick={cancelEditing}>
            ← Back to list
          </button>
          <section className="card mt">
            <div className="team-editor-header">
              <h2 className="type-h2 team-editor-title">
                Editing {draft.name || "New team member"}
              </h2>
            </div>
            <div className="form-row form-group team-basic-row">
              <div className="form-field">
                <label className="form-label">Name</label>
                <input
                  className="input"
                  value={draft.name}
                  onChange={(e) => updateDraft({ name: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label className="form-label">Role</label>
                <input
                  className="input"
                  value={draft.title}
                  onChange={(e) => updateDraft({ title: e.target.value })}
                />
              </div>
            </div>

            <section className="team-photo-section">
              <div className="team-photo-section__header">
                <h3 className="type-h3">Photo</h3>
                <p className="muted type-small">
                  Keep all photo details together for quick updates.
                </p>
              </div>
              <div className="team-photo-grid">
                <div className="team-photo-controls">
                  <div className="form-row form-group team-photo-controls__row">
                    <div className="form-field">
                      <label className="form-label">
                        Select Photo from Image Library
                      </label>
                      <select
                        className="input"
                        value={draft.imageUrl ?? ""}
                        onChange={(e) => setDraftImage(e.target.value)}
                      >
                        <option value="">No photo selected</option>
                        {currentLibraryOption && (
                          <option value={currentLibraryOption}>
                            Current (
                            {currentLibraryOption.split("/").pop() ??
                              currentLibraryOption}
                            )
                          </option>
                        )}
                        {imageLibrary.map((entry) => (
                          <option key={entry.url} value={entry.url}>
                            {entry.label}
                          </option>
                        ))}
                      </select>
                      <p className="muted type-small" style={{ marginTop: 6 }}>
                        Choose from previously uploaded images or upload a new
                        file below.
                      </p>
                    </div>
                    <div className="form-field">
                      <label className="form-label">
                        Upload / replace photo
                      </label>
                      <input
                        className="input"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handlePhotoUpload(e.target.files?.[0] ?? null)
                        }
                      />
                      <p className="muted type-small" style={{ marginTop: 6 }}>
                        {draft.imageUrl
                          ? `Current photo: ${draft.imageUrl}`
                          : "No photo selected yet."}
                      </p>
                    </div>
                  </div>
                </div>
                {currentPreviewUrl && (
                  <div className="team-photo-preview team-photo-preview--inline">
                    <img
                      className="team-photo-preview__img"
                      src={currentPreviewUrl}
                      alt="Current photo"
                    />
                    <span className="muted type-small">
                      Preview of the current photo.
                    </span>
                  </div>
                )}
              </div>
            </section>

            {/* <div className="form-row form-group">
              <div className="form-field">
                <label className="form-label">Photo URL (advanced)</label>
                <input
                  className="input"
                  placeholder="/team/..."
                  value={draft.imageUrl ?? ""}
                  onChange={(e) => updateDraft({ imageUrl: e.target.value })}
                />
              </div>
            </div> */}

            <div
              className={[
                "form-group",
                "team-form__wide",
                "team-bio-grid",
                showMarkdownEditor ? "is-editing" : "is-preview-only",
              ].join(" ")}
            >
              {showMarkdownEditor ? (
                <div className="form-field team-bio-panel team-bio-panel--editor">
                  <label className="form-label">Raw Markdown</label>
                  <MiniFormatBar
                    textareaRef={textareaRef}
                    value={bioDraft}
                    onValueChange={(next) => {
                      setBioDraft(next);
                      updateDraft({ bio: textToBio(next) });
                    }}
                  />
                  <textarea
                    ref={textareaRef}
                    className="input"
                    rows={10}
                    value={bioDraft}
                    onChange={(e) => {
                      setBioDraft(e.target.value);
                      updateDraft({ bio: textToBio(e.target.value) });
                    }}
                  />
                  <p className="muted type-small" style={{ marginTop: 6 }}>
                    Use this only if you need raw Markdown control.
                  </p>
                </div>
              ) : null}
              <div className="team-bio-preview team-bio-panel">
                <div
                  className="team-bio-preview__header"
                  style={{ justifyContent: "flex-start", gap: ".35rem" }}
                >
                  <span>Bio</span>
                  <button
                    className="btnLink"
                    type="button"
                    onClick={() => setShowMarkdownEditor((prev) => !prev)}
                    title="Edit text directly here (plain text only). For bold, italics, or links, open the Markdown editor."
                  >
                    {showMarkdownEditor
                      ? "Hide text"
                      : "Open Markdown Text Editor"}
                  </button>
                </div>
                <div
                  ref={visualEditorRef}
                  className="c-markdown c-stack team-bio-preview__content"
                  contentEditable
                  role="textbox"
                  aria-multiline="true"
                  suppressContentEditableWarning
                  onInput={(event) => {
                    const nextText = event.currentTarget.innerText;
                    setBioDraft(nextText);
                    updateDraft({ bio: textToBio(nextText) });
                  }}
                >
                  <Markdown>{bioDraft || ""}</Markdown>
                </div>
              </div>
            </div>

            <div className="form-group team-order-field is-hidden">
              <label className="form-label">Order</label>
              <input
                className="input input--tiny"
                type="number"
                value={draft.order}
                onChange={(e) => updateDraft({ order: Number(e.target.value) })}
              />
            </div>

            <div className="team-editor-actionsBar">
              <div className="team-editor-actions">
                <div className="team-editor-actionColumn">
                  <button
                    className="btnPrimary team-editor-action team-editor-action--draft"
                    type="button"
                    onClick={() => saveDraft("Draft")}
                    style={{ background: "#fff" }}
                  >
                    Save draft
                  </button>
                  <div className="team-editor-helper">
                    <span className="muted type-small">
                      {isDirty ? "Unsaved changes" : "All changes saved"}
                    </span>
                    {saveState === "saved" && (
                      <span className="muted type-small">Saved</span>
                    )}
                  </div>
                </div>
                <div className="team-editor-actionColumn">
                  <button
                    className="btnPrimary team-editor-action"
                    type="button"
                    onClick={() => saveDraft("Published")}
                  >
                    Publish
                  </button>
                  <span
                    className={`pill pill--status ${
                      normalizeStatus(draft.status) === "Published"
                        ? "pill--published"
                        : "pill--draft"
                    }`}
                  >
                    {formatStatusLabel(draft.status)}
                  </span>
                </div>
                <div className="team-editor-actionColumn team-editor-actionColumn--toggle">
                  <label
                    className="row"
                    style={{ gap: ".4rem", alignItems: "center" }}
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(draft.isFounder)}
                      onChange={(e) =>
                        updateDraft({ isFounder: e.target.checked })
                      }
                    />
                    <span className="type-small">Founder</span>
                  </label>
                </div>
                <button
                  className="btnPrimary team-editor-action team-editor-action--cancel"
                  type="button"
                  onClick={cancelEditing}
                  style={{ background: "#fff" }}
                >
                  Cancel
                </button>
              </div>
            </div>
            <div className="team-editor-footer">
              <button className="btnLink" type="button" onClick={cancelEditing}>
                ← Back to list
              </button>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
