//apps/site/app/admin/components/PreviewBanner.tsx
export function PreviewBanner() {
  return (
    <div className="c-banner c-banner--warning">
      <span className="c-banner__icon">⚠️</span>
      <div className="c-banner__text">
        <strong>Preview mode:</strong>{" "}
        You’re viewing a temporary, local-only version of this case study. Changes won’t persist.
      </div>
    </div>
  );
}