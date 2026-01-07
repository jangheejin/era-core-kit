//apps/site/app/admin/components/AlertBanner.tsx
"use client";

//import React from "react";
import type { ReactNode } from "react";
import clsx from "clsx";

export type AlertVariant = "info" | "success" | "warning" | "error";

export function AlertBanner({
  variant = "info",
  children,
}: {
  variant?: AlertVariant;
  children: ReactNode;
}) {
  return <div className={clsx("alert-banner", `alert-${variant}`)}>{children}</div>;
}

/* type AlertBannerProps = {
  children: React.ReactNode;
};

export function AlertBanner({ children }: AlertBannerProps) {
  return (
    <div className={styles.alertBanner}>
      {children}
    </div>
  );
}
 */