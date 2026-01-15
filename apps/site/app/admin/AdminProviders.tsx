//apps/site/app/admin/AdminProviders.tsx
"use client";
import type { ReactNode } from "react";
import { AdminCaseStudyProvider } from "./AdminCaseStudyStore";
import { AdminClientPageProvider } from "./AdminClientPageStore";

export default function AdminProviders({ children }: { children: ReactNode }) {
  return <AdminCaseStudyProvider>{children}</AdminCaseStudyProvider>;
}