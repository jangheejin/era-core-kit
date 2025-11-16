//apps/site/app/admin/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const next = searchParams.get("next") || "/admin/case-studies/new";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Login failed.");
        setSubmitting(false);
        return;
      }

      // Cookie is set by the API, now go to admin area
      router.push(next);
      router.refresh();
    } catch (err) {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "4rem auto", padding: "1.5rem" }}>
      <h1
        style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.75rem" }}
      >
        Admin Login
      </h1>
      <p style={{ fontSize: "0.9rem", color: "#555", marginBottom: "1.5rem" }}>
        This is a prototype login just for the case study CMS demo.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
      >
        <label>
          <div>Password</div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "0.4rem" }}
            required
          />
        </label>

        {error && (
          <div style={{ fontSize: "0.85rem", color: "#b91c1c" }}>{error}</div>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            marginTop: "0.5rem",
            padding: "0.6rem 1rem",
            background: "#111",
            color: "#fff",
            borderRadius: 4,
            border: "1px solid #111",
            cursor: submitting ? "default" : "pointer",
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
