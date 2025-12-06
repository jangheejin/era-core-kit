//apps/site/app/admin/components/AlertBanner.tsx
"use client";

import React from "react";
import styles from "./AlertBanner.module.css";

type AlertBannerProps = {
  children: React.ReactNode;
};

export function AlertBanner({ children }: AlertBannerProps) {
  return (
    <div className={styles.alertBanner}>
      {children}
    </div>
  );
}
