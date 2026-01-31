//apps/site/app/Providers.tsx
"use client";
import type { ReactNode } from "react";
import { AdminCaseStudyProvider } from "./admin/AdminCaseStudyStore";
import { AdminClientPageProvider } from "./admin/AdminClientPageStore";
import { AdminTeamProvider } from "./admin/AdminTeamStore";
import { AdminHomeProvider } from "./admin/AdminHomeStore";
import { MockCMSProvider } from "@/cms/mockCmsStore";

/* export function Providers({ children }: { children: ReactNode }) {
  return (
    <AdminCaseStudyProvider>
      <MockCMSProvider>
        {children}
      </MockCMSProvider>
    </AdminCaseStudyProvider>
  );
} */

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AdminCaseStudyProvider>
      <AdminClientPageProvider>
        <AdminTeamProvider>
          <AdminHomeProvider>
            <MockCMSProvider>{children}</MockCMSProvider>
          </AdminHomeProvider>
        </AdminTeamProvider>
      </AdminClientPageProvider>
    </AdminCaseStudyProvider>
  );
}
