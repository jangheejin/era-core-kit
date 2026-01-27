// apps/site/app/admin/team/AdminTeamClient.tsx
"use client";
/* eslint-disable @next/next/no-img-element */

import "@styles/admin-cms.css";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

export function AdminTeamClient() {
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

  const startNewMember = useCallback(() => {
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
  }, [items.length]);

  useEffect(() => {
    const wantsNew = searchParams?.get("new") === "1";
    if (!wantsNew || editingId || didAutoStartRef.current) return;
    didAutoStartRef.current = true;
    startNewMember();
    router.replace("/admin/team");
  }, [searchParams, editingId, router, startNewMember]);

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

  function handleUpload(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result =
        typeof reader.result === "string" ? reader.result : undefined;
      if (!result) return;
      const url = result;
      const filename = sanitizeFilename(file.name);
      rememberImage({ url, label: filename, previewUrl: result });
      setDraftImage(url);
    };
    reader.readAsDataURL(file);
  }

  const saveMember = useCallback(() => {
    if (!draft) return;
    const next = {
      ...draft,
      bio: textToBio(bioDraft),
      status: normalizeStatus(draft.status),
    };
    upsertTeamMember(next);
    setSaveState("saved");
  }, [draft, bioDraft, upsertTeamMember]);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setDraft(null);
    setBioDraft("");
    setSaveState("idle");
    setShowMarkdownEditor(false);
  }, []);

  useEffect(() => {
    if (!draft) return;
    if (saveState !== "saved") return;
    const timer = window.setTimeout(() => {
      setSaveState("idle");
    }, 1600);
    return () => window.clearTimeout(timer);
  }, [draft, saveState]);

  function formatBioForCopy() {
    if (!draft) return "";
    return serializeMember({
      ...draft,
      bio: textToBio(bioDraft),
    });
  }

  function handleCopy() {
    if (typeof navigator === "undefined") return;
    const payload = formatBioForCopy();
    if (!payload) return;
    navigator.clipboard.writeText(payload);
  }

  function insertSnippet(snippet: string) {
    if (!textareaRef.current) {
      setBioDraft((prev) => `${prev}\n\n${snippet}`.trim());
      return;
    }
    const textarea = textareaRef.current;
    const start = textarea.selectionStart ?? bioDraft.length;
    const end = textarea.selectionEnd ?? bioDraft.length;
    const before = bioDraft.slice(0, start);
    const after = bioDraft.slice(end);
    const next = `${before}${snippet}${after}`;
    setBioDraft(next);
    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + snippet.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  }

  return (
    <main className="c-admin admin-dashboard">
      <div className="admin-page-header">
        <h1 className="type-h2 admin-page-title">Team Members</h1>
        <div className="admin-page-actions">
          <button className="btnPrimary" type="button" onClick={startNewMember}>
            Add team member
          </button>
        </div>
      </div>

      <div className="admin-home-split">
        <div className="admin-list">
          {sorted.map((member) => (
            <div key={member.id} className="card team-card">
              <div className="team-card__body">
                <div className="team-card__text">
                  <h3 className="type-h3">{member.name}</h3>
                  <p className="type-body">{member.title}</p>
                  {member.location ? (
                    <p className="type-small muted">{member.location}</p>
                  ) : null}
                </div>
                <div className="team-card__meta">
                  <span className="pill">{formatStatusLabel(member.status)}</span>
                  <button
                    className="btnSmall"
                    type="button"
                    onClick={() => startEditing(member)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-editor">
          {draft ? (
            <div className="card editor-card">
              <div className="editor-header">
                <h2 className="type-h3">Edit team member</h2>
                <div className="editor-actions">
                  <button className="btnSmall" type="button" onClick={handleCopy}>
                    Copy JSON
                  </button>
                  <button className="btnSmall" type="button" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </div>

              <div className="admin-field">
                <label className="admin-label" htmlFor="teamName">
                  Name
                </label>
                <input
                  id="teamName"
                  className="admin-input"
                  value={draft.name}
                  onChange={(e) => updateDraft({ name: e.target.value })}
                />
              </div>

              <div className="admin-field">
                <label className="admin-label" htmlFor="teamTitle">
                  Title
                </label>
                <input
                  id="teamTitle"
                  className="admin-input"
                  value={draft.title}
                  onChange={(e) => updateDraft({ title: e.target.value })}
                />
              </div>

              <div className="admin-field">
                <label className="admin-label" htmlFor="teamLocation">
                  Location
                </label>
                <input
                  id="teamLocation"
                  className="admin-input"
                  value={draft.location ?? ""}
                  onChange={(e) => updateDraft({ location: e.target.value })}
                />
              </div>

              <div className="admin-field">
                <label className="admin-label" htmlFor="teamStatus">
                  Status
                </label>
                <select
                  id="teamStatus"
                  className="admin-select"
                  value={draft.status ?? "Draft"}
                  onChange={(e) =>
                    updateDraft({
                      status:
                        e.target.value === "Published" ? "Published" : "Draft",
                    })
                  }
                >
                  <option value="Draft">Hidden</option>
                  <option value="Published">Published</option>
                </select>
              </div>

              <div className="admin-field">
                <label className="admin-label" htmlFor="teamImage">
                  Image
                </label>
                <div className="row">
                  <select
                    id="teamImage"
                    className="admin-select"
                    value={draft.imageUrl ?? ""}
                    onChange={(e) => setDraftImage(e.target.value)}
                  >
                    <option value="">No image</option>
                    {imageLibrary.map((entry) => (
                      <option key={entry.url} value={entry.url}>
                        {entry.label}
                      </option>
                    ))}
                  </select>
                  <input
                    className="admin-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUpload(e.target.files?.[0] ?? null)}
                  />
                </div>
                {draft.imageUrl ? (
                  <div className="team-image-preview">
                    <img
                      src={previewMap.get(draft.imageUrl) ?? draft.imageUrl}
                      alt={draft.name}
                    />
                  </div>
                ) : null}
              </div>

              <div className="admin-field">
                <label className="admin-label" htmlFor="teamBio">
                  Bio
                </label>
                <div className="admin-toggle-row">
                  <button
                    className="btnSmall"
                    type="button"
                    onClick={() => setShowMarkdownEditor((prev) => !prev)}
                  >
                    {showMarkdownEditor ? "Hide preview" : "Preview bio"}
                  </button>
                </div>
                <MiniFormatBar
                  textareaRef={textareaRef}
                  value={bioDraft}
                  onValueChange={(next) => {
                    setBioDraft(next);
                    updateDraft({ bio: textToBio(next) });
                  }}
                />
                <textarea
                  id="teamBio"
                  className="admin-textarea"
                  value={bioDraft}
                  onChange={(e) => setBioDraft(e.target.value)}
                  ref={textareaRef}
                  rows={8}
                />
                {showMarkdownEditor ? (
                  <div className="editor-preview" ref={visualEditorRef}>
                    <Markdown>{bioDraft}</Markdown>
                  </div>
                ) : null}
              </div>

              <div className="editor-actions">
                <button className="btnPrimary" type="button" onClick={saveMember}>
                  Save
                </button>
                {saveState === "saved" ? (
                  <span className="pill">Saved</span>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="card editor-card">
              <p className="type-body muted">Select a team member to edit.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
