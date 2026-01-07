//apps/site/app/Providers.tsx
"use client";
import type { ReactNode } from "react";
import { AdminCaseStudyProvider } from "./admin/AdminCaseStudyStore";

export function Providers({ children }: { children: ReactNode }) {
  return <AdminCaseStudyProvider>{children}</AdminCaseStudyProvider>;
}