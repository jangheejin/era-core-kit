"use client";

import "@styles/admin-cms.css";

import { useMemo } from "react";
import { useAdminTeamMembers, type TeamMember } from "../AdminTeamStore";

function bioToText(bio: string[]) {
  return bio.join("\n\n");
}

function textToBio(value: string) {
  return value
    .split(/\n\s*\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export default function AdminTeamPage() {
  const { items, upsertTeamMember, removeTeamMember, resetToBaseline } = useAdminTeamMembers();

  const sorted = useMemo(() => items, [items]);

  function updateMember(id: string, patch: Partial<TeamMember>) {
    const existing = items.find((member) => member.id === id);
    if (!existing) return;
    upsertTeamMember({ ...existing, ...patch });
  }

  function addMember() {
    const id = typeof crypto !== "undefined" ? crypto.randomUUID() : String(Date.now());
    upsertTeamMember({
      id,
      name: "New team member",
      title: "Title",
      location: "",
      bio: [],
      imageUrl: "",
      isFounder: false,
      order: items.length + 1,
    });
  }

  async function handlePhotoUpload(
    id: string,
    file: File | null,
  ) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") updateMember(id, { imageUrl: result });
    };
    reader.readAsDataURL(file);
  }

  return (
    <main className="c-admin">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h1 className="type-h2">Team CMS</h1>
        <div className="row" style={{ gap: ".5rem" }}>
          <button className="btn-3" type="button" onClick={resetToBaseline}>
            Reset demo data
          </button>
          <button className="btnPrimary" type="button" onClick={addMember}>
            Add team member
          </button>
        </div>
      </div>

      <p className="muted type-small" style={{ marginTop: ".5rem" }}>
        Changes save instantly to your browser’s demo store and feed the public “Our Team” page.
      </p>

      <div className="c-stack mt">
        {sorted.map((member) => (
          <section key={member.id} className="card card-new">
            <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
              <div className="c-stack" style={{ flex: 1, gap: ".75rem" }}>
                <div className="form-row form-group">
                  <div className="form-field">
                    <label className="form-label">Name</label>
                    <input
                      className="input"
                      value={member.name}
                      onChange={(e) => updateMember(member.id, { name: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Title</label>
                    <input
                      className="input"
                      value={member.title}
                      onChange={(e) => updateMember(member.id, { title: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row form-group">
                  <div className="form-field">
                    <label className="form-label">Location</label>
                    <input
                      className="input"
                      placeholder="Optional"
                      value={member.location ?? ""}
                      onChange={(e) => updateMember(member.id, { location: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Order</label>
                    <input
                      className="input"
                      type="number"
                      value={member.order}
                      onChange={(e) => updateMember(member.id, { order: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="form-row form-group">
                  <div className="form-field">
                    <label className="form-label">Photo URL</label>
                    <input
                      className="input"
                      placeholder="https://..."
                      value={member.imageUrl ?? ""}
                      onChange={(e) => updateMember(member.id, { imageUrl: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Upload photo</label>
                    <input
                      className="input"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(member.id, e.target.files?.[0] ?? null)}
                    />
                  </div>
                </div>

                <div className="form-row form-group">
                  <div className="form-field">
                    <label className="form-label">Bio (paragraphs)</label>
                    <textarea
                      className="input"
                      rows={6}
                      value={bioToText(member.bio)}
                      onChange={(e) => updateMember(member.id, { bio: textToBio(e.target.value) })}
                    />
                    <p className="muted type-small" style={{ marginTop: 6 }}>
                      Separate paragraphs with a blank line.
                    </p>
                  </div>
                </div>

                <label className="row" style={{ gap: ".4rem", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={Boolean(member.isFounder)}
                    onChange={(e) => updateMember(member.id, { isFounder: e.target.checked })}
                  />
                  <span className="type-small">Founder</span>
                </label>
              </div>

              <div className="c-stack" style={{ marginLeft: "1rem", gap: ".5rem" }}>
                <button className="btnSmall" type="button" onClick={() => removeTeamMember(member.id)}>
                  Remove
                </button>
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
