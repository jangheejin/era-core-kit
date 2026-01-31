// apps/site/app/admin/AdminCssWrapper.tsx
"use client";
import type { ReactNode } from "react";
import "@styles/admin-cms.css";

export default function AdminCssWrapper({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
