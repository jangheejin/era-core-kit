//apps/site/app/admin/AdminCaseStudyStore.tsx
// This is only in memory for the current browser session
'use client';

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import type { CaseStudy as CaseStudyType } from '@kit/schema';

type AdminCaseStudyContextValue = {
  items: CaseStudyType[];
  addCaseStudy: (cs: CaseStudyType) => void;
};

const AdminCaseStudyContext = createContext<AdminCaseStudyContextValue | null>(
  null,
);

export function AdminCaseStudyProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CaseStudyType[]>([]);

  const addCaseStudy = (cs: CaseStudyType) => {
    setItems((prev) => {
      // avoid duplicate slugs in this session
      const filtered = prev.filter((p) => p.slug !== cs.slug);
      return [...filtered, cs];
    });
  };

  return (
    <AdminCaseStudyContext.Provider value={{ items, addCaseStudy }}>
      {children}
    </AdminCaseStudyContext.Provider>
  );
}

export function useAdminCaseStudies() {
  const ctx = useContext(AdminCaseStudyContext);
  if (!ctx) {
    throw new Error(
      'useAdminCaseStudies must be used within <AdminCaseStudyProvider>',
    );
  }
  return ctx;
}