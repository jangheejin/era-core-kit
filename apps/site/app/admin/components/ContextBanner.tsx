//apps/site/app/admin/components/ContextBanner.tsx
import React from "react";

type ContextBannerProps = {
  view: "preview" | "editor" | "list";
  children?: React.ReactNode;
};

const viewLabels: Record<ContextBannerProps["view"], string> = {
  preview: "Preview Mode",
  editor: "Editor Mode",
  list: "Case Studies List",
};

export function ContextBanner({ view, children }: ContextBannerProps) {
  return (
    <aside className={`context-banner context-banner--${view}`}>
      <div className="context-banner__title">{viewLabels[view]}</div>
      {children && <div className="context-banner__body">{children}</div>}
    </aside>
  );
}
