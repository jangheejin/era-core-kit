//apps/site/app/Providers.tsx
"use client";
import type { ReactNode } from "react";
import { AdminCaseStudyProvider } from "./admin/AdminCaseStudyStore";
import { MockCMSProvider } from '@/cms/mockCmsStore';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AdminCaseStudyProvider>
      <MockCMSProvider>
        {children}
      </MockCMSProvider>
    </AdminCaseStudyProvider>
  );
}